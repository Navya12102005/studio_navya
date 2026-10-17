/* A four-chapter brand story. Only transforms/opacity change on scroll. */
(() => {
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const reduced=matchMedia("(prefers-reduced-motion: reduce)");
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const hero=$(".hero"), art=$(".hero-art"), copy=$(".hero-copy"), texture=$(".hero-texture");
const story=$(".brand-story"), stage=$(".story-stage"), steps=$$(".story-step");
if(!story)return;
steps.forEach((s,i)=>s.id="chapter-"+(i+1));
const dots=document.createElement("nav");dots.className="chapter-dots";dots.setAttribute("aria-label","Story chapters");
steps.forEach((s,i)=>{const a=document.createElement("a");a.href="#"+s.id;a.setAttribute("aria-label","Chapter "+(i+1)+": "+s.querySelector(".eyebrow").textContent.split("/")[1].trim());dots.append(a);});document.body.append(dots);
// Word masks preserve em and br tags and expose a single readable heading.
function animateHeading(h,heroHeading=false){
 const accessible=h.cloneNode(true);accessible.querySelectorAll("br").forEach(br=>br.replaceWith(" "));const label=accessible.textContent.replace(/\s+/g," ").trim();h.setAttribute("aria-label",label);
 let n=0;
 function walk(node){
  [...node.childNodes].forEach(child=>{
   if(child.nodeType===Node.TEXT_NODE){const f=document.createDocumentFragment();child.textContent.split(/(\s+)/).forEach(word=>{if(!word.trim()){f.append(document.createTextNode(word));return;}const mask=document.createElement("span");mask.className="word-mask";mask.setAttribute("aria-hidden","true");const inside=document.createElement("span");if(heroHeading)inside.className="hero-word";inside.style.setProperty("--word-delay",(n++*(heroHeading?130:55))+"ms");inside.textContent=word;mask.append(inside);f.append(mask);});child.replaceWith(f);}else if(child.nodeType===Node.ELEMENT_NODE)walk(child);
  });
 }walk(h);h.classList.add("animated-heading");
}
animateHeading($("h1"),true);
$$("h2").forEach(h=>animateHeading(h));
let headingObserver;
if("IntersectionObserver" in window){headingObserver=new IntersectionObserver(entries=>entries.forEach(en=>{if(en.isIntersecting){en.target.classList.add("in");headingObserver.unobserve(en.target);}}),{threshold:.15});$$(".animated-heading").forEach(h=>headingObserver.observe(h));}
else $$(".animated-heading").forEach(h=>h.classList.add("in"));
const cards=[$(".story-card-social"),$(".story-card-email"),$(".story-card-brand")];
const transforms=[
 [[-36,-48,-19],[25,72,18],[0,25,-2]],
 [[-22,-28,-10],[22,40,8],[0,0,0]],
 [[-30,-22,-8],[25,40,7],[0,-5,0]],
 [[-18,-15,-7],[14,32,6],[0,-12,0]]
];
const labels=["01 / THE QUIET BEGINNING","02 / FINDING THE VOICE","03 / CONNECTING THE DOTS","04 / A LASTING IMPRESSION"];
const backdrop=["unseen.","a voice.","connected.","remembered."];
let ticking=false,lastAct=-1,storyTop=0,storyHeight=0,stepCenters=[],heroHeight=0,vh=innerHeight;
function measure(){vh=innerHeight;storyTop=story.getBoundingClientRect().top+scrollY;storyHeight=story.offsetHeight;heroHeight=hero.offsetHeight;stepCenters=steps.map(s=>s.getBoundingClientRect().top+scrollY+s.offsetHeight*.6);schedule();}
function update(){
 ticking=false;
 const y=scrollY;
 const progress=clamp((y+vh*.57-stepCenters[0])/(stepCenters.at(-1)-stepCenters[0]));
 const raw=progress*3,a=Math.min(2,Math.floor(raw)),t=raw-a;
 let act=0;stepCenters.forEach((center,i)=>{if(y+vh*.58>=center-vh*.17)act=i;});
 if(act!==lastAct){stage.dataset.act=String(act);$("#storyChapterLabel").textContent=labels[act];$("#storyBackdrop").textContent=backdrop[act];[...dots.children].forEach((x,i)=>{x.classList.toggle("active",i===act);if(i===act)x.setAttribute("aria-current","step");else x.removeAttribute("aria-current");});lastAct=act;}
 dots.classList.toggle("visible",y+vh*.5>storyTop&&y+vh*.5<storyTop+storyHeight);
 if(reduced.matches){stage.style.setProperty("--story-p","1");return;}
 stage.style.setProperty("--story-p",progress.toFixed(4));
 const factor=innerWidth<=680?.52:1;
 cards.forEach((card,i)=>{const from=transforms[a][i],to=transforms[a+1][i];const v=from.map((x,j)=>x+(to[j]-x)*t);card.style.transform="translate3d("+(v[0]*factor).toFixed(2)+"px,"+(v[1]*factor).toFixed(2)+"px,0) rotate("+v[2].toFixed(2)+"deg)";});
 if(y<heroHeight){const hp=clamp(y/heroHeight);texture.style.setProperty("--texture-y",(hp*65).toFixed(1)+"px");if(innerWidth>680){copy.style.setProperty("--hero-copy-y",(hp*-65).toFixed(1)+"px");copy.style.setProperty("--hero-copy-opacity",String(1-hp*.6));art.style.setProperty("--art-y",(hp*70).toFixed(1)+"px");art.style.setProperty("--art-rotate",(hp*-5).toFixed(2)+"deg");}}
 const doc=document.documentElement;$(".reading-progress").style.transform="scaleX("+clamp(y/Math.max(1,doc.scrollHeight-vh))+")";
}
function schedule(){if(!ticking){ticking=true;requestAnimationFrame(update);}}
addEventListener("scroll",schedule,{passive:true});addEventListener("resize",measure,{passive:true});
reduced.addEventListener("change",()=>{if(reduced.matches){cards.forEach(c=>c.style.removeProperty("transform"));[art,copy,texture].forEach(el=>el.removeAttribute("style"));}measure();});
if("ResizeObserver" in window)new ResizeObserver(measure).observe(story);
document.fonts?.ready.then(measure);
if(matchMedia("(hover: hover) and (pointer: fine)").matches){
 hero.addEventListener("pointermove",ev=>{if(reduced.matches)return;const rect=hero.getBoundingClientRect();hero.style.setProperty("--glow-x",(ev.clientX-rect.left)+"px");hero.style.setProperty("--glow-y",(ev.clientY-rect.top)+"px");art.style.setProperty("--art-x",((ev.clientX/innerWidth-.5)*14).toFixed(1)+"px");});
 hero.addEventListener("pointerleave",()=>art.style.setProperty("--art-x","0px"));
 $$(".button, .nav-contact").forEach(b=>{b.addEventListener("pointermove",ev=>{if(reduced.matches)return;const r=b.getBoundingClientRect();b.style.setProperty("--magnet-x",((ev.clientX-r.left-r.width/2)*.07)+"px");b.style.setProperty("--magnet-y",((ev.clientY-r.top-r.height/2)*.1)+"px");});b.addEventListener("pointerleave",()=>{b.style.setProperty("--magnet-x","0px");b.style.setProperty("--magnet-y","0px");});});
}
measure();
})();
