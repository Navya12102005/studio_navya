'use client';
import {Html} from '@react-three/drei';
import {useFrame,useThree} from '@react-three/fiber';
import {useMemo,useRef} from 'react';
import * as THREE from 'three';
import {spiralPose} from '../lib/spiral-camera';
const LABELS=[
 ['01 // NEURAL CORE','BIOENGINEERING & SYSTEM ARCHITECTURE'],
 ['02 // BACKBONE','AWS & DATA PIPELINES'],
 ['03 // CREATIVE ENGINE','BRAND STRATEGY & STARTUP LEADERSHIP'],
 ['04 // WORLD TRANSITION','TECH LAB / CREATIVE STUDIO']
];
export default function AnatomyAnchors({anchors,progress}){
 const {size}=useThree(),refs=useRef([]);
 const placements=useMemo(()=>LABELS.map((_,i)=>{
  const pose=spiralPose(i/3,anchors,size.width/size.height);
  // Labels live in world space, just in front of each organ's camera stop.
  const position=pose.target.clone().lerp(pose.position,.45);position.y+=.95;
  return position.toArray();
 }),[anchors,size.width,size.height]);
 useFrame(()=>refs.current.forEach((element,i)=>{if(element)element.style.opacity=String(THREE.MathUtils.smoothstep(1-Math.abs(progress.current-i/3)*3.5,.1,.85));}));
 return <group name="spatial-anatomy-labels">{LABELS.map(([title,subtitle],i)=><Html key={title} position={placements[i]} transform sprite occlude scale={.4} distanceFactor={4} zIndexRange={[1,0]} style={{pointerEvents:'none'}}>
  <div ref={el=>refs.current[i]=el} className="anatomy-spatial-label" data-spatial-checkpoint={i+1} aria-hidden="true"><span>{title}</span><small>{subtitle}</small></div>
 </Html>)}</group>;
}
