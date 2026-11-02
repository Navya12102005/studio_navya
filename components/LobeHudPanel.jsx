'use client';
import {useMemo} from 'react';
import * as THREE from 'three';
// An open-corner optical surface in world space, never a CSS card or black mask.
export default function LobeHudPanel({color,opacity=.15}){
 const shape=useMemo(()=>{const s=new THREE.Shape();s.moveTo(-.5,-.27);s.lineTo(.43,-.27);s.lineTo(.5,-.2);s.lineTo(.5,.2);s.lineTo(.43,.27);s.lineTo(-.43,.27);s.lineTo(-.5,.2);s.lineTo(-.5,-.2);s.lineTo(-.43,-.27);s.closePath();return s;},[]);
 const brackets=useMemo(()=>new Float32Array([-.5,.1,.004,-.5,.2,.004,-.5,.2,.004,-.43,.27,.004,-.43,.27,.004,-.32,.27,.004,.5,-.1,.004,.5,-.2,.004,.5,-.2,.004,.43,-.27,.004,.43,-.27,.004,.32,-.27,.004]),[]);
 return <group name="lobe-glass-hud-surface"><mesh raycast={()=>{}}><shapeGeometry args={[shape]}/><meshPhysicalMaterial color={color} transmission={.85} transparent opacity={opacity} roughness={.08} clearcoat={1} clearcoatRoughness={.1} ior={1.52} thickness={.012} depthWrite={false} side={THREE.DoubleSide}/></mesh><lineSegments raycast={()=>{}}><bufferGeometry><bufferAttribute attach="attributes-position" args={[brackets,3]}/></bufferGeometry><lineBasicMaterial color={color} transparent opacity={opacity*3} depthWrite={false}/></lineSegments></group>;
}
