'use client';
import {Html} from '@react-three/drei';
import {useFrame,useThree} from '@react-three/fiber';
import {useMemo,useRef} from 'react';
import * as THREE from 'three';
import {surgicalState} from '../lib/surgical-narrative';
import {spiralPose} from '../lib/spiral-camera';
const STOPS=[0,.375,.625,1];
const LABELS=[
 ['01 // NEURAL CORE','BIOENGINEERING & SYSTEM ARCHITECTURE'],
 ['02 // BACKBONE','AWS & DATA PIPELINES'],
 ['03 // CREATIVE ENGINE','BRAND STRATEGY & STARTUP LEADERSHIP'],
 ['04 // WORLD TRANSITION','TECH LAB / CREATIVE STUDIO']
];
export default function AnatomyAnchors({anchors,progress,model}){
 const {size,camera}=useThree(),refs=useRef([]),narrativeRefs=useRef([]),left=useRef(),right=useRef(),creative=useRef();
 const occluders=useMemo(()=>model?[{current:model}]:[],[model]);
 const placements=useMemo(()=>LABELS.map((_,i)=>{
  const pose=spiralPose(STOPS[i],anchors,size.width/size.height);
  // Labels live in world space, just in front of each organ's camera stop.
  const position=pose.target.clone().lerp(pose.position,.45);position.y+=.95;
  return position.toArray();
 }),[anchors,size.width,size.height]);
 useFrame(()=>{const s=surgicalState(progress.current);
  narrativeRefs.current.forEach((el,i)=>{if(el)el.style.opacity=String(i<2?s.separation*(1-THREE.MathUtils.smoothstep(progress.current,.25,.32)):s.creativeMix);});
  const towardsBrain=camera.position.clone().sub(new THREE.Vector3(...anchors.brain)).normalize().multiplyScalar(1.8);
  for(const [node,side] of [[left.current,1],[right.current,-1]])if(node){node.position.set(anchors.brain[0]+side*(.65+s.separation*.45),anchors.brain[1]+side*.4,anchors.brain[2]).add(towardsBrain);}
  if(creative.current)creative.current.position.set(...anchors.heart).add(camera.position.clone().sub(new THREE.Vector3(...anchors.heart)).normalize().multiplyScalar(1.9)).add(new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,0).multiplyScalar(.25)).add(new THREE.Vector3(0,.06,0));
  refs.current.forEach((element,i)=>{if(element)element.style.opacity=String(THREE.MathUtils.smoothstep(1-Math.abs(progress.current-STOPS[i])*5.5,.1,.85));});});
 return <group name="spatial-anatomy-labels">{LABELS.map(([title,subtitle],i)=><Html key={title} position={placements[i]} transform sprite occlude={occluders} scale={.4} distanceFactor={4} zIndexRange={[1,0]} style={{pointerEvents:'none'}}>
  <div ref={el=>refs.current[i]=el} className="anatomy-spatial-label" data-spatial-checkpoint={i+1} aria-hidden="true"><span>{title}</span><small>{subtitle}</small></div>
 </Html>)}
  {[['BIOMEDICAL INNOVATION','FUTURE HEALTHCARE CONTRIBUTOR'],['TECH ENTHUSIAST','PROMPT ENGINEER, VIBE CODER, PYTHON ARCHITECT'],['CREATIVE PERSON','NON-TECH ROLES, DESIGN LEADERSHIP & STRATEGY']].map(([title,subtitle],i)=><group key={title} ref={i===0?left:i===1?right:creative} position={i===2?[anchors.heart[0],anchors.heart[1]+.8,anchors.heart[2]+1.1]:undefined}>
   <Html center occlude={occluders} zIndexRange={[1,0]} style={{pointerEvents:'none'}}><div ref={el=>narrativeRefs.current[i]=el} className={`anatomy-spatial-label narrative-label narrative-${i}`} data-narrative-label={i} aria-hidden="true"><span>{title} //</span><small>{subtitle}</small></div></Html>
  </group>)}
 </group>;
}
