import * as T from '../vendor/three.module.js';
import { createStudio } from './studio.js';
import { mix, smooth, wrapAngle } from './story-state.js';

function start() {
  const api=window.StudioRoom,worlds=[...document.querySelectorAll('.room-world')];if(!api||!worlds.length)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let renderer,studio,frame=0,disposed=false;
  function fallback(){api.ready('still');worlds.forEach(el=>{el.classList.remove('has-webgl');const status=el.querySelector('.room-load-status');if(status)status.textContent='Still view · 3D is unavailable on this device';});document.querySelectorAll('[data-turn]').forEach(el=>el.disabled=true);}
  try {
    renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
    renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
    renderer.domElement.className='studio-canvas';renderer.domElement.setAttribute('aria-hidden','true');
    studio=createStudio();
  } catch(error) { renderer?.dispose();fallback();return; }
  const camera=new T.PerspectiveCamera(66,1,.07,40);camera.rotation.order='YXZ';
  const canvas=renderer.domElement;let active=null,lastWidth=0,lastHeight=0,lastRatio=0,lastNow=0,ambientTime=0;
  let yaw=api.state.yaw,pitch=api.state.pitch,progress=api.state.progress;
  const viewports=new Map();
  function measure(){for(const el of worlds){const r=el.getBoundingClientRect();viewports.set(el,{width:el.clientWidth||r.width,height:el.clientHeight||r.height,top:r.top,bottom:r.bottom});}}
  const resize=new ResizeObserver(measure);worlds.forEach(el=>resize.observe(el));
  addEventListener('scroll',measure,{passive:true});addEventListener('resize',measure,{passive:true});measure();
  let visible=true;
  document.addEventListener('visibilitychange',()=>{visible=!document.hidden;lastNow=0;if(visible&&!disposed&&!frame)frame=requestAnimationFrame(render);});
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();disposed=true;cancelAnimationFrame(frame);fallback();});
  api.ready('ready');
  function render(now) {
    frame=0;if(disposed||!visible)return;
    const dt=Math.min(.05,lastNow?(now-lastNow)/1000:0);lastNow=now;
    // One WebGL context follows the visible room; all other website sections use no GPU.
    let target=null,area=0;
    for(const [el,r] of viewports){const a=Math.max(0,Math.min(innerHeight,r.bottom)-Math.max(0,r.top));if(a>area){area=a;target=el;}}
    if(target){
      if(active!==target){active?.classList.remove('has-webgl');active=target;active.append(canvas);active.classList.add('has-webgl');lastWidth=0;}
      const r=viewports.get(target),w=Math.max(1,Math.round(r.width)),h=Math.max(1,Math.round(r.height));
      // Native 4K on a 4K screen; cap high-DPI work to ~8.3 million pixels.
      const ratio=Math.min(devicePixelRatio||1,2,Math.sqrt(8294400/(w*h)));
      if(w!==lastWidth||h!==lastHeight||ratio!==lastRatio){renderer.setPixelRatio(ratio);renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=w/h<.85?78:66;camera.updateProjectionMatrix();lastWidth=w;lastHeight=h;lastRatio=ratio;}
      const paused=document.body.dataset.ambient==='paused';if(!paused&&!reduced.matches)ambientTime+=dt;
      const follow=reduced.matches?1:1-Math.exp(-dt*14);
      yaw+=wrapAngle(api.state.yaw-yaw)*follow;pitch=mix(pitch,api.state.pitch,follow);
      progress=mix(progress,target.classList.contains('story-room')?api.state.progress:0,follow);
      const greeting=Math.max(0,Math.min(1,(api.state.greetingUntil-now)/900));
      const pose=studio.update(progress,ambientTime,{reduced:reduced.matches,night:api.state.night,breeze:api.state.breeze,greeting:smooth(0,1,greeting)});
      camera.position.set(-.15,1.66,pose.cameraZ);camera.rotation.set(pitch,-yaw,0,'YXZ');
      renderer.render(studio.scene,camera);
      active.querySelector('.room-load-status')?.classList.add('loaded');
      document.querySelectorAll('.view-bearing').forEach(el=>{const degrees=((yaw*180/Math.PI)%360+360)%360;el.textContent=`${Math.round(degrees)}° / 360°`;});
    }
    frame=requestAnimationFrame(render);
  }
  frame=requestAnimationFrame(render);
  addEventListener('pagehide',event=>{if(event.persisted)return;disposed=true;cancelAnimationFrame(frame);resize.disconnect();studio.dispose();renderer.dispose();});
  addEventListener('pageshow',()=>{measure();visible=true;lastNow=0;if(!disposed&&!frame)frame=requestAnimationFrame(render);});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
