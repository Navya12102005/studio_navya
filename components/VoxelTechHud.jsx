'use client';
import {useEffect,useState} from 'react';
import {useMotion} from './MotionProvider';

const NAMES={'atmospheric-entry':'01 / ATMOSPHERIC ENTRY','voxel-brain':'02 / VOXEL NEURAL CORE','code-terminals':'03 / ACTIVE CODE TERMINALS'};

export default function VoxelTechHud(){
 const [frame,setFrame]=useState(null),{enabled,paused,setPaused}=useMotion();
 useEffect(()=>{const update=event=>setFrame(event.detail);addEventListener('portfolio:voxel-tech-frame',update);return()=>removeEventListener('portfolio:voxel-tech-frame',update);},[]);
 const active=enabled&&frame?.active;
 useEffect(()=>{const elements=[document.querySelector('main'),document.querySelector('.site-header'),document.querySelector('.site-footer')].filter(Boolean);elements.forEach(element=>element.inert=!!active);return()=>elements.forEach(element=>element.inert=false);},[active]);
 useEffect(()=>{if(!active)return;const key=event=>{if(event.key==='Escape')document.getElementById('heart')?.scrollIntoView({behavior:'auto',block:'center'});};addEventListener('keydown',key);return()=>removeEventListener('keydown',key);},[active]);
 if(!active)return null;
 return <aside className="voxel-tech-hud" aria-label="Tech Core telemetry" data-voxel-sequence={frame.sequence}>
  <header><p>REALM 01 // TECH CORE</p><div><button onClick={()=>setPaused(value=>!value)}>{paused?'Resume realm':'Pause realm'}</button><button onClick={()=>document.getElementById('heart')?.scrollIntoView({behavior:'auto',block:'center'})}>Return to anatomy</button></div></header>
  <p className="voxel-sequence" aria-live="polite">{NAMES[frame.sequence]}</p>
  <footer><span>OBSIDIAN NETWORK / ONLINE</span><span>BRAIN VOXELS {frame.assets.brainVoxels.toLocaleString()}</span><span>ASH {frame.assets.ashParticles.toLocaleString()}</span><span>{Math.round(frame.progress*100).toString().padStart(3,'0')}%</span></footer>
 </aside>;
}
