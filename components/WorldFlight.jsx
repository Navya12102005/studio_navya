'use client';
import { Component, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Bloom, ChromaticAberration, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Brain, Studio, Mail, BookOpen, Pause } from './Icons';
import CanvasLoader from './CanvasLoader';
import WorldTypography, { WorldHUD } from './WorldTypography';
import { useMotion } from './MotionProvider';
import { createImportedAnatomy } from '../lib/imported-anatomy';
import { createRealmWorld, createAmbientField } from '../lib/realm-world';
import { createCosmicWarp } from '../lib/cosmic';
import { createFlightInstallations } from '../lib/flight-installations';
import { createFlightRoute, PROJECT_STOPS, FLIGHT_JUMPS } from '../lib/flight-path';

const STYLE={position:'fixed',inset:0,zIndex:0,pointerEvents:'none',width:'100vw',height:'100vh'};
const CAMERA={position:[0,.9,9.5],fov:42,near:.025,far:160};
const GL={alpha:true,antialias:false,powerPreference:'high-performance'};
const CHROMA=new THREE.Vector2(0,0);
class FlightBoundary extends Component{
  state={failed:false};static getDerivedStateFromError(){return{failed:true};}
  componentDidCatch(){this.props.onFailure();}
  render(){return this.state.failed?<div className="anatomy-unavailable" data-anatomy-state="unavailable"/>:this.props.children;}
}

function FlightPost({runtime,economy}){
  const bloom=useRef(null),chroma=useRef(null);
  useFrame(()=>{const data=runtime.current;if(!data)return;
    const intensity=.06+data.jump*.25,offset=data.jump*.00045;
    if(bloom.current)bloom.current.intensity=intensity;
    if(chroma.current)chroma.current.offset.set(offset,offset*.75);
    data.post={enabled:Boolean(bloom.current&&chroma.current),bloom:bloom.current?.intensity||0,chromaticOffset:chroma.current?.offset.x||0};
  },0);
  return <EffectComposer multisampling={0} enableNormalPass={false} resolutionScale={economy?.5:1} frameBufferType={THREE.HalfFloatType}>
    <Bloom ref={bloom} intensity={.06} luminanceThreshold={.65} luminanceSmoothing={.3} mipmapBlur radius={.65} levels={economy?3:5}/>
    <ChromaticAberration ref={chroma} offset={CHROMA} radialModulation={true} modulationOffset={.35}/>
  </EffectComposer>;
}

