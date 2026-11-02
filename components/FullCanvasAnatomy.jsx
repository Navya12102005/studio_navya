'use client';
import { Component, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import CanvasLoader from './CanvasLoader';
import AnatomyAnchors from './AnatomyAnchors';
import {createBlueprintField} from '../lib/blueprint-field';
import {createLobeEngine} from '../lib/lobe-engine';
import {createCrystalArt} from '../lib/crystal-art';
import {createSurgicalNarrative,surgicalState} from '../lib/surgical-narrative';
import {createAcousticField} from '../lib/acoustic-field';
import {createSplitPortal} from '../lib/split-portal';
import {spiralPose} from '../lib/spiral-camera';
import { createImportedAnatomy } from '../lib/imported-anatomy';
import { createAnatomyNebula } from '../lib/anatomy-nebula';

const STYLE={position:'fixed',inset:0,zIndex:0,pointerEvents:'none',width:'100vw',height:'100vh'};
const CAMERA={position:[0,1,9.3],fov:38,near:.025,far:70};
const GL={alpha:true,antialias:true,powerPreference:'high-performance'};
class ModelBoundary extends Component{
 state={failed:false};static getDerivedStateFromError(){return{failed:true};}
 componentDidCatch(){this.props.onFailure();}
 render(){return this.state.failed?<div className="anatomy-unavailable" data-anatomy-state="unavailable"/>:this.props.children;}
}
function SkeletonScene({progress,realm,velocity,active,onReady,onQuality}){
 const {scene:asset}=useGLTF('/models/skeleton.glb',false,false);
 const {scene,camera,gl,invalidate}=useThree();const runtime=useRef(null);const [anchors,setAnchors]=useState(null);
 useLayoutEffect(()=>{
  const context=gl.getContext(),debug=context.getExtension('WEBGL_debug_renderer_info');
  const software=debug?/swiftshader|llvmpipe|software/i.test(context.getParameter(debug.UNMASKED_RENDERER_WEBGL)):false;
  if(software)onQuality(.6);
  gl.setClearColor('#0A0A0C',0);gl.outputColorSpace=THREE.SRGBColorSpace;gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=1;gl.transmissionResolutionScale=software?.25:.75;
  const sculpture=createImportedAnatomy(scene,gl,asset),nebula=createAnatomyNebula(scene,{economy:software}),portal=createSplitPortal(scene,sculpture.anchors),blueprint=createBlueprintField(scene,sculpture.anchors),crystalArt=createCrystalArt(scene,sculpture,{economy:software}),lobes=createLobeEngine(scene,sculpture,{economy:software}),surgery=createSurgicalNarrative(scene,sculpture,{economy:software}),acoustics=createAcousticField(scene,sculpture.anchors,{economy:software}),materials=new Map();scene.background=null;
  sculpture.model.traverse(node=>{if(node.isMesh){const m=node.material;materials.set(m.uuid,{name:m.name,transmission:m.transmission,roughness:m.roughness,clearcoat:m.clearcoat,clearcoatRoughness:m.clearcoatRoughness,ior:m.ior,thickness:m.thickness});}});
  const canvas=gl.domElement;canvas.dataset.engine='react-three-fiber';canvas.dataset.renderer='physical-mesh';canvas.dataset.modelSource='/models/skeleton.glb';canvas.dataset.importedMeshes=JSON.stringify(sculpture.sourceMeshes);canvas.dataset.physicalMaterials=JSON.stringify([...materials.values()]);canvas.dataset.wireframeMeshes='0';
  runtime.current={sculpture,nebula,portal,acoustics,surgery,crystalArt,lobes,blueprint,lastTelemetry:0,creativeActivated:false,time:0,p:progress.current,warmth:0,target:new THREE.Vector3(0,1,0)};
  setAnchors(sculpture.anchors);onReady(true);invalidate();
  return()=>{runtime.current=null;blueprint.dispose();dispatchEvent(new CustomEvent('portfolio:telemetry',{detail:{online:false}}));delete document.documentElement.dataset.cranialHud;lobes.dispose();crystalArt.dispose();surgery.dispose();acoustics.dispose();portal.dispose();nebula.dispose();sculpture.dispose();};
 },[scene,camera,gl,asset,onReady,onQuality,invalidate,progress,realm,velocity]);
 useFrame((state,delta)=>{
  const d=runtime.current;if(!d)return;
  if(active){d.time+=delta;d.p=THREE.MathUtils.damp(d.p,progress.current,6,Math.min(delta,.1));d.warmth=THREE.MathUtils.damp(d.warmth,realm.current.inWork?realm.current.selected:surgicalState(d.p).creativeMix,3,Math.min(delta,.1));d.sculpture.update(d.time,0,d.warmth);const story=d.surgery.update(d.p,d.time,gl.getPixelRatio());d.crystalArt.update(d.time,gl.getPixelRatio(),story.burst);d.lobes.update(d.time,story.separation,gl.getPixelRatio());
   if(!realm.current.inWork&&d.p>.735&&!d.creativeActivated){d.creativeActivated=true;dispatchEvent(new CustomEvent('portfolio:domain',{detail:{domain:'creative'}}));}
   if(!realm.current.inWork&&d.p<.5&&d.creativeActivated){d.creativeActivated=false;dispatchEvent(new CustomEvent('portfolio:domain',{detail:{domain:'tech'}}));}const speed=Math.max(velocity.current.pending,performance.now()-velocity.current.at<160?Math.abs(velocity.current.value):0);velocity.current.pending=0;d.acoustics.update(d.time,delta,speed,gl.getPixelRatio(),d.p,state.size.width/state.size.height);}
  const aspect=state.size.width/state.size.height;
  const pose=spiralPose(d.p,d.sculpture.anchors,aspect),{radius,angle,target}=pose;
  camera.position.copy(pose.position);camera.lookAt(target);
  const cranialHud=d.p>.12&&d.p<.31?'active':'inactive';if(document.documentElement.dataset.cranialHud!==cranialHud)document.documentElement.dataset.cranialHud=cranialHud;
  gl.domElement.dataset.lobes=JSON.stringify(d.lobes.telemetry());
  gl.domElement.dataset.crystalArt=JSON.stringify(d.crystalArt.telemetry());
  gl.domElement.dataset.narrative=JSON.stringify(d.surgery.telemetry());
  gl.domElement.dataset.acoustics=JSON.stringify(d.acoustics.telemetry());
  gl.domElement.dataset.organs=JSON.stringify(d.sculpture.telemetry());
  gl.domElement.dataset.checkpoint=String(Math.min(4,Math.floor(d.p*4)+1));
  d.blueprint.update(d.p,camera,aspect);
  if(performance.now()-d.lastTelemetry>125){d.lastTelemetry=performance.now();dispatchEvent(new CustomEvent('portfolio:telemetry',{detail:{online:true,time:d.time,progress:d.p,camera:camera.position.toArray(),meshes:d.sculpture.sourceMeshes.length,bpm:75,relativeVolume:d.sculpture.respiratoryVolume()??1,respiratoryRate:12}}));}
  d.portal.update(d.p,camera);gl.domElement.dataset.gateway=JSON.stringify(d.portal.telemetry());
  d.nebula.update(d.time,d.warmth,gl.getPixelRatio(),aspect);gl.domElement.dataset.palette=JSON.stringify({...d.nebula.palette(),warmth:d.warmth});gl.domElement.dataset.lighting=JSON.stringify(d.sculpture.lighting());
  gl.domElement.dataset.camera=JSON.stringify({progress:d.p,angle,radius,position:camera.position.toArray(),target:target.toArray()});
  gl.domElement.dataset.modelPosition=JSON.stringify(d.sculpture.model.position.toArray());
 });
 return anchors?<AnatomyAnchors anchors={anchors} model={runtime.current?.sculpture.model} progress={progress}/>:null;
}
export default function FullCanvasAnatomy({enabled,active,onReady}){
 const [ready,setReady]=useState(false),[failed,setFailed]=useState(false),[dpr,setDpr]=useState(1.25);const progress=useRef(0),velocity=useRef({value:0,at:0,pending:0}),realm=useRef({selected:0,inWork:false});
 const quality=useCallback(value=>setDpr(value),[]);
 const report=useCallback(value=>{setReady(value);onReady?.(value);},[onReady]);
 const failure=useCallback(()=>{setFailed(true);setReady(false);onReady?.(false);},[onReady]);
 useEffect(()=>{
  if(!enabled||!ready||failed)return;
  gsap.registerPlugin(ScrollTrigger);
  const speed=ScrollTrigger.create({start:0,end:'max',onUpdate:self=>{const value=self.getVelocity();velocity.current={value,at:performance.now(),pending:Math.max(velocity.current.pending,Math.abs(value))};}});
  const tween=gsap.to(progress,{current:1,ease:'none',scrollTrigger:{trigger:'#home',start:'top top',end:'bottom 75%',scrub:1.2,invalidateOnRefresh:true}});
  realm.current.selected=document.getElementById('work')?.classList.contains('creative')?1:0;
  const work=ScrollTrigger.create({trigger:'#work',start:'top 75%',end:'bottom 25%',onToggle:self=>{realm.current.inWork=self.isActive;}});
  const refresh=event=>{if(event?.detail)realm.current.selected=event.detail==='creative'?1:0;ScrollTrigger.refresh();};addEventListener('portfolio:realm',refresh);const frame=requestAnimationFrame(refresh);
  return()=>{cancelAnimationFrame(frame);removeEventListener('portfolio:realm',refresh);speed.kill();velocity.current={value:0,at:0,pending:0};tween.scrollTrigger?.kill();tween.kill();work.kill();};
 },[enabled,ready,failed]);
 function retry(){useGLTF.clear('/models/skeleton.glb');setFailed(false);setReady(false);}
 return <>
  <div className={`anatomy-art anatomy-fullscreen ${ready&&!failed?'canvas-ready':''}`} style={STYLE} aria-hidden="true" data-component="FullCanvasAnatomy">
   {enabled&&!failed?<ModelBoundary onFailure={failure}><Canvas className="anatomy-canvas" camera={CAMERA} gl={GL} dpr={dpr} frameloop={active?'always':'demand'} fallback={<div className="anatomy-unavailable" data-anatomy-state="unavailable"/>}>
    <Suspense fallback={<CanvasLoader/>}><SkeletonScene progress={progress} velocity={velocity} realm={realm} active={active} onReady={report} onQuality={quality}/></Suspense>
   </Canvas></ModelBoundary>:failed?<div className="anatomy-unavailable" data-anatomy-state="unavailable"/>:null}
  </div>
  {enabled&&failed?<p className="model-load-error" role="status">3D model unavailable. The portfolio remains readable. <button onClick={retry}>Retry 3D model</button></p>:null}
 </>;
}
