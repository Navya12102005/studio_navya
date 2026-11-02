'use client';
import { Component, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import CanvasLoader from './CanvasLoader';
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
function SkeletonScene({progress,realm,active,onReady,onQuality}){
 const {scene:asset}=useGLTF('/models/skeleton.glb',false,false);
 const {scene,camera,gl,invalidate}=useThree();const runtime=useRef(null);
 useLayoutEffect(()=>{
  const context=gl.getContext(),debug=context.getExtension('WEBGL_debug_renderer_info');
  const software=debug?/swiftshader|llvmpipe|software/i.test(context.getParameter(debug.UNMASKED_RENDERER_WEBGL)):false;
  if(software)onQuality(.6);
  gl.setClearColor('#151919',0);gl.outputColorSpace=THREE.SRGBColorSpace;gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=1;gl.transmissionResolutionScale=software?.25:.75;
  const sculpture=createImportedAnatomy(scene,gl,asset),nebula=createAnatomyNebula(scene,{economy:software}),materials=new Map();scene.background=null;
  sculpture.model.traverse(node=>{if(node.isMesh){const m=node.material;materials.set(m.uuid,{name:m.name,transmission:m.transmission,roughness:m.roughness,clearcoat:m.clearcoat,ior:m.ior});}});
  const canvas=gl.domElement;canvas.dataset.engine='react-three-fiber';canvas.dataset.renderer='physical-mesh';canvas.dataset.modelSource='/models/skeleton.glb';canvas.dataset.importedMeshes=JSON.stringify(sculpture.sourceMeshes);canvas.dataset.physicalMaterials=JSON.stringify([...materials.values()]);canvas.dataset.wireframeMeshes='0';
  runtime.current={sculpture,nebula,time:0,p:progress.current,warmth:0,target:new THREE.Vector3(0,1,0)};
  onReady(true);invalidate();
  return()=>{runtime.current=null;nebula.dispose();sculpture.dispose();};
 },[scene,camera,gl,asset,onReady,onQuality,invalidate,progress,realm]);
 useFrame((state,delta)=>{
  const d=runtime.current;if(!d)return;
  if(active){d.time+=delta;d.p=THREE.MathUtils.damp(d.p,progress.current,6,Math.min(delta,.1));d.warmth=THREE.MathUtils.damp(d.warmth,realm.current.inWork?realm.current.selected:realm.current.scroll,3,Math.min(delta,.1));d.sculpture.update(d.time,0,d.warmth);}
  const aspect=state.size.width/state.size.height;
  const radius=Math.max(9.3,3.1/(2*Math.tan(THREE.MathUtils.degToRad(19))*aspect));
  const angle=-.12+d.p*1.1,y=1.05-d.p*.45;
  d.target.set(0,y,0);camera.position.set(Math.sin(angle)*radius,y+.12,Math.cos(angle)*radius);camera.lookAt(d.target);
  d.nebula.update(d.time,d.warmth,gl.getPixelRatio(),aspect);gl.domElement.dataset.palette=JSON.stringify({...d.nebula.palette(),warmth:d.warmth});gl.domElement.dataset.lighting=JSON.stringify(d.sculpture.lighting());
  gl.domElement.dataset.camera=JSON.stringify({progress:d.p,angle,radius,position:camera.position.toArray(),target:d.target.toArray()});
  gl.domElement.dataset.modelPosition=JSON.stringify(d.sculpture.model.position.toArray());
 });
 return null;
}
export default function FullCanvasAnatomy({enabled,active,onReady}){
 const [ready,setReady]=useState(false),[failed,setFailed]=useState(false),[dpr,setDpr]=useState(1.25);const progress=useRef(0),realm=useRef({scroll:0,selected:0,inWork:false});
 const quality=useCallback(value=>setDpr(value),[]);
 const report=useCallback(value=>{setReady(value);onReady?.(value);},[onReady]);
 const failure=useCallback(()=>{setFailed(true);setReady(false);onReady?.(false);},[onReady]);
 useEffect(()=>{
  if(!enabled||!ready||failed)return;
  gsap.registerPlugin(ScrollTrigger);
  const tween=gsap.to(progress,{current:1,ease:'none',scrollTrigger:{trigger:document.querySelector('main'),start:'top top',end:'bottom bottom',scrub:.9,invalidateOnRefresh:true}});
  realm.current.selected=document.getElementById('work')?.classList.contains('creative')?1:0;
  const color=gsap.to(realm.current,{scroll:1,ease:'none',scrollTrigger:{trigger:'#brain',start:'top 70%',endTrigger:'#heart',end:'bottom 30%',scrub:.9}});
  const work=ScrollTrigger.create({trigger:'#work',start:'top 75%',end:'bottom 25%',onToggle:self=>{realm.current.inWork=self.isActive;}});
  const refresh=event=>{if(event?.detail)realm.current.selected=event.detail==='creative'?1:0;ScrollTrigger.refresh();};addEventListener('portfolio:realm',refresh);const frame=requestAnimationFrame(refresh);
  return()=>{cancelAnimationFrame(frame);removeEventListener('portfolio:realm',refresh);tween.scrollTrigger?.kill();tween.kill();color.scrollTrigger?.kill();color.kill();work.kill();};
 },[enabled,ready,failed]);
 function retry(){useGLTF.clear('/models/skeleton.glb');setFailed(false);setReady(false);}
 return <>
  <div className={`anatomy-art anatomy-fullscreen ${ready&&!failed?'canvas-ready':''}`} style={STYLE} aria-hidden="true" data-component="FullCanvasAnatomy">
   {enabled&&!failed?<ModelBoundary onFailure={failure}><Canvas className="anatomy-canvas" camera={CAMERA} gl={GL} dpr={dpr} frameloop={active?'always':'demand'} fallback={<div className="anatomy-unavailable" data-anatomy-state="unavailable"/>}>
    <Suspense fallback={<CanvasLoader/>}><SkeletonScene progress={progress} realm={realm} active={active} onReady={report} onQuality={quality}/></Suspense>
   </Canvas></ModelBoundary>:failed?<div className="anatomy-unavailable" data-anatomy-state="unavailable"/>:null}
  </div>
  {enabled&&failed?<p className="model-load-error" role="status">3D model unavailable. The portfolio remains readable. <button onClick={retry}>Retry 3D model</button></p>:null}
 </>;
}
