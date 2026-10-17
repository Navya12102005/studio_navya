/* One pinned painting, one reversible scroll timeline, native document scrolling. */
(() => {
 const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
 const journey=$('#roomJourney'),scene=$('#continuousScene'),steps=$$('.story-step');
 if(!journey||!scene||!steps.length)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const clamp=n=>Math.max(0,Math.min(1,Number.isFinite(n)?n:0));
 const labels=['01 / AN IDEA ARRIVES','02 / THE NOTEBOOK OPENS','03 / WORDS FIND THEIR WINGS','04 / THE LAMP STAYS ON'];
 function animateHeading(h){
  const clone=h.cloneNode(true);clone.querySelectorAll('br').forEach(br=>br.replaceWith(' '));h.setAttribute('aria-label',clone.textContent.replace(/\s+/g,' ').trim());let n=0;
  function walk(node){[...node.childNodes].forEach(child=>{if(child.nodeType===Node.TEXT_NODE){const fragment=document.createDocumentFragment();child.textContent.split(/(\s+)/).forEach(word=>{if(!word.trim()){fragment.append(document.createTextNode(word));return;}const mask=document.createElement('span');mask.className='word-mask';mask.setAttribute('aria-hidden','true');const span=document.createElement('span');span.style.setProperty('--word-delay',(n++*45)+'ms');span.textContent=word;mask.append(span);fragment.append(mask);});child.replaceWith(fragment);}else if(child.nodeType===Node.ELEMENT_NODE)walk(child);});}walk(h);h.classList.add('animated-heading');
 }
 const headings=$$('h1,h2').filter(h=>!h.closest('.story-diary'));headings.forEach(animateHeading);
 if('IntersectionObserver' in window){const io=new IntersectionObserver(entries=>entries.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}}),{threshold:.12});headings.forEach(h=>io.observe(h));}else headings.forEach(h=>h.classList.add('in'));
 let top=0,height=1,centers=[],ticking=false,act=-1;
 function measure(){top=journey.getBoundingClientRect().top+scrollY;height=journey.offsetHeight;centers=steps.map(s=>s.getBoundingClientRect().top+scrollY+s.offsetHeight*.5);schedule();}
 function update(){
  ticking=false;const vh=innerHeight,y=scrollY,p=clamp((y-top)/Math.max(1,height-vh));
  let current=0;centers.forEach((center,i)=>{if(y+vh*.55>=center-vh*.16)current=i;});
  if(current!==act){act=current;scene.dataset.act=String(act);$('#storyChapterLabel').textContent=labels[act];}
  scene.style.setProperty('--story-p',p.toFixed(5));
  const night=reduced.matches?[.03,.18,.35,.58][act]:.03+p*.58;
  scene.style.setProperty('--night',night.toFixed(4));
  scene.style.setProperty('--desk-scene-x',(reduced.matches?0:-Math.sin(p*Math.PI)*7).toFixed(2)+'px');
  scene.style.setProperty('--desk-scene-y',(reduced.matches?0:-Math.sin(p*Math.PI)*4).toFixed(2)+'px');
  const minutes=Math.round(6*60+12+p*69),hour=Math.floor(minutes/60);
  $('#sceneTime').textContent=(hour%12||12)+':'+String(minutes%60).padStart(2,'0')+' PM';
  window.StudioRoom?.setProgress(p);
  const doc=document.documentElement;$('.reading-progress').style.transform='scaleX('+clamp(y/Math.max(1,doc.scrollHeight-vh))+')';
 }
 function schedule(){if(!ticking){ticking=true;requestAnimationFrame(update);}}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',measure,{passive:true});
 if('ResizeObserver' in window)new ResizeObserver(measure).observe(journey);
 document.fonts?.ready.then(measure);reduced.addEventListener('change',measure);
 const pause=$('#motionToggle');let paused=false;try{paused=localStorage.getItem('studio-ambient-paused')==='1';}catch{}
 function setPaused(value){paused=value;document.body.dataset.ambient=paused?'paused':'playing';pause.setAttribute('aria-pressed',String(paused));pause.textContent=paused?'Resume ambient motion ▷':'Pause ambient motion Ⅱ';try{localStorage.setItem('studio-ambient-paused',paused?'1':'0');}catch{}}
 setPaused(paused);pause.addEventListener('click',()=>setPaused(!paused));measure();
})();
