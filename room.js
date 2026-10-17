/* Controls for the original painted room. Native vertical scrolling is preserved. */
(() => {
  const worlds=[...document.querySelectorAll('.room-world')];if(!worlds.length)return;
  const state={yaw:0,pitch:0,progress:0,exploring:false,breeze:false,night:false,greetingUntil:0,engine:'illustrated'};
  const listeners=new Set(),body=document.body,caption=document.querySelector('#roomAside');
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  function emit(){worlds.forEach(el=>{el.dataset.yaw=(state.yaw*180/Math.PI).toFixed(2);el.dataset.pitch=(state.pitch*180/Math.PI).toFixed(2);el.style.setProperty('--art-x',(-state.yaw*55).toFixed(2)+'px');el.style.setProperty('--art-y',(state.pitch*40).toFixed(2)+'px');});listeners.forEach(fn=>fn(state));}
  function look(dx,dy){state.yaw=clamp(state.yaw+dx,-.14,.14);state.pitch=clamp(state.pitch+dy,-.078,.078);emit();}
  const api=window.StudioRoom={state,subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);},setProgress(p){state.progress=Math.max(0,Math.min(1,Number.isFinite(p)?p:0));emit();},look,ready(value){state.engine=value;body.dataset.roomEngine=value;emit();}};
  function explore(value){const words=document.querySelector('.story-steps');if(words){words.inert=value;if(value)words.setAttribute('aria-hidden','true');else words.removeAttribute('aria-hidden');}state.exploring=value;body.classList.toggle('exploring',value);document.querySelectorAll('[data-explore],#exploreToggle').forEach(el=>{el.setAttribute('aria-pressed',String(value));el.textContent=value?'Back to the diary':'View the room';});if(value){const visible=worlds.find(el=>{const r=el.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0;})||worlds[0];visible.focus({preventScroll:true});}emit();}
  document.querySelectorAll('[data-explore],#exploreToggle').forEach(el=>el.addEventListener('click',()=>explore(!state.exploring)));
  document.querySelector('#resetView')?.addEventListener('click',()=>{state.yaw=0;state.pitch=0;emit();if(caption)caption.textContent='Back to the writing desk. Make yourself at home.';});

  const lamp=document.querySelector('#lampSwitch');lamp?.addEventListener('click',()=>{state.night=!state.night;body.classList.toggle('room-night',state.night);lamp.setAttribute('aria-pressed',String(state.night));lamp.querySelector('span').textContent=state.night?'Return to the story light':'Preview the night';if(caption)caption.textContent=state.night?'The lights come on. There’s no rush.':'The best ideas arrive around golden hour.';emit();});
  const breeze=document.querySelector('#breezeToggle');breeze?.addEventListener('click',()=>{state.breeze=!state.breeze;body.classList.toggle('window-open',state.breeze);breeze.setAttribute('aria-pressed',String(state.breeze));breeze.textContent=state.breeze?'Follow the story breeze':'Let the breeze in';emit();});
  document.querySelector('#dogHello')?.addEventListener('click',()=>{state.greetingUntil=performance.now()+4200;body.classList.add('dog-stir');if(caption)caption.textContent='A sleepy hello. A little tail wag. You’re in good company.';emit();setTimeout(()=>body.classList.remove('dog-stir'),4200);});
  worlds.forEach(el=>{
    el.tabIndex=0;el.setAttribute('role','region');el.setAttribute('aria-label','Original painted sunset studio. Drag for gentle depth movement; scroll vertically for the story. View the room hides the diary. Arrow keys adjust the view; Home resets it.');
    let drag=null;
    el.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY};el.setPointerCapture?.(e.pointerId);el.classList.add('dragging');});
    el.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;look(-(e.clientX-drag.x)*.004,(e.clientY-drag.y)*.0035);drag.x=e.clientX;drag.y=e.clientY;});
    const stop=()=>{drag=null;el.classList.remove('dragging');};['pointerup','pointercancel','lostpointercapture'].forEach(name=>el.addEventListener(name,stop));
    el.addEventListener('wheel',e=>{let dx=e.deltaX,dy=e.deltaY;if(e.shiftKey&&Math.abs(dx)<1){dx=dy;dy=0;}if(Math.abs(dx)<.5)return;look(dx*.002,-dy*.0006);if(Math.abs(dy)<.01)e.preventDefault();},{passive:false});
    el.addEventListener('keydown',e=>{const keys={ArrowLeft:[-.12,0],ArrowRight:[.12,0],ArrowUp:[0,.10],ArrowDown:[0,-.10]};if(keys[e.key]){e.preventDefault();look(...keys[e.key]);}else if(e.key==='Home'){e.preventDefault();state.yaw=0;state.pitch=0;emit();}});
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&state.exploring){e.stopImmediatePropagation();explore(false);document.querySelector('#exploreToggle')?.focus();}},true);
  const fullscreen=document.querySelector('#roomFullscreen');fullscreen?.addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else{explore(true);const hero=document.querySelector('#continuousScene');if(hero.requestFullscreen)await hero.requestFullscreen();else if(caption)caption.textContent='Explore mode is on. Fullscreen is unavailable in this browser.';}}catch{if(caption)caption.textContent='Explore mode is ready. This browser did not allow fullscreen.';}});
  document.addEventListener('fullscreenchange',()=>fullscreen?.setAttribute('aria-pressed',String(!!document.fullscreenElement)));
  api.ready('illustrated');
})();
