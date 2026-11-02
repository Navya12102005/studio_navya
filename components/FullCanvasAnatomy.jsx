'use client';

import { Component, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { createImportedAnatomy } from '../lib/imported-anatomy';
import CanvasLoader from './CanvasLoader';
import { createCosmicWarp } from '../lib/cosmic';
import { createAmbientField, createRealmWorld, createSpatialLabel } from '../lib/realm-world';
import { spatialState, sampleHelix, projectAnchor } from '../lib/spatial';

const GL_OPTIONS = { alpha: true, antialias: true, powerPreference: 'high-performance' };
const CAMERA = { position: [0, .9, 8.6], fov: 38, near: .025, far: 80 };
const CANVAS_STYLE = { position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', width: '100vw', height: '100vh' };

class AnatomyBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? <div className="anatomy-unavailable" data-anatomy-state="unavailable" /> : this.props.children; }
}

function AnatomyWorld({ progress, cardsProgress, velocity, active, onReady, onIntro, onPartHover, onPartSelect, onQuality }) {
  const { scene: modelAsset } = useGLTF('/models/skeleton.glb', false, false);
  const { gl, scene, camera, setFrameloop } = useThree();
  const runtime = useRef(null), activeRef = useRef(active);
  activeRef.current = active;
  useEffect(() => { setFrameloop(active ? 'always' : 'never'); }, [active, setFrameloop]);
  useLayoutEffect(() => {
    const context = gl.getContext(), debug = context.getExtension('WEBGL_debug_renderer_info');
    const software = debug ? /swiftshader|llvmpipe|software/i.test(context.getParameter(debug.UNMASKED_RENDERER_WEBGL)) : false;
    if (software) onQuality(.5);
    gl.transmissionResolutionScale = software ? .25 : .75;
    gl.setClearColor(0x030305, 0); gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1;
    const sculpture = createImportedAnatomy(scene, gl, modelAsset);
    const realms = createRealmWorld(scene, { economy: software }), ambient = createAmbientField();
    const milestones = [
      ['brain', '01 / NEURAL ORIGIN', [-.9, 3.35, .05]], ['spine', '02 / CONNECTIVE SYSTEM', [.8, 1.5, .1]], ['heart', '03 / CREATIVE CORE', [-.8, .3, .6]]
    ].map(([id,text,position]) => { const label = createSpatialLabel(text, { width: 1.6, color: id === 'heart' ? '#ffb593' : '#9cecff' }); label.mesh.position.set(...position); sculpture.model.add(label.mesh); return {id, position, ...label}; });
    const canvas = gl.domElement;
    canvas.dataset.renderer = 'physical-mesh'; canvas.dataset.engine = 'react-three-fiber';
    canvas.dataset.modelSource = '/models/skeleton.glb';
    canvas.dataset.importedMeshes = JSON.stringify(sculpture.sourceMeshes);
    const actualMaterials=new Map();let wireframes=0;
    sculpture.model.traverse(object=>{if(object.isMesh){const list=Array.isArray(object.material)?object.material:[object.material];for(const material of list){if(material.wireframe)wireframes++;if(material.isMeshPhysicalMaterial)actualMaterials.set(material.uuid,{name:material.name,roughness:material.roughness,clearcoat:material.clearcoat,transmission:material.transmission,ior:material.ior});}}});
    canvas.dataset.physicalMaterials=JSON.stringify([...actualMaterials.values()]);canvas.dataset.wireframeMeshes=String(wireframes);
    canvas.dataset.nativeText=JSON.stringify([...milestones.map(item=>item.mesh.name),...realms.root.children.filter(item=>item.name.startsWith('spatial-text:')).map(item=>item.name)]);
    canvas.dataset.glassMode = software ? 'physical-low-resolution' : 'physical-transmission';
    // Raycast the imported surfaces themselves. No generated proxy skeleton or
    // invisible primitive anatomy is added alongside the GLB.
    const picks = [];
    for (const [part,names] of [
      ['brain',['Cranium','Brain']],['heart',['Heart']],
      ['spine',['CervicalSpine','ThoracicSpine']],['vascular',['Ribcage','Sternum']]
    ]) for (const name of names) {
      const target = sculpture.model.getObjectByName(name);
      if (target?.isMesh) { target.userData.part=part;picks.push(target); }
    }
    let seen = true;
    try { seen = sessionStorage.getItem('navya-intro-seen') === '1'; } catch {}
    const introRunning = !seen && scrollY < 80;
    const cosmic = introRunning ? createCosmicWarp(sculpture.model, innerWidth < 700) : null;
    const data = { software, sculpture, realms, ambient, milestones, blend: 0, warmth: 0, cameraProgress: 0, picks, cosmic, cosmicDisposed: false, introRunning, introElapsed: 0,
      energyAt: 0, time: 0, energy: 0, hovered: null, pickAt: 0, pointer: {x:0,y:0},
      raycaster: new THREE.Raycaster(), ndc: new THREE.Vector2(), core: new THREE.Vector3(), look: new THREE.Vector3(),
      projection: new THREE.Vector3(), worldAnchor: new THREE.Vector3(), retreatPosition: new THREE.Vector3(0,.25,8.4), retreatLook: new THREE.Vector3(0,.1,0),
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
    const select=event=>{
      if(spatialState.workVisible && activeRef.current && !data.introRunning && !event.target.closest('dialog,input,textarea,select')) {
        const ndc = new THREE.Vector2(event.clientX/innerWidth*2-1, -event.clientY/innerHeight*2+1);
        realms.burst(ndc,camera,spatialState.realm==='creative');
      }
      if(data.hovered&&!data.introRunning&&activeRef.current&&event.target.matches('.journey-sticky,.scene-vignette,.anatomical-journey'))onPartSelect?.(data.hovered);};
    addEventListener('wheel',accelerate,{passive:true});addEventListener('portfolio:intro-accelerate',accelerate);addEventListener('portfolio:intro-skip',skip);
    addEventListener('pointermove',move,{passive:true});addEventListener('click',select);
    onIntro?.(introRunning);onReady(true);
    return()=>{
      runtime.current=null;removeEventListener('wheel',accelerate);removeEventListener('portfolio:intro-accelerate',accelerate);removeEventListener('portfolio:intro-skip',skip);
      removeEventListener('pointermove',move);removeEventListener('click',select);
      if(!data.cosmicDisposed)cosmic?.dispose();onIntro?.(false);milestones.forEach(label=>label.dispose());realms.dispose();ambient.dispose();sculpture.dispose();
    };
  },[gl,scene,camera,modelAsset,onQuality,progress,cardsProgress,velocity,onReady,onIntro,onPartHover,onPartSelect]);

  // R3F owns the renderer and frame lifecycle. Heartbeat, particles, lights and
  // the camera are updated here; there is no independent RAF or SVG compositor.
  useFrame((state, delta) => {
    const d=runtime.current;if(!d)return;
    const exit=cardsProgress.current||0,canvas=gl.domElement,backdrop=canvas.closest('.anatomy-fullscreen');
    if(backdrop)backdrop.style.opacity='1';
    canvas.dataset.cardsProgress=String(exit);
    if(!activeRef.current){d.frames=0;d.elapsed=0;return;}
    d.time+=delta;d.energy+=((velocity.current||0)-d.energy)*.08;velocity.current*=.96;
    const p=THREE.MathUtils.clamp(progress.current,0,1),mobile=innerWidth<700;
    d.cameraProgress=THREE.MathUtils.damp(d.cameraProgress,p,7,Math.min(delta,.1));
    d.blend=THREE.MathUtils.damp(d.blend,spatialState.realm==='creative'?1:0,3.8,Math.min(delta,.1));
    const realmOpacity=THREE.MathUtils.smoothstep(exit,0,.7);
    const targetWarmth=THREE.MathUtils.lerp(THREE.MathUtils.smoothstep(p,.38,1),d.blend,realmOpacity);
    d.warmth=THREE.MathUtils.damp(d.warmth,targetWarmth,3.5,Math.min(delta,.1));
    const model=d.sculpture.model;
    model.position.z=0;model.scale.setScalar(1);model.visible=exit<.95;
    model.rotation.y=.28+Math.sin(d.time*.075)*.18;model.rotation.x=d.pointer.y*.015;
    model.updateMatrixWorld(true);d.sculpture.heart.getWorldPosition(d.core);
    const helix=sampleHelix(d.cameraProgress,{mobile,heart:d.core.toArray(),pointer:[d.pointer.x,d.pointer.y]});
    d.look.set(...helix.target);camera.position.set(...helix.position);
    const retreat=THREE.MathUtils.smoothstep(exit,0,1);
    camera.position.lerp(d.retreatPosition,retreat);d.look.lerp(d.retreatLook,retreat);camera.lookAt(d.look);
    model.position.z=-retreat*10;model.scale.setScalar(1-retreat*.45);
    if(model.visible)d.sculpture.update(d.time,d.energy,d.warmth);
    const beat=Math.max(0,Math.sin(d.time*5.8))**10+.35*Math.max(0,Math.sin(d.time*5.8-.9))**12;
    d.sculpture.heart.scale.setScalar(1+beat*.065);
    d.realms.update(d.time,delta,{blend:d.blend,opacity:realmOpacity,pointer:{x:d.pointer.x,y:-d.pointer.y},project:spatialState.project,pixelRatio:gl.getPixelRatio()},camera);
    d.ambient.update(d.time,d.warmth,d.pointer,innerWidth/innerHeight);
    canvas.dataset.scene=exit>.7?spatialState.realm:p<.18?'body':p<.46?'brain':p<.76?'spine':'heart';
    canvas.dataset.realm=spatialState.realm;canvas.dataset.realmBlend=d.blend.toFixed(4);canvas.dataset.warmth=d.warmth.toFixed(4);
    document.documentElement.style.setProperty('--ambient-warmth',d.warmth.toFixed(4));
    if(d.introRunning){
      d.introElapsed+=delta*1000;const phase=Math.min(1,d.introElapsed/2800);
      d.cosmic.update(d.time,THREE.MathUtils.smoothstep(phase,.58,.98),Math.sin(phase*Math.PI)**2);gl.render(d.cosmic.scene,camera);
      const now=performance.now();if(now-d.energyAt>80){dispatchEvent(new CustomEvent('portfolio:intro-energy',{detail:phase}));d.energyAt=now;}
      if(phase>=1)d.finishIntro();else return;
    }
    gl.autoClear=false;gl.clear();gl.render(d.ambient.scene,d.ambient.camera);gl.clearDepth();gl.render(scene,camera);
    // Matching HTML markers inherit actual projected world positions. They hide
    // behind the camera/frustum rather than clamping into misleading screen UI.
    model.updateMatrixWorld(true);
    for(const label of d.milestones){
      label.mesh.quaternion.copy(model.quaternion).invert().multiply(camera.quaternion);label.mesh.visible=exit<.1;
      label.mesh.getWorldPosition(d.worldAnchor);
      const anchor=projectAnchor(d.worldAnchor.toArray(),camera,{width:innerWidth,height:innerHeight},d.projection);
      const element=document.querySelector(`[data-world-anchor="${label.id}"]`);
      if(element){element.style.transform=`translate3d(${anchor.x}px,${anchor.y+28}px,0)`;element.style.opacity=anchor.visible&&exit<.1?'0.65':'0';element.dataset.worldPosition=d.worldAnchor.toArray().join(',');}
    }
    const activeProject=document.querySelector(`[data-project-index="${spatialState.project}"]`);
    if(activeProject && realmOpacity>.5){
      const side=spatialState.project%2?1:-1;
      const anchor=projectAnchor([side*1.9,.2,.1],camera,{width:innerWidth,height:innerHeight},d.projection);
      activeProject.dataset.worldPosition=`${side*1.9},0.2,0.1`;
      activeProject.style.setProperty('--world-parallax',`${Math.max(-18,Math.min(18,(anchor.x-innerWidth*.5)*.035))}px`);
    }
    canvas.dataset.realmEffects=JSON.stringify(d.realms.diagnostics());
    const parts={};for(const target of d.picks){const v=target.getWorldPosition(new THREE.Vector3()).project(camera);parts[target.userData.part]={x:(v.x*.5+.5)*innerWidth,y:(-.5*v.y+.5)*innerHeight};}
    canvas.dataset.parts=JSON.stringify(parts);canvas.dataset.heartbeat=String(beat);
    if(d.profile)canvas.dataset.camera=JSON.stringify({position:camera.position.toArray(),target:d.look.toArray(),progress:d.cameraProgress,retreat:exit,angle:helix.angle,radius:helix.radius,elevation:helix.elevation});
    d.qualityFrames++;d.qualityElapsed+=Math.min(delta*1000,200);
    if(d.qualityFrames>=30){if(d.qualityElapsed/d.qualityFrames>25&&gl.getPixelRatio()>(d.software?.35:.65))onQuality(Math.max(d.software?.35:.65,gl.getPixelRatio()*.8));d.qualityFrames=0;d.qualityElapsed=0;}
    if(d.profile){d.frames++;d.elapsed+=delta*1000;if(d.frames>=30){
      const report={fps:d.frames*1000/d.elapsed,drawCalls:gl.info.render.calls,triangles:gl.info.render.triangles,lines:gl.info.render.lines,geometries:gl.info.memory.geometries,pixelRatio:gl.getPixelRatio(),physicalMeshes:true,engine:'react-three-fiber'};
      canvas.dataset.profile=JSON.stringify(report);dispatchEvent(new CustomEvent('anatomy:performance',{detail:report}));d.frames=0;d.elapsed=0;
    }}
  },1);
  return null;
}

export default function FullCanvasAnatomy({ enabled, active, onReady, onIntro, ...props }) {
  const [ready,setReady]=useState(false),[failed,setFailed]=useState(false),[dpr,setDpr]=useState(1.25);
  const quality=useCallback(value=>setDpr(value),[]);
  const reportReady=useCallback(value=>{setReady(value);onReady?.(value);},[onReady]);
  const failure=useCallback(()=>{setFailed(true);setReady(false);onReady?.(false);onIntro?.(false);},[onReady,onIntro]);
  return <div className={`anatomy-art anatomy-fullscreen ${ready&&!failed?'canvas-ready':''}`} style={CANVAS_STYLE} aria-hidden="true" data-component="FullCanvasAnatomy">
    {enabled&&!failed ? <AnatomyBoundary onFailure={failure}>
      <Canvas className="anatomy-canvas" camera={CAMERA} dpr={dpr} frameloop={active?'always':'never'}
        gl={GL_OPTIONS}
        fallback={<div className="anatomy-unavailable" data-anatomy-state="unavailable" />}>
        <Suspense fallback={<CanvasLoader />}>
          <AnatomyWorld {...props} onQuality={quality} active={active} onReady={reportReady} onIntro={onIntro} />
        </Suspense>
      </Canvas>
    </AnatomyBoundary> : failed ? <div className="anatomy-unavailable" data-anatomy-state="unavailable" /> : null}
  </div>;
}
