'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createVolumetricAnatomy } from '../lib/volumetric-anatomy';
import { createCosmicWarp } from '../lib/cosmic';

export default function AnatomyScene({ progress, cardsProgress, velocity, active, onReady, onIntro, onPartHover, onPartSelect }) {
  const host = useRef(null), activeRef = useRef(active);
  useEffect(() => { activeRef.current = active; }, [active]);
  useEffect(() => {
    const container = host.current;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' }); }
    catch { onReady(false); return; }
    renderer.setClearColor(0x030305, 0);
    const gl=renderer.getContext(),debug=gl.getExtension('WEBGL_debug_renderer_info');
    const software=debug ? /swiftshader|llvmpipe|software/i.test(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)) : false;
    renderer.setPixelRatio(software ? .75 : Math.min(devicePixelRatio, innerWidth < 700 ? 1.25 : 1.5));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1;
    renderer.domElement.setAttribute('data-renderer', 'physical-mesh');
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(38, 1, .025, 80);
    const sculpture = createVolumetricAnatomy(scene, renderer, { economy: software });
    renderer.domElement.dataset.glassMode=software?'alpha-fallback':'physical-transmission';
    const { model, heart } = sculpture;
    const pickMaterial = new THREE.MeshBasicMaterial({ visible: false });
    const pickTargets = [];
    for (const [part, position, scale] of [
      ['brain',[0,2.82,.05],[.75,.75,.64]], ['heart',[.2,.02,.54],[.53,.64,.48]],
      ['spine',[0,1.1,-.18],[.18,.55,.3]], ['vascular',[.65,1.1,.2],[.3,.25,.3]],
      ['cell',[-1,2.35,.18],[.27,.27,.27]], ['ligand',[1,.8,.65],[.35,.32,.25]]
    ]) {
      const target = new THREE.Mesh(new THREE.SphereGeometry(1,10,8),pickMaterial);
      target.position.set(...position);target.scale.set(...scale);target.userData.part=part;
      target.name=`pick-${part}`;model.add(target);pickTargets.push(target);
    }
    let seen = true;
    try { seen = sessionStorage.getItem('navya-intro-seen') === '1'; } catch {}
    let introRunning = !seen && scrollY < 80, introElapsed = 0, energyAt = 0, cosmicDisposed = false;
    const cosmic = introRunning ? createCosmicWarp(model, innerWidth < 700) : null;
    function finishIntro() {
      if (!introRunning) return;
      introRunning=false;try { sessionStorage.setItem('navya-intro-seen','1'); } catch {}
      if(!cosmicDisposed){cosmic?.dispose();cosmicDisposed=true;} onIntro?.(false);
    }
    const accelerate = () => { if(introRunning)introElapsed=Math.max(introElapsed,2050); };
    const skip = () => { if(introRunning)introElapsed=2800; };
    addEventListener('wheel',accelerate,{passive:true});addEventListener('portfolio:intro-accelerate',accelerate);addEventListener('portfolio:intro-skip',skip);
    onIntro?.(introRunning);
    const pointer={x:0,y:0},raycaster=new THREE.Raycaster(),ndc=new THREE.Vector2();
    let hovered=null,lastPick=0,contextAvailable=true;
    function move(event){
      if(event.pointerType!=='mouse'||introRunning)return;
      pointer.x=event.clientX/innerWidth-.5;pointer.y=event.clientY/innerHeight-.5;
      if(performance.now()-lastPick<45)return;lastPick=performance.now();
      let part=null;
      // Pointer events pass through the fixed canvas. Pick volumes are sampled
      // from the window; real HTML links, controls and dialogs keep ownership.
      if(activeRef.current&&!event.target.closest('button,a,input,textarea,select,dialog')&&(cardsProgress?.current||0)<.8){
        const r=container.getBoundingClientRect();ndc.set((event.clientX-r.left)/r.width*2-1,-(event.clientY-r.top)/r.height*2+1);
        raycaster.setFromCamera(ndc,camera);part=raycaster.intersectObjects(pickTargets,false)[0]?.object.userData.part||null;
      }
      if(part!==hovered){hovered=part;onPartHover?.(part);}
    }
    function select(event){
      if(hovered&&!introRunning&&activeRef.current&&event.target.matches('.journey-sticky,.scene-vignette,.anatomical-journey'))onPartSelect?.(hovered);
    }
    addEventListener('pointermove',move,{passive:true});addEventListener('click',select);
    function resize(){const r=container.getBoundingClientRect();renderer.setSize(r.width,r.height);camera.aspect=r.width/Math.max(1,r.height);camera.updateProjectionMatrix();}
    const observer=new ResizeObserver(resize);observer.observe(container);
    const cardiacPosition=new THREE.Vector3(),look=new THREE.Vector3();
    let frame,last=0,time=0,energy=0,profileFrames=0,profileElapsed=0,qualityFrames=0,qualityElapsed=0;
    const profile=new URLSearchParams(location.search).has('profile');
    function render(now){
      frame=requestAnimationFrame(render);
      const elapsed=now-last,dt=Math.min(elapsed/1000,.05);last=now;
      const exit=cardsProgress?.current||0;
      container.parentElement.style.opacity=String(1-THREE.MathUtils.smoothstep(exit,.55,1));
      renderer.domElement.dataset.cardsProgress=String(exit);
      if(!activeRef.current||!contextAvailable||exit>=1){profileFrames=0;profileElapsed=0;return;}
      time+=dt;energy+=((velocity?.current||0)-energy)*.08;if(velocity)velocity.current*=.96;
      sculpture.update(time,energy);
      const p=THREE.MathUtils.clamp(progress.current,0,1),mobile=innerWidth<700;
      // The sculpture stays on the centre axis. Camera azimuth, height and
      // distance are continuous spline controls, not a right-column offset.
      const views=[
        {p:0,y:.9,z:mobile?10.8:8.6,angle:0},
        {p:.33,y:2.84,z:mobile?4.6:3.65,angle:-.14},
        {p:.63,y:1.0,z:mobile?4.8:3.6,angle:.13},
        {p:.82,y:.14,z:mobile?3.6:2.6,angle:.05},
        {p:1,y:.02,z:mobile?.20:.13,angle:0}
      ];
      let index=views.findIndex((v,i)=>i<views.length-1&&p<=views[i+1].p);if(index<0)index=3;
      const a=views[index],b=views[index+1],t=THREE.MathUtils.smoothstep(p,a.p,b.p);
      const lerp=THREE.MathUtils.lerp,angle=lerp(a.angle,b.angle,t)+pointer.x*.045;
      model.rotation.y=Math.sin(time*.075)*.18;model.rotation.x=pointer.y*.015;
      model.updateMatrixWorld(true);heart.getWorldPosition(cardiacPosition);
      const dive=THREE.MathUtils.smoothstep(p,.8,1);
      const y=lerp(lerp(a.y,b.y,t),cardiacPosition.y,dive);
      const distance=lerp(a.z,b.z,t),focusX=lerp(0,cardiacPosition.x,dive),focusZ=lerp(0,cardiacPosition.z,dive);
      look.set(focusX+pointer.x*.025,y+pointer.y*.02,focusZ);
      camera.position.set(focusX+Math.sin(angle)*distance,y+Math.abs(angle)*.12,focusZ+Math.cos(angle)*distance);
      // At the work chapter, pull back out of the cardiac volume along a
      // shallow orbit, then fade the background below fully interactive cards.
      const retreat=THREE.MathUtils.smoothstep(exit,0,1);
      camera.position.lerp(new THREE.Vector3(Math.sin(.25)*9,.9,Math.cos(.25)*9),retreat);
      look.lerp(new THREE.Vector3(0,.9,0),retreat);camera.lookAt(look);
      const phase=p<.18?'body':p<.46?'brain':p<.76?'spine':'heart';
      renderer.domElement.dataset.scene=phase;
      if(introRunning){
        introElapsed+=dt*1000;const f=Math.min(1,introElapsed/2800);
        cosmic.update(time,THREE.MathUtils.smoothstep(f,.58,.98),Math.sin(f*Math.PI)**2);renderer.render(cosmic.scene,camera);
        if(now-energyAt>80){dispatchEvent(new CustomEvent('portfolio:intro-energy',{detail:f}));energyAt=now;}
        if(f>=1)finishIntro();else return;
      }
      renderer.render(scene,camera);
      // Useful diagnostics also make the full-screen contract inspectable.
      const parts={};for(const target of pickTargets){const v=target.getWorldPosition(new THREE.Vector3()).project(camera);parts[target.userData.part]={x:(v.x*.5+.5)*innerWidth,y:(-.5*v.y+.5)*innerHeight};}
      renderer.domElement.dataset.parts=JSON.stringify(parts);
      if(profile){renderer.domElement.dataset.camera=JSON.stringify({position:camera.position.toArray(),target:look.toArray(),progress:p,retreat:exit});}
      qualityFrames++;qualityElapsed+=Math.min(elapsed,200);
      if(qualityFrames>=30){
        const frameTime=qualityElapsed/qualityFrames;
        if(frameTime>40&&renderer.domElement.dataset.glassMode==='physical-transmission'){sculpture.useEconomyGlass();renderer.domElement.dataset.glassMode='adaptive-alpha';}
        if(frameTime>25&&renderer.getPixelRatio()>.65){renderer.setPixelRatio(Math.max(.65,renderer.getPixelRatio()*.8));resize();}
        qualityFrames=0;qualityElapsed=0;
      }
      if(profile){profileFrames++;profileElapsed+=elapsed;}
      if(profile&&profileFrames>=30){
        const data={fps:profileFrames*1000/profileElapsed,drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,lines:renderer.info.render.lines,geometries:renderer.info.memory.geometries,pixelRatio:renderer.getPixelRatio(),physicalMeshes:true};
        profileFrames=0;profileElapsed=0;renderer.domElement.dataset.profile=JSON.stringify(data);dispatchEvent(new CustomEvent('anatomy:performance',{detail:data}));
      }
    }
    const lost=event=>{event.preventDefault();contextAvailable=false;finishIntro();onReady(false);};
    const restored=()=>{contextAvailable=true;onReady(true);};
    renderer.domElement.addEventListener('webglcontextlost',lost);renderer.domElement.addEventListener('webglcontextrestored',restored);
    resize();frame=requestAnimationFrame(render);onReady(true);
    return()=>{
      cancelAnimationFrame(frame);observer.disconnect();removeEventListener('pointermove',move);removeEventListener('click',select);
      removeEventListener('wheel',accelerate);removeEventListener('portfolio:intro-accelerate',accelerate);removeEventListener('portfolio:intro-skip',skip);
      renderer.domElement.removeEventListener('webglcontextlost',lost);renderer.domElement.removeEventListener('webglcontextrestored',restored);
      if(!cosmicDisposed)cosmic?.dispose();onIntro?.(false);sculpture.dispose();pickMaterial.dispose();renderer.dispose();renderer.domElement.remove();
    };
  },[progress,cardsProgress,velocity,onReady,onIntro,onPartHover,onPartSelect]);
  return <div ref={host} className="anatomy-canvas" aria-hidden="true" />;
}
