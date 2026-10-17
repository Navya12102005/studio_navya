/* One small diary beside one persistent room. Entries follow native document scroll. */
(() => {
  const api=window.StudioRoom,story=document.querySelector('#story'),stage=document.querySelector('.story-stage');
  if(!api||!story||!stage)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const panels=[...document.querySelectorAll('.narrative-panel')];
  const pages=panels.map((p,i)=>{
    const h=p.querySelector('h2').cloneNode(true);h.querySelectorAll('br').forEach(br=>br.replaceWith(' '));
    const body=[...p.querySelectorAll(':scope > p:not(.eyebrow)')].map(p=>p.outerHTML).join('');
    const links=[...p.querySelectorAll(':scope > a')].map(a=>a.outerHTML).join('');
    const aside=p.querySelector('.handwritten')?.textContent||'';
    return {number:i+1,label:p.querySelector('.eyebrow').textContent,title:h.textContent,body,aside,links,service:p.querySelector('.story-service')?.textContent||''};
  });
  const compactEntries=[
    ['A little “what if”…','Every good story starts with an idea. Pull up a chair.'],
    ['Finding your voice.','A conversation. A first draft. A voice that feels unmistakably yours.'],
    ['Let the story travel.','A post. A LinkedIn thought. An email. Your words, finding their people.'],
    ['Your next chapter.','Night falls. The lamps glow. Your idea has a voice. Shall we begin?']
  ];
  pages.forEach((entry,i)=>{entry.title=compactEntries[i][0];entry.body='<p>'+window.Studio.esc(compactEntries[i][1])+'</p>';});
  // The old panels only mark chapter geometry; the diary owns all visible narration.
  panels.forEach(p=>{p.hidden=true;p.setAttribute('aria-hidden','true');});
  pages.unshift({number:0,label:'a note from Navya',title:'Make yourself at home.',body:'<p>Words with warmth. Thoughtful strategy. A presence that feels like you.</p>',aside:'make yourself at home.',links:'<a href="#story">Open the first page ↓</a><a href="#services">Find your service ↗</a>',service:'Social · LinkedIn · Email · Content'});
  const book=document.createElement('section');book.className='story-diary';book.setAttribute('aria-label','The Studio Navya diary');book.innerHTML='<div class="diary-cover" aria-hidden="true"></div><div class="diary-page-edges" aria-hidden="true"></div><div class="diary-open-pages"><div class="diary-left-page"></div><div class="diary-right-page"></div><div class="diary-gutter" aria-hidden="true"></div></div><span class="diary-ribbon" aria-hidden="true"></span>';
  const orbit=document.createElement('div');orbit.className='diary-orbit-layer';orbit.append(book);document.body.append(orbit);let current=-1,ticking=false;
  const esc=window.Studio.esc;
  const sketch='<svg class="diary-sketch" viewBox="0 0 220 110" fill="none" aria-hidden="true"><path d="M20 86c18 7 39 4 47-8m-22 9c1-13 2-33-5-43m3 20c-20-12-20-30-10-26 13 4 12 16 10 26m0-1c18-22 27-13 22-5-4 8-14 8-22 5M93 70l74-8 23 17-77 10-20-19Zm0 0 4-16 69-8 1 16m-66 4 59-7m-48 30 2 6 77-11-1-5m-72-24 34-4M35 30c7-18 16-16 18-7s-11 7-18 7Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function revealCopy(root){
    root.querySelectorAll('[data-ink]').forEach(el=>el.classList.add('diary-copy'));
  }
  function page(index){
    if(index===current)return;const p=pages[index];current=index;
    const left=book.querySelector('.diary-left-page'),right=book.querySelector('.diary-right-page');
    left.innerHTML='<p class="diary-imprint">the studio diary</p><span class="diary-date">'+esc(p.number?'an evening, unfolding…':'a little room for big ideas')+'</span><h2 data-ink>'+esc(p.title)+'</h2>'+sketch+'<span class="diary-page-number">'+(p.number?'0'+p.number:'the beginning')+'</span>';
    right.innerHTML='<p class="diary-entry-date">'+esc(p.label)+'</p><div class="diary-body">'+p.body+'</div><p class="diary-aside" data-ink>'+esc(p.aside)+'</p>'+(p.service?'<p class="diary-service-line">'+esc(p.service)+'</p>':'')+'<nav class="diary-page-links" aria-label="Diary page links">'+p.links+'</nav><span class="diary-signature">with intention, <i data-owner>'+esc(window.Studio.site.name||'Navya')+'</i></span>';
    right.querySelectorAll('.diary-body p').forEach(el=>el.setAttribute('data-ink',''));
    revealCopy(book);
    book.dataset.page=String(index);
  }
  function place(){
    ticking=false;const rect=story.getBoundingClientRect(),inStory=rect.top<innerHeight*.58;
    const detailsTop=document.querySelector('#diaryDetails').getBoundingClientRect().top;const fade=Math.max(0,Math.min(1,(innerHeight*.85-detailsTop)/(innerHeight*.6)));orbit.style.opacity=String(1-fade);orbit.hidden=fade>=1;book.inert=fade>.8;book.style.pointerEvents=fade>.8?'none':'auto';book.dataset.phase=inStory?'story':'opening';
    const index=inStory?Math.min(4,Number(stage.dataset.act||0)+1):0;page(index);
    const p=inStory?api.state.progress:0;
    // The diary stays on the left. Movement is deliberately small and never crosses the room.
    const y=inStory?Math.sin(p*Math.PI*2)*7:0;
    const r=inStory?-1.5+Math.sin(p*Math.PI*2)*.7:-1.5;
    book.style.setProperty('--diary-y',(reduced.matches?0:y).toFixed(1)+'px');
    book.style.setProperty('--diary-turn',(reduced.matches?0:r).toFixed(2)+'deg');
  }
  function schedule(){if(!ticking){ticking=true;requestAnimationFrame(place);}}
  api.subscribe(schedule);addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});reduced.addEventListener('change',schedule);
  document.fonts?.ready.then(schedule);page(0);schedule();
})();
