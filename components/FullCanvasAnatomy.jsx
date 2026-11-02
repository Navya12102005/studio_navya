'use client';

import { Component, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { createVolumetricAnatomy } from '../lib/volumetric-anatomy';
import { createCosmicWarp } from '../lib/cosmic';

const DPR = [.65, 1.5];
const CAMERA = { position: [0, .9, 8.6], fov: 38, near: .025, far: 80 };
const CANVAS_STYLE = { position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', width: '100vw', height: '100vh' };

class AnatomyBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? <div className="anatomy-unavailable" data-anatomy-state="unavailable" /> : this.props.children; }
}

function AnatomyWorld({ progress, cardsProgress, velocity, active, onReady, onIntro, onPartHover, onPartSelect }) {
  const { gl, scene, camera, setDpr, setFrameloop } = useThree();
  const runtime = useRef(null), activeRef = useRef(active);
  activeRef.current = active;
  useEffect(() => { setFrameloop(active ? 'always' : 'never'); }, [active, setFrameloop]);
  useLayoutEffect(() => {
    const context = gl.getContext(), debug = context.getExtension('WEBGL_debug_renderer_info');
    const software = debug ? /swiftshader|llvmpipe|software/i.test(context.getParameter(debug.UNMASKED_RENDERER_WEBGL)) : false;
    if (software) setDpr(.4);
    gl.transmissionResolutionScale = software ? .25 : .75;
    gl.setClearColor(0x030305, 0); gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1;
    const sculpture = createVolumetricAnatomy(scene, gl, { economy: software });
    const canvas = gl.domElement;
    canvas.dataset.renderer = 'physical-mesh'; canvas.dataset.engine = 'react-three-fiber';
    const actualMaterials=new Map();let wireframes=0;
    sculpture.model.traverse(object=>{if(object.isMesh){const list=Array.isArray(object.material)?object.material:[object.material];for(const material of list){if(material.wireframe)wireframes++;if(material.isMeshPhysicalMaterial)actualMaterials.set(material.uuid,{name:material.name,roughness:material.roughness,clearcoat:material.clearcoat,transmission:material.transmission});}}});
    canvas.dataset.physicalMaterials=JSON.stringify([...actualMaterials.values()]);canvas.dataset.wireframeMeshes=String(wireframes);
    canvas.dataset.glassMode = software ? 'physical-low-resolution' : 'physical-transmission';
    const pickMaterial = new THREE.MeshBasicMaterial({ visible: false }), picks = [];
    for (const [part, position, scale] of [
      ['brain',[0,2.82,.05],[.75,.75,.64]],['heart',[.2,.02,.54],[.53,.64,.48]],
      ['spine',[0,1.1,-.18],[.18,.55,.3]],['vascular',[.65,1.1,.2],[.3,.25,.3]],
      ['cell',[-1,2.35,.18],[.27,.27,.27]],['ligand',[1,.8,.65],[.35,.32,.25]]
    ]) {
      const target = new THREE.Mesh(new THREE.SphereGeometry(1,10,8), pickMaterial);
      target.name = `pick-${part}`;target.position.set(...position);target.scale.set(...scale);target.userData.part=part;
      sculpture.model.add(target);picks.push(target);
    }
    let seen = true;
    try { seen = sessionStorage.getItem('navya-intro-seen') === '1'; } catch {}
    const introRunning = !seen && scrollY < 80;
    const cosmic = introRunning ? createCosmicWarp(sculpture.model, innerWidth < 700) : null;
    const data = { software, sculpture, picks, pickMaterial, cosmic, cosmicDisposed: false, introRunning, introElapsed: 0,
      energyAt: 0, time: 0, energy: 0, hovered: null, pickAt: 0, pointer: {x:0,y:0},
      raycaster: new THREE.Raycaster(), ndc: new THREE.Vector2(), core: new THREE.Vector3(), look: new THREE.Vector3(),
      profile: new URLSearchParams(location.search).has('profile'), frames: 0, elapsed: 0, qualityFrames: 0, qualityElapsed: 0 };
    runtime.current = data;
    function finish() {
      if (!data.introRunning) return;
      data.introRunning=false;try { sessionStorage.setItem('navya-intro-seen','1'); } catch {}
      if(!data.cosmicDisposed){cosmic?.dispose();data.cosmicDisposed=true;}onIntro?.(false);
    }
    data.finishIntro=finish;
    const accelerate=()=>{if(data.introRunning)data.introElapsed=Math.max(data.introElapsed,2050);};
    const skip=()=>{if(data.introRunning)data.introElapsed=2800;};
    function move(event){
      if(event.pointerType!=='mouse'||data.introRunning)return;
      data.pointer.x=event.clientX/innerWidth-.5;data.pointer.y=event.clientY/innerHeight-.5;
      if(performance.now()-data.pickAt<45)return;data.pickAt=performance.now();
      let part=null;
      if(activeRef.current&&!event.target.closest('a,button,input,textarea,select,dialog')&&(cardsProgress.current||0)<.8){
        data.ndc.set(event.clientX/innerWidth*2-1,-event.clientY/innerHeight*2+1);data.raycaster.setFromCamera(data.ndc,camera);
        part=data.raycaster.intersectObjects(picks,false)[0]?.object.userData.part||null;
      }
      if(part!==data.hovered){data.hovered=part;onPartHover?.(part);}
    }
    const select=event=>{if(data.hovered&&!data.introRunning&&activeRef.current&&event.target.matches('.journey-sticky,.scene-vignette,.anatomical-journey'))onPartSelect?.(data.hovered);};
    addEventListener('wheel',accelerate,{passive:true});addEventListener('portfolio:intro-accelerate',accelerate);addEventListener('portfolio:intro-skip',skip);
    addEventListener('pointermove',move,{passive:true});addEventListener('click',select);
    onIntro?.(introRunning);onReady(true);
    return()=>{
      runtime.current=null;removeEventListener('wheel',accelerate);removeEventListener('portfolio:intro-accelerate',accelerate);removeEventListener('portfolio:intro-skip',skip);
      removeEventListener('pointermove',move);removeEventListener('click',select);
      if(!data.cosmicDisposed)cosmic?.dispose();onIntro?.(false);sculpture.dispose();pickMaterial.dispose();
    };
  },[gl,scene,camera,setDpr,progress,cardsProgress,velocity,onReady,onIntro,onPartHover,onPartSelect]);

  // R3F owns the renderer and frame lifecycle. Heartbeat, particles, lights and
  // the camera are updated here; there is no independent RAF or SVG compositor.
  useFrame((state, delta) => {
    const d=runtime.current;if(!d)return;
    const exit=cardsProgress.current||0,canvas=gl.domElement,backdrop=canvas.closest('.anatomy-fullscreen');
    if(backdrop)backdrop.style.opacity=String(1-THREE.MathUtils.smoothstep(exit,.55,1));
    canvas.dataset.cardsProgress=String(exit);
    if(!activeRef.current||exit>=1){d.frames=0;d.elapsed=0;return;}
    d.time+=delta;d.energy+=((velocity.current||0)-d.energy)*.08;velocity.current*=.96;
    d.sculpture.update(d.time,d.energy);
    const beat=Math.max(0,Math.sin(d.time*5.8))**10+.35*Math.max(0,Math.sin(d.time*5.8-.9))**12;
    d.sculpture.heart.scale.setScalar(1+beat*.065);
    const p=THREE.MathUtils.clamp(progress.current,0,1),mobile=innerWidth<700;
    const views=[{p:0,y:.9,z:mobile?10.8:8.6,angle:0},{p:.33,y:2.84,z:mobile?4.6:3.65,angle:-.14},
      {p:.63,y:1,z:mobile?4.8:3.6,angle:.13},{p:.82,y:.14,z:mobile?3.6:2.6,angle:.05},{p:1,y:.02,z:mobile?.2:.13,angle:0}];
    let i=views.findIndex((v,k)=>k<views.length-1&&p<=views[k+1].p);if(i<0)i=3;
    const a=views[i],b=views[i+1],t=THREE.MathUtils.smoothstep(p,a.p,b.p),lerp=THREE.MathUtils.lerp;
    const model=d.sculpture.model;model.rotation.y=.28+Math.sin(d.time*.075)*.18;model.rotation.x=d.pointer.y*.015;
    model.updateMatrixWorld(true);d.sculpture.heart.getWorldPosition(d.core);
    const dive=THREE.MathUtils.smoothstep(p,.8,1),angle=lerp(a.angle,b.angle,t)+d.pointer.x*.045;
    const y=lerp(lerp(a.y,b.y,t),d.core.y,dive),distance=lerp(a.z,b.z,t),x=lerp(0,d.core.x,dive),z=lerp(0,d.core.z,dive);
    d.look.set(x+d.pointer.x*.025,y+d.pointer.y*.02,z);camera.position.set(x+Math.sin(angle)*distance,y+Math.abs(angle)*.12,z+Math.cos(angle)*distance);
    const retreat=THREE.MathUtils.smoothstep(exit,0,1);
    camera.position.lerp(new THREE.Vector3(Math.sin(.25)*9,.9,Math.cos(.25)*9),retreat);d.look.lerp(new THREE.Vector3(0,.9,0),retreat);camera.lookAt(d.look);
    canvas.dataset.scene=p<.18?'body':p<.46?'brain':p<.76?'spine':'heart';
    if(d.introRunning){
      d.introElapsed+=delta*1000;const phase=Math.min(1,d.introElapsed/2800);
      d.cosmic.update(d.time,THREE.MathUtils.smoothstep(phase,.58,.98),Math.sin(phase*Math.PI)**2);gl.render(d.cosmic.scene,camera);
      const now=performance.now();if(now-d.energyAt>80){dispatchEvent(new CustomEvent('portfolio:intro-energy',{detail:phase}));d.energyAt=now;}
      if(phase>=1)d.finishIntro();else return;
    }
    gl.render(scene,camera);
    const parts={};for(const target of d.picks){const v=target.getWorldPosition(new THREE.Vector3()).project(camera);parts[target.userData.part]={x:(v.x*.5+.5)*innerWidth,y:(-.5*v.y+.5)*innerHeight};}
    canvas.dataset.parts=JSON.stringify(parts);canvas.dataset.heartbeat=String(beat);
    if(d.profile)canvas.dataset.camera=JSON.stringify({position:camera.position.toArray(),target:d.look.toArray(),progress:p,retreat:exit});
    d.qualityFrames++;d.qualityElapsed+=Math.min(delta*1000,200);
    if(d.qualityFrames>=30){if(d.qualityElapsed/d.qualityFrames>25&&gl.getPixelRatio()>(d.software?.35:.6))setDpr(Math.max(d.software?.35:.6,gl.getPixelRatio()*.8));d.qualityFrames=0;d.qualityElapsed=0;}
    if(d.profile){d.frames++;d.elapsed+=delta*1000;if(d.frames>=30){
      const report={fps:d.frames*1000/d.elapsed,drawCalls:gl.info.render.calls,triangles:gl.info.render.triangles,lines:gl.info.render.lines,geometries:gl.info.memory.geometries,pixelRatio:gl.getPixelRatio(),physicalMeshes:true,engine:'react-three-fiber'};
      canvas.dataset.profile=JSON.stringify(report);dispatchEvent(new CustomEvent('anatomy:performance',{detail:report}));d.frames=0;d.elapsed=0;
    }}
  },1);
  return null;
}

export default function FullCanvasAnatomy({ enabled, active, onReady, onIntro, ...props }) {
  const [ready,setReady]=useState(false),[failed,setFailed]=useState(false);
  const reportReady=useCallback(value=>{setReady(value);onReady?.(value);},[onReady]);
  const failure=useCallback(()=>{setFailed(true);setReady(false);onReady?.(false);onIntro?.(false);},[onReady,onIntro]);
  return <div className={`anatomy-art anatomy-fullscreen ${ready&&!failed?'canvas-ready':''}`} style={CANVAS_STYLE} aria-hidden="true" data-component="FullCanvasAnatomy">
    {enabled&&!failed ? <AnatomyBoundary onFailure={failure}>
      <Canvas className="anatomy-canvas" camera={CAMERA} dpr={DPR} frameloop={active?'always':'never'}
        gl={{alpha:true,antialias:true,powerPreference:'high-performance'}}
        fallback={<div className="anatomy-unavailable" data-anatomy-state="unavailable" />}>
        <AnatomyWorld {...props} active={active} onReady={reportReady} onIntro={onIntro} />
      </Canvas>
    </AnatomyBoundary> : failed ? <div className="anatomy-unavailable" data-anatomy-state="unavailable" /> : null}
  </div>;
}