function FlightRuntime({runtime,progress,active,onReady,onIntro,onQuality,onEconomy,onPartHover}){
  const {scene,camera,gl,setFrameloop}=useThree();
  const {scene:asset}=useGLTF('/models/skeleton.glb',false,false);
  const activeRef=useRef(active);activeRef.current=active;
  useEffect(()=>{setFrameloop(active?'always':'never');},[active,setFrameloop]);
  useLayoutEffect(()=>{
    const context=gl.getContext(),debug=context.getExtension('WEBGL_debug_renderer_info');
    const economy=debug?/swiftshader|llvmpipe|software/i.test(context.getParameter(debug.UNMASKED_RENDERER_WEBGL)):false;
    if(economy)onQuality(.5);onEconomy(economy);
    gl.outputColorSpace=THREE.SRGBColorSpace;gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=1;gl.autoClear=true;gl.info.autoReset=false;
    gl.transmissionResolutionScale=economy?.25:.75;
    const sculpture=createImportedAnatomy(scene,gl,asset),heart=sculpture.anchors.heart;
    const route=createFlightRoute(heart),realms=createRealmWorld(scene,{economy,worldMode:true});
    realms.tech.position.set(5,-.2,-3);realms.creative.position.set(21,-.2,-29);
    const atmosphere=createAmbientField(),quad=atmosphere.scene.children[0];quad.renderOrder=-1000;quad.frustumCulled=false;scene.add(quad);
    const installations=createFlightInstallations(scene,route,economy);
    const previousFog=scene.fog;scene.fog=new THREE.FogExp2('#151919',.026);
    const canvas=gl.domElement,materials=new Map();
    sculpture.model.traverse(node=>{if(node.isMesh&&node.material.isMeshPhysicalMaterial){const m=node.material;materials.set(m.uuid,{name:m.name,roughness:m.roughness,clearcoat:m.clearcoat,transmission:m.transmission,ior:m.ior});}});
    canvas.dataset.engine='react-three-fiber';canvas.dataset.renderer='physical-mesh';canvas.dataset.modelSource='/models/skeleton.glb';canvas.dataset.importedMeshes=JSON.stringify(sculpture.sourceMeshes);canvas.dataset.physicalMaterials=JSON.stringify([...materials.values()]);canvas.dataset.wireframeMeshes='0';canvas.dataset.flightEngine='CatmullRomCurve3';
    const occluders=[];sculpture.model.traverse(node=>{if(node.isMesh)occluders.push(node);});
    let seen=true;try{seen=sessionStorage.getItem('navya-intro-seen')==='1';}catch{}
    const introRunning=false,cosmic=introRunning?createCosmicWarp(sculpture.model,innerWidth<700):null;
    const introNodes=cosmic?[...cosmic.scene.children]:[];introNodes.forEach(node=>scene.add(node));
    const data={sculpture,route,realms,atmosphere,installations,quad,economy,time:0,progress:0,jump:0,zone:'bio-tech',warmth:0,pointer:{x:0,y:0},look:new THREE.Vector3(),point:new THREE.Vector3(),edge:new THREE.Vector3(),direction:new THREE.Vector3(),raycaster:new THREE.Raycaster(),ndc:new THREE.Vector2(),occluders,frames:0,elapsed:0,qualityElapsed:0,qualityFrames:0,post:{bloom:.3,chromaticOffset:.00015},introRunning,introElapsed:0,cosmic,cosmicDisposed:false,introNodes,profile:new URLSearchParams(location.search).has('profile')};
    runtime.current=data;
    function finish(){if(!data.introRunning)return;data.introRunning=false;introNodes.forEach(node=>{node.visible=false;});if(!data.cosmicDisposed){cosmic?.dispose();data.cosmicDisposed=true;}try{sessionStorage.setItem('navya-intro-seen','1');}catch{}onIntro?.(false);}
    data.finishIntro=finish;
    const accelerate=()=>{if(data.introRunning)data.introElapsed=Math.max(data.introElapsed,2100);};
    const skip=()=>{if(data.introRunning)data.introElapsed=3000;};
    function move(event){if(event.pointerType!=='mouse')return;data.pointer.x=event.clientX/innerWidth-.5;data.pointer.y=.5-event.clientY/innerHeight;}
    function click(event){if(!activeRef.current||data.introRunning||event.target.closest('dialog,input,textarea,select,.flight-controls'))return;
      data.ndc.set(event.clientX/innerWidth*2-1,-event.clientY/innerHeight*2+1);realms.burst(data.ndc,camera,data.progress>.6);
    }
    addEventListener('pointermove',move,{passive:true});addEventListener('click',click);addEventListener('wheel',accelerate,{passive:true});addEventListener('portfolio:intro-accelerate',accelerate);addEventListener('portfolio:intro-skip',skip);
    onIntro?.(introRunning);onReady(true);
    return()=>{runtime.current=null;onIntro?.(false);removeEventListener('pointermove',move);removeEventListener('click',click);removeEventListener('wheel',accelerate);removeEventListener('portfolio:intro-accelerate',accelerate);removeEventListener('portfolio:intro-skip',skip);if(!data.cosmicDisposed)cosmic?.dispose();introNodes.forEach(node=>scene.remove(node));installations.dispose();realms.dispose();scene.remove(quad);atmosphere.dispose();sculpture.dispose();scene.fog=previousFog;gl.info.autoReset=true;};
  },[scene,camera,gl,asset,onReady,onIntro,onQuality,onEconomy,onPartHover,runtime,progress]);

  useFrame(({camera,gl,scene},delta)=>{
    const d=runtime.current;if(!d||!activeRef.current)return;
    const dt=Math.min(delta,.1);d.time+=delta;d.progress=THREE.MathUtils.damp(d.progress,progress.current,7,dt);
    const sample=d.route.sample(d.progress,innerWidth<760);d.zone=sample.zone;d.jump=sample.jump;d.warmth=sample.warmth;
    camera.position.set(...sample.position);d.look.set(...sample.target);
    if(!d.introRunning){camera.position.x+=d.pointer.x*.045;camera.position.y+=d.pointer.y*.025;}camera.lookAt(d.look);
    const model=d.sculpture.model;model.rotation.y=.12+Math.sin(d.time*.065)*.1;model.visible=!d.introRunning||d.introElapsed>2400;
    d.sculpture.update(d.time,0,d.warmth);model.updateMatrixWorld(true);
    if(d.introRunning){d.introElapsed+=delta*1000;const phase=Math.min(1,d.introElapsed/3000);d.cosmic.update(d.time,THREE.MathUtils.smoothstep(phase,.55,.98),Math.sin(phase*Math.PI)**2);dispatchEvent(new CustomEvent('portfolio:intro-energy',{detail:phase}));if(phase>=1)d.finishIntro();}
    d.realms.update(d.time,delta,{blend:d.warmth,opacity:d.introRunning?0:1,pointer:d.pointer,project:0,pixelRatio:gl.getPixelRatio()},camera);
    d.realms.tech.visible=d.progress>.33&&d.progress<.64;d.realms.creative.visible=d.progress>.59;
    d.installations.update(d.time,d.jump,d.warmth,d.progress);d.installations.root.visible=!d.introRunning;
    d.atmosphere.update(d.time,d.warmth,d.pointer,innerWidth/innerHeight);
    const canvas=gl.domElement;
    canvas.dataset.camera=JSON.stringify({position:camera.position.toArray(),target:d.look.toArray(),progress:d.progress,parameter:sample.parameter,zone:d.zone});canvas.dataset.worldCoordinates=JSON.stringify({anatomy:model.position.toArray(),bioTech:d.realms.tech.position.toArray(),creative:d.realms.creative.position.toArray(),portal:d.installations.portalPosition.toArray()});canvas.dataset.zone=d.zone;canvas.dataset.jump=d.jump.toFixed(4);canvas.dataset.warmth=d.warmth.toFixed(4);canvas.dataset.postprocessing=JSON.stringify(d.post);canvas.dataset.realmEffects=JSON.stringify(d.realms.diagnostics());
    document.documentElement.style.setProperty('--ambient-warmth',String(d.warmth));
    const pose={};for(const [part,name] of [['brain','Brain'],['spine','CervicalSpine'],['heart','Heart']]){const node=model.getObjectByName(name);node.getWorldPosition(d.point).project(camera);pose[part]={x:(d.point.x*.5+.5)*innerWidth,y:(-.5*d.point.y+.5)*innerHeight};}canvas.dataset.parts=JSON.stringify(pose);
    let nativeTexts=0,depthTested=0,readyTexts=0;scene.traverse(node=>{if(node.name?.startsWith('world-text:')){nativeTexts++;if(node.textRenderInfo)readyTexts++;const materials=Array.isArray(node.material)?node.material:[node.material];if(materials.every(m=>m?.depthTest))depthTested++;}});canvas.dataset.nativeTextCount=String(nativeTexts);canvas.dataset.nativeTextReadyCount=String(readyTexts);canvas.dataset.heroText=scene.getObjectByName('world-text:The science\nof possibility.')?.text||'';canvas.dataset.depthTestedTextCount=String(depthTested);
    // The HTML hit targets are transparent and follow genuine projected 3D
    // coordinates. Their visible text lives entirely in the depth-tested scene.
    for(const stop of PROJECT_STOPS){
      const element=document.querySelector(`[data-flight-project="${stop.project.id}"]`);if(!element)continue;
      const glyph=scene.getObjectByName(`world-text:project-cta:${stop.project.id}`);if(!glyph){element.style.visibility='hidden';element.disabled=true;continue;}glyph.getWorldPosition(d.point);
      const world=d.point.clone(),distance=world.distanceTo(camera.position);d.point.project(camera);
      let visible=!d.introRunning&&d.point.z>-1&&d.point.z<1&&Math.abs(d.point.x)<.92&&Math.abs(d.point.y)<.9&&Math.abs(d.progress-stop.progress)<.045;
      if(visible){d.ndc.set(d.point.x,d.point.y);d.raycaster.setFromCamera(d.ndc,camera);const hit=d.raycaster.intersectObjects(d.occluders,false)[0];if(hit&&hit.distance<distance-.2)visible=false;}
      element.style.transform=`translate3d(${(d.point.x*.5+.5)*innerWidth}px,${(-d.point.y*.5+.5)*innerHeight}px,0) translate(-50%,-50%)`;
      element.style.visibility=visible?'visible':'hidden';element.disabled=!visible;element.dataset.worldPosition=world.toArray().join(',');
    }
    const contact=document.querySelector('[data-flight-contact]');if(contact){const glyph=scene.getObjectByName('world-text:contact-cta');if(glyph)glyph.getWorldPosition(d.point);else d.point.set(27,-.9,-54);d.point.project(camera);contact.style.transform=`translate3d(${(d.point.x*.5+.5)*innerWidth}px,${(-d.point.y*.5+.5)*innerHeight}px,0) translate(-50%,-50%)`;contact.style.visibility=d.progress>.955?'visible':'hidden';contact.disabled=d.progress<=.955;}
    const timeline=document.querySelector('[data-flight-timeline]');if(timeline&&timeline.dataset.dragging!=='true')timeline.value=String(Math.round(d.progress*1000));
    const meter=document.querySelector('[data-flight-meter]');if(meter)meter.setAttribute('aria-valuenow',String(Math.round(d.progress*100)));
    const readout=document.querySelector('[data-flight-status]');if(readout&&readout.dataset.zone!==d.zone){readout.dataset.zone=d.zone;readout.textContent=d.zone==='bio-tech'?'Bio-Tech world':d.zone==='portal'?'Passing through the world portal':'Creative Studio world';}
    d.frames++;d.elapsed+=delta*1000;d.qualityFrames++;d.qualityElapsed+=delta*1000;
    if(d.qualityFrames>=30){if(d.qualityElapsed/d.qualityFrames>45&&gl.getPixelRatio()>(d.economy?.4:.7))onQuality(Math.max(d.economy?.4:.7,gl.getPixelRatio()*.85));d.qualityFrames=0;d.qualityElapsed=0;}
    if(d.frames>=30&&d.profile){canvas.dataset.profile=JSON.stringify({fps:d.frames*1000/d.elapsed,drawCalls:gl.info.render.calls,triangles:gl.info.render.triangles,geometries:gl.info.memory.geometries,pixelRatio:gl.getPixelRatio(),physicalMeshes:true,engine:'world-flight',postprocessing:true});d.frames=0;d.elapsed=0;}
    gl.info.reset();
  },0);
  return null;
}

