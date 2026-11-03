'use client';
import {Html} from '@react-three/drei';
import {useFrame,useThree} from '@react-three/fiber';
import {useEffect,useMemo,useRef} from 'react';
import * as THREE from 'three';
import {useMotion} from './MotionProvider';
import LobeHudPanel from './LobeHudPanel';
import {surgicalState} from '../lib/surgical-narrative';
import {spiralPose} from '../lib/spiral-camera';
const STOPS=[0,.375,.625,1];
const LABELS=[
 ['01 // TECH ENTHUSIAST','PROMPT ENGINEER & VIBE CODER'],
 ['02 // THE BACKBONE','BIOENGINEERING & BIOMEDICAL INNOVATION'],
 ['03 // CREATIVE & NON-TECH','DESIGN LEADERSHIP & STUDIO NAVYA'],
 ['04 // WORLD TRANSITION','TECH LAB / CREATIVE STUDIO']
];
export default function AnatomyAnchors({anchors,progress,model}){
 const {size,camera}=useThree(),refs=useRef([]),narrativeRefs=useRef([]),left=useRef(),right=useRef(),creative=useRef(),bio=useRef(),panels=useRef([]),pointer=useRef(new THREE.Vector2()),smoothPointer=useRef(new THREE.Vector2());
 const {active}=useMotion();
 useEffect(()=>{const move=event=>pointer.current.set(event.clientX/innerWidth*2-1,1-event.clientY/innerHeight*2);const reset=event=>{if(!event.relatedTarget)pointer.current.set(0,0);};addEventListener('pointermove',move,{passive:true});addEventListener('pointerout',reset);return()=>{removeEventListener('pointermove',move);removeEventListener('pointerout',reset);};},[]);
 const occluders=useMemo(()=>model?[{current:model}]:[],[model]);
 const placements=useMemo(()=>LABELS.map((_,i)=>{
  const pose=spiralPose(STOPS[i],anchors,size.width/size.height);
  // Labels live in world space, just in front of each organ's camera stop.
  const position=pose.target.clone().lerp(pose.position,.45);position.y+=i===0?.65:.95;
  return position.toArray();
 }),[anchors,size.width,size.height]);
 useFrame((state,delta)=>{if(!active)return;const s=surgicalState(progress.current);
  narrativeRefs.current.forEach((el,i)=>{if(el)el.style.opacity=String(i<2?s.separation*(1-THREE.MathUtils.smoothstep(progress.current,.25,.32)):i===2?s.creativeMix:THREE.MathUtils.smoothstep(progress.current,.27,.32)*(1-THREE.MathUtils.smoothstep(progress.current,.46,.5)));});
  const towardsBrain=camera.position.clone().sub(new THREE.Vector3(...anchors.brain)).normalize().multiplyScalar(1.8);
  smoothPointer.current.lerp(pointer.current,1-Math.exp(-5*Math.min(delta,.1)));
  for(const [node,side,index,name] of [[left.current,1,0,'BrainLeft'],[right.current,-1,1,'BrainRight']])if(node){
   const hemisphere=model?.getObjectByName(name);if(hemisphere){hemisphere.updateWorldMatrix(true,false);hemisphere.getWorldPosition(node.position);}else node.position.set(...anchors.brain);
   node.position.x+=side*.65;node.position.y+=side*(size.width<600?.68:.4);node.position.add(towardsBrain);

   node.position.add(new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,0).multiplyScalar(smoothPointer.current.x*.045));node.position.y+=smoothPointer.current.y*.025;
   node.quaternion.copy(camera.quaternion).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(smoothPointer.current.y*.04,smoothPointer.current.x*.055,0)));
   const width=Math.min(270,Math.max(156,size.width*.20)),height=size.width<600?174:148;
   camera.updateMatrixWorld();const projected=node.position.clone().project(camera),marginX=(width/2+12)*2/size.width,marginY=(height/2+12)*2/size.height;
   projected.x=THREE.MathUtils.clamp(projected.x,-1+marginX,1-marginX);projected.y=THREE.MathUtils.clamp(projected.y,-1+marginY,1-marginY);node.position.copy(projected.unproject(camera));
   const depth=-node.position.clone().applyMatrix4(camera.matrixWorldInverse).z,worldPixel=2*depth*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))/size.height;
   if(panels.current[index]){panels.current[index].scale.set(width*worldPixel,height*worldPixel/.54,1);panels.current[index].visible=s.separation>.01&&progress.current<.32;panels.current[index].traverse(child=>{if(child.material)child.material.opacity=(child.isLineSegments?.45:.15)*s.separation*(1-THREE.MathUtils.smoothstep(progress.current,.25,.32));});}
   if(narrativeRefs.current[index]){narrativeRefs.current[index].style.width=`${width-24}px`;narrativeRefs.current[index].dataset.anchor=JSON.stringify(node.position.toArray());narrativeRefs.current[index].dataset.parallax=JSON.stringify(smoothPointer.current.toArray());}
  }
  if(creative.current)creative.current.position.set(...anchors.heart).add(camera.position.clone().sub(new THREE.Vector3(...anchors.heart)).normalize().multiplyScalar(1.9)).add(new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,0).multiplyScalar(.25)).add(new THREE.Vector3(0,.06,0));
  if(bio.current)bio.current.position.set(...anchors.spine).add(camera.position.clone().sub(new THREE.Vector3(...anchors.spine)).normalize().multiplyScalar(1.6)).add(new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,0).multiplyScalar(size.width<600?.1:.5)).add(new THREE.Vector3(0,.1,0));
  refs.current.forEach((element,i)=>{if(element)element.style.opacity=String(THREE.MathUtils.smoothstep(1-Math.abs(progress.current-STOPS[i])*5.5,.1,.85));});});
 return <group name="spatial-anatomy-labels">{LABELS.map(([title,subtitle],i)=><Html key={title} position={placements[i]} transform sprite occlude={occluders} scale={.4} distanceFactor={4} zIndexRange={[1,0]} style={{pointerEvents:'none'}}>
  <div ref={el=>refs.current[i]=el} className="anatomy-spatial-label" data-spatial-checkpoint={i+1} aria-hidden="true"><span>{title}</span><small>{subtitle}</small></div>
 </Html>)}
  {[['PYTHON & AI SYSTEMS','DATA PIPELINES & TECHNICAL EXPLORATION','PYTHON, JAVA & GENERATIVE AI WORKFLOWS'],['TECH ENTHUSIAST','PROMPT ENGINEER & VIBE CODER','PROMPT SYSTEMS, CREATIVE CODING & AI EXPLORATION'],['CREATIVE & NON-TECH ROLES','DESIGN LEADERSHIP & STUDIO NAVYA',''],['BIOENGINEERING & BIOMEDICAL INNOVATION','HEALTHCARE CONTRIBUTOR','RESEARCH, MOLECULAR DOCKING & COMPUTATIONAL BIOSENSORS']].map(([title,subtitle,detail],i)=><group key={title} ref={i===0?left:i===1?right:i===2?creative:bio} position={i===2?[anchors.heart[0],anchors.heart[1]+.8,anchors.heart[2]+1.1]:undefined}>
   {i<2?<group ref={el=>panels.current[i]=el}><LobeHudPanel color={i===0?'#00F0FF':'#ae73ff'}/></group>:null}
   <Html center occlude={occluders} zIndexRange={[1,0]} style={{pointerEvents:'none'}}><div ref={el=>narrativeRefs.current[i]=el} className={`anatomy-spatial-label narrative-label narrative-${i}`} data-narrative-label={i} aria-hidden="true"><span>{title} //</span><small>{subtitle}</small>{detail?<p className="lobe-hud-detail">{detail}</p>:null}</div></Html>
  </group>)}
 </group>;
}
