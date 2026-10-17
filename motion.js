/* Four scenes, native scrolling. No hijacked wheels, autoplay audio or scroll locks. */
(() => {
 const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
 const story=$(".cinema-story"),stage=$(".cinema-sticky"),steps=$$(".story-step");
 if(!story||!stage)return;
 const reduced=matchMedia("(prefers-reduced-motion: reduce)"),clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,Number.isFinite(x)?x:0));
 const labels=["01 / AN IDEA ARRIVES","02 / THE NOTEBOOK OPENS","03 / WORDS FIND THEIR WINGS","04 / THE LAMP STAYS ON"],times=["6:12 PM","6:26 PM","7:03 PM","7:21 PM"];
 const dots=document.createElement("nav");dots.className="chapter-dots";dots.setAttribute("aria-label","Story scenes");
 steps.forEach((s,i)=>{const a=document.createElement("a");a.href="#"+s.id;a.setAttribute("aria-label","Scene "+(i+1)+": "+labels[i].split("/")[1].trim());dots.append(a);});document.body.append(dots);
 function animateHeading(h,hero=false){
   const clone=h.cloneNode(true);clone.querySelectorAll("br").forEach(br=>br.replaceWith(" "));h.setAttribute("aria-label",clone.textContent.replace(/\s+/g," ").trim());let n=0;
   function walk(node){[...node.childNodes].forEach(child=>{if(child.nodeType===Node.TEXT_NODE){const fragment=document.createDocumentFragment();child.textContent.split(/(\s+)/).forEach(word=>{if(!word.trim()){fragment.append(document.createTextNode(word));return;}const mask=document.createElement("span");mask.className="word-mask";mask.setAttribute("aria-hidden","true");const span=document.createElement("span");span.style.setProperty("--word-delay",(n++*(hero?100:45))+"ms");if(hero)span.className="hero-word";span.textContent=word;mask.append(span);fragment.append(mask);});child.replaceWith(fragment);}else if(child.nodeType===Node.ELEMENT_NODE)walk(child);});}walk(h);h.classList.add("animated-heading");
 }
 const headings=$$("h1,h2");headings.forEach(h=>animateHeading(h,h.tagName==="H1"));
 if("IntersectionObserver" in window){const io=new IntersectionObserver(entries=>entries.forEach(en=>{if(en.isIntersecting){en.target.classList.add("in");io.unobserve(en.target);}}),{threshold:.12});headings.forEach(h=>io.observe(h));}else headings.forEach(h=>h.classList.add("in"));
 let centers=[],top=0,height=0,ticking=false,act=-1;
 const lerp=(a,b,t)=>a+(b-a)*t;
 const set=(name,value)=>stage.style.setProperty(name,value);
 function measure(){top=story.getBoundingClientRect().top+scrollY;height=story.offsetHeight;centers=steps.map(s=>s.getBoundingClientRect().top+scrollY+s.offsetHeight*.5);schedule();}
 function update(){
  ticking=false;const vh=innerHeight,y=scrollY;
  const p=clamp((y+vh*.5-centers[0])/Math.max(1,centers.at(-1)-centers[0]));
  let current=0;centers.forEach((center,i)=>{if(y+vh*.55>=center-vh*.16)current=i;});
  if(current!==act){act=current;stage.dataset.act=String(act);$("#storyChapterLabel").textContent=labels[act];$("#sceneTime").textContent=times[act];[...dots.children].forEach((a,i)=>{a.classList.toggle("active",i===act);if(i===act)a.setAttribute("aria-current","step");else a.removeAttribute("aria-current");});}
  set("--story-p",p.toFixed(4));dots.classList.toggle("visible",y+vh*.5>top&&y+vh*.5<top+height);
  const doc=document.documentElement;$(".reading-progress").style.transform="scaleX("+clamp(y/Math.max(1,doc.scrollHeight-vh))+")";
  // Every prop has a discrete readable reduced-motion state.
  if(reduced.matches){
    set("--camera-scale","1");set("--camera-x","0%");set("--camera-y","0%");set("--night",String([.03,.18,.35,.58][act]));
    set("--envelope-opacity",act===0?"1":"0");set("--envelope-x","0px");set("--envelope-y","0px");set("--envelope-rotate","-8deg");
    set("--book-opacity",act===1?"1":"0");set("--book-y","0px");set("--book-scale","1");set("--page-angle","0deg");set("--ink-offset","0");
    set("--notes-opacity",act===2?"1":"0");set("--note-y","0px");set("--note-x","0px");set("--flight-opacity","0");
    set("--last-note-opacity",act===3?"1":"0");set("--last-note-y","0px");return;
  }
  const mobile=innerWidth<=680,raw=p*3,index=Math.min(2,Math.floor(raw)),t=raw-index;
  const camera=[[1.02,0,0],[1.24,-2,3],[1.13,-1,0],[1.05,0,0]];
  set("--camera-scale",String(lerp(camera[index][0],camera[index+1][0],t)));set("--camera-x",lerp(camera[index][1],camera[index+1][1],t).toFixed(2)+"%");set("--camera-y",lerp(camera[index][2],camera[index+1][2],t).toFixed(2)+"%");
  set("--night",(.03+p*.58).toFixed(3));
  const arrival=clamp(p/.19),envelopeFade=1-clamp((p-.18)/.09);
  set("--envelope-opacity",envelopeFade.toFixed(3));set("--envelope-x",((1-arrival)*(mobile?55:140)).toFixed(1)+"px");set("--envelope-y",((1-arrival)*-90).toFixed(1)+"px");set("--envelope-rotate",lerp(-24,-7,arrival).toFixed(1)+"deg");
  const bookIn=clamp((p-.2)/.11),bookOut=1-clamp((p-.48)/.12),ink=clamp((p-.27)/.2);
  set("--book-opacity",Math.min(bookIn,bookOut).toFixed(3));set("--book-y",((1-bookIn)*65).toFixed(1)+"px");set("--book-scale",(.86+bookIn*.14).toFixed(3));set("--page-angle",(-48*(1-bookIn)).toFixed(1)+"deg");set("--ink-offset",(1-ink).toFixed(3));set("--writing-progress",String(ink));
  const notesIn=clamp((p-.47)/.15),notesOut=1-clamp((p-.76)/.13);
  set("--notes-opacity",Math.min(notesIn,notesOut).toFixed(3));set("--note-x",((1-notesIn)*-35).toFixed(1)+"px");set("--note-y",((1-notesIn)*110).toFixed(1)+"px");
  const flight=clamp((p-.52)/.29);set("--flight-opacity",Math.min(notesIn,notesOut).toFixed(3));set("--flight-offset",(1-flight).toFixed(3));set("--plane-x",(-480*(1-flight)).toFixed(1)+"px");set("--plane-y",(220*(1-flight)-110*Math.sin(Math.PI*flight)).toFixed(1)+"px");set("--plane-angle",(-15+20*flight).toFixed(1)+"deg");
  const end=clamp((p-.79)/.16);set("--last-note-opacity",end.toFixed(3));set("--last-note-y",((1-end)*70).toFixed(1)+"px");
 }
 function schedule(){if(!ticking){ticking=true;requestAnimationFrame(update);}}
 addEventListener("scroll",schedule,{passive:true});addEventListener("resize",measure,{passive:true});
 if("ResizeObserver" in window)new ResizeObserver(measure).observe(story);
 document.fonts?.ready.then(measure);reduced.addEventListener("change",measure);
 const pause=$("#motionToggle");
 let paused=false;try{paused=localStorage.getItem("studio-ambient-paused")==="1";}catch{}
 function setPaused(value){paused=value;document.body.dataset.ambient=paused?"paused":"playing";pause.setAttribute("aria-pressed",String(paused));pause.textContent=paused?"Resume ambient motion ▷":"Pause ambient motion Ⅱ";try{localStorage.setItem("studio-ambient-paused",paused?"1":"0");}catch{}}
 setPaused(paused);pause.addEventListener("click",()=>setPaused(!paused));
 const hero=$(".room-hero"),heroCamera=$(".hero-room .room-camera");
 if(matchMedia("(hover: hover) and (pointer: fine)").matches){hero.addEventListener("pointermove",ev=>{if(reduced.matches||paused)return;const r=hero.getBoundingClientRect();heroCamera.style.setProperty("--pointer-x",((ev.clientX/r.width-.5)*-10).toFixed(1)+"px");heroCamera.style.setProperty("--pointer-y",(((ev.clientY-r.top)/r.height-.5)*-7).toFixed(1)+"px");});hero.addEventListener("pointerleave",()=>{heroCamera.style.setProperty("--pointer-x","0px");heroCamera.style.setProperty("--pointer-y","0px");});}
 measure();
})();