export default function WorldFlight({enabled,active,onReady,onIntro,onPartHover}){
  const [ready,setReady]=useState(false),[failed,setFailed]=useState(false),[dpr,setDpr]=useState(1.1),[economy,setEconomy]=useState(false);
  const runtime=useRef(null),progress=useRef(0),rail=useRef(null);
  const {scrollRef,setReading,setPaused,setFlightReady}=useMotion();
  const quality=useCallback(value=>setDpr(value),[]),hardware=useCallback(value=>setEconomy(value),[]);
  const report=useCallback(value=>{setReady(value);setFlightReady(value);onReady?.(value);},[onReady,setFlightReady]);
  const failure=useCallback(()=>{setFailed(true);setReady(false);setFlightReady(false);onReady?.(false);onIntro?.(false);},[onReady,onIntro,setFlightReady]);
  function fly(p){const max=rail.current?.offsetHeight-innerHeight;if(!(max>0))return;const top=THREE.MathUtils.clamp(p,0,1)*max;const lenis=scrollRef.current?.lenis;if(lenis)lenis.scrollTo(top,{duration:1.3});else window.scrollTo({top,behavior:'smooth'});}
  function read(section='work'){setReading(true);setTimeout(()=>{const el=document.getElementById(section);if(el){el.scrollIntoView({behavior:'instant'});el.tabIndex=-1;el.focus({preventScroll:true});}},60);}
  function open(project,button){dispatchEvent(new CustomEvent('portfolio:domain',{detail:{domain:PROJECT_STOPS.find(s=>s.project.id===project.id).realm,project:project.id,opener:button}}));}
  useEffect(()=>{
    if(!enabled||!ready||failed)return;
    gsap.registerPlugin(ScrollTrigger);document.documentElement.classList.add('flight-running');window.scrollTo(0,0);progress.current=0;
    const tween=gsap.to(progress,{current:1,ease:'none',scrollTrigger:{trigger:rail.current,start:'top top',end:'bottom bottom',scrub:1.2,invalidateOnRefresh:true}});
    const jump=event=>{const detail=event.detail,p=typeof detail==='number'?detail:FLIGHT_JUMPS[detail?.target||detail];if(Number.isFinite(p))fly(p);};
    addEventListener('portfolio:flight-jump',jump);const refresh=requestAnimationFrame(()=>ScrollTrigger.refresh());
    return()=>{cancelAnimationFrame(refresh);tween.scrollTrigger?.kill();tween.kill();removeEventListener('portfolio:flight-jump',jump);document.documentElement.classList.remove('flight-running');};
  },[enabled,ready,failed,scrollRef]);
  useEffect(()=>{if(!enabled){setReady(false);setFlightReady(false);}},[enabled,setFlightReady]);
  function retry(){useGLTF.clear('/models/skeleton.glb');setFailed(false);setReady(false);}
  const show=enabled&&!failed;
  return <>
    <div className={`anatomy-art anatomy-fullscreen ${ready&&!failed?'canvas-ready':''}`} style={STYLE} aria-hidden="true" data-component="FullCanvasAnatomy">
      {show?<FlightBoundary onFailure={failure}><Canvas className="anatomy-canvas" camera={CAMERA} dpr={dpr} gl={GL} frameloop={active?'always':'never'} fallback={<div className="anatomy-unavailable" data-anatomy-state="unavailable"/>}>
        <Suspense fallback={<CanvasLoader/>}>
          <FlightRuntime runtime={runtime} progress={progress} active={active} onReady={report} onIntro={onIntro} onPartHover={onPartHover} onQuality={quality} onEconomy={hardware}/>
          <WorldTypography runtime={runtime}/><WorldHUD runtime={runtime}/><FlightPost runtime={runtime} economy={economy}/>
        </Suspense>
      </Canvas></FlightBoundary>:failed?<div className="anatomy-unavailable" data-anatomy-state="unavailable"/>:null}
    </div>
    {enabled&&failed?<p className="model-load-error" role="status">3D model unavailable. The readable portfolio remains available. <button onClick={retry}>Retry 3D model</button></p>:null}
    {ready&&show?<><div ref={rail} className="flight-scroll-rail" aria-hidden="true"/>
      <nav className="flight-controls" aria-label="Navigate the 3D worlds">
        <button aria-label="Fly to Bio-Tech world" onClick={()=>fly(FLIGHT_JUMPS.tech)} title="Bio-Tech world"><Brain size={18}/></button>
        <button aria-label="Fly to Creative Studio world" onClick={()=>fly(FLIGHT_JUMPS.creative)} title="Creative Studio world"><Studio size={18}/></button>
        <button aria-label="Fly to contact" onClick={()=>fly(FLIGHT_JUMPS.contact)} title="Contact"><Mail size={18}/></button>
        <button aria-label="Read portfolio without 3D motion" onClick={()=>read()} title="Read portfolio"><BookOpen size={18}/></button>
        <button aria-label="Pause visual effects" onClick={()=>setPaused(true)} title="Pause visual effects"><Pause size={16}/></button>
      </nav>
      <div className="flight-node-controls" aria-label="Spatial project actions">
        {PROJECT_STOPS.map(({project})=><button key={project.id} className="flight-node-action" data-flight-project={project.id} aria-label={`Explore ${project.category}`} style={{visibility:'hidden'}} onClick={event=>open(project,event.currentTarget)}><span className="sr-only">Explore {project.category}</span></button>)}
        <button className="flight-node-action" data-flight-contact style={{visibility:'hidden'}} aria-label="Open contact form" onClick={()=>read('contact')}><span className="sr-only">Open contact form</span></button>
      </div>
      <input className="flight-timeline" data-flight-timeline type="range" min="0" max="1000" defaultValue="0" aria-label="3D flight timeline" onPointerDown={event=>{event.currentTarget.dataset.dragging='true';}} onPointerUp={event=>{event.currentTarget.dataset.dragging='false';}} onInput={event=>fly(Number(event.currentTarget.value)/1000)}/>
      <div className="flight-accessibility sr-only"><h1>Navya Gupta  |  The science of possibility</h1><p>Scroll to fly through the Bio-Tech and Creative Studio worlds, or choose Read portfolio for a normal reading layout.</p><p role="status" data-flight-status>Bio-Tech world</p><div role="progressbar" aria-label="3D flight progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" data-flight-meter/></div>
      <small className="flight-model-credit"><a href="/terms">Terms (draft)</a> / <a href="/privacy">Privacy (draft)</a><br/>Anatomy: <a href="/models/README.md">BodyParts3D</a> / <a href="https://creativecommons.org/licenses/by-sa/2.1/jp/">CC BY-SA 2.1 Japan</a></small>
    </>:null}
  </>;
}
