'use client';
import { Suspense, useRef } from 'react';
import { Billboard, Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { configureTextBuilder } from 'troika-three-text';
import { PROJECT_STOPS } from '../lib/flight-path';

// Fonts and glyph generation stay local. Main-thread typesetting and GPU glyph construction avoid dynamic worker
// evaluation. The glyph atlas is shared; the portfolio has one visible canvas.
configureTextBuilder({ useWorker: false });
const CHARACTERS="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,:;!?-/[]()'&";
const clean=text=>text.replace(/[’‘]/g,"'").replace(/[\u2013\u2014]/g,'-').replace(/·/g,'/');
const fonts={heading:'/fonts/Syne.ttf',body:'/fonts/PlusJakartaSans.ttf',mono:'/fonts/JetBrainsMono.ttf'};

export function WorldText({children,font='heading',size=.38,width=4,color='#dddcd2',position=[0,0,0],align='center',name,...props}){
  return <Text name={`world-text:${name||clean(children).slice(0,36)}`} font={fonts[font]} characters={CHARACTERS}
    position={position} fontSize={size} maxWidth={width} lineHeight={1.23} textAlign={align} anchorX={align==='left'?'left':'center'} anchorY="middle"
    color={color} sdfGlyphSize={64} gpuAccelerateSDF={true} material-depthTest={true} material-depthWrite={false}
    {...props}>{clean(children)}</Text>;
}

export default function WorldTypography({runtime}){
  const root=useRef(null);
  const mobile=useThree(state=>state.size.width<760);
  useFrame(()=>{
    const d=runtime.current;if(!root.current||!d)return;
    root.current.visible=!d.introRunning;
    const hero=root.current.getObjectByName('hero-typography');if(hero)hero.visible=d.progress<.065;
    for(const stop of PROJECT_STOPS){const group=root.current.getObjectByName(`project-text:${stop.project.id}`);if(group)group.visible=Math.abs(d.progress-stop.progress)<.042;}
    for(const [name,start,end] of [['cranial-label',0,.18],['spinal-label',.15,.27],['cardiac-label',.24,.34],['tech-heading',.35,.42],['studio-heading',.63,.70],['portal-quote',.56,.65],['contact-typography',.95,1.01]]){const group=root.current.getObjectByName(name);if(group)group.visible=d.progress>=start&&d.progress<end;}
  });
  return <group ref={root} name="world-space-typography"><Suspense fallback={null}>
    <Billboard name="hero-typography" position={mobile?[0,2,1.25]:[-1.65,1.6,1.25]}>
      <WorldText position={[0,1.22,0]} font="mono" size={.105} width={4} color="#abbfbd">NAVYA GUPTA / A MULTIDISCIPLINARY MIND</WorldText>
      <WorldText size={.63} width={4.4}>{'The science\nof possibility.'}</WorldText>
      <WorldText position={[0,-1.2,0]} font="body" size={.15} width={3.8} color="#b9c0b4">Rooted in biology. Wired for ideas. Moved by people.</WorldText>
      <WorldText position={[0,-1.78,0]} font="mono" size={.09} color="#90a8a7">SCROLL TO FLY / DRAG THE TIMELINE TO EXPLORE</WorldText>
    </Billboard>
    <Billboard name="cranial-label" position={[-.9,3.45,.15]}><WorldText font="mono" size={.09} width={2} color="#9aafb0">01 / NEURAL ORIGIN</WorldText></Billboard>
    <Billboard name="spinal-label" position={[.85,1.35,.3]}><WorldText font="mono" size={.09} width={2} color="#a6afab">02 / CONNECTIVE SYSTEM</WorldText></Billboard>
    <Billboard name="cardiac-label" position={[-.75,.05,.85]}><WorldText font="mono" size={.09} width={2} color="#bda48e">03 / CREATIVE CORE</WorldText></Billboard>
    <Billboard name="tech-heading" position={[4,2.6,-2.4]}><WorldText size={.42} color="#b8c6c3">THE BIO-TECH LAB</WorldText></Billboard>
    <Billboard name="studio-heading" position={[20,2.6,-28.4]}><WorldText size={.42} color="#c4af96">THE CREATIVE STUDIO</WorldText></Billboard>
    {PROJECT_STOPS.map(({project,realm,position})=><Billboard key={project.id} position={position} name={`project-text:${project.id}`}>
      <WorldText position={[0,1.5,1.25]} font="mono" size={.095} width={3.8} color={realm==='tech'?'#9aafb0':'#c4ae8d'}>{`${project.number} / ${project.category}`}</WorldText>
      <WorldText position={[0,.65,1.25]} size={.39} width={3.5} color={realm==='tech'?'#d7dfd8':'#e2d6c7'}>{project.title}</WorldText>
      <WorldText position={[0,-.35,1.25]} font="body" size={.125} width={3.35} color="#b9bcb5">{project.description}</WorldText>
      <WorldText position={[0,-1.04,1.25]} font="mono" size={.08} width={3.5} color={realm==='tech'?'#a5b4a9':'#b7a38d'}>{project.tags.join(' / ')}</WorldText>
      <WorldText name={`project-cta:${project.id}`} position={[0,-1.55,1.3]} font="mono" size={.12} color={realm==='tech'?'#9aafb0':'#c3b297'}>{'EXPLORE WORK ->'}</WorldText>
      <WorldText position={[0,2.02,1.1]} font="mono" size={.07} color="#a4afa3">[STATUS: ACTIVE] / AUTHORED WORK & CONTEXT</WorldText>
    </Billboard>)}
    <Billboard name="portal-quote" position={[13,2.6,-21]}><WorldText size={.35} width={4.6} color="#c3bbb0">Between disciplines, another world.</WorldText></Billboard>
    <Billboard name="contact-typography" position={[27,1,-54]}>
      <WorldText position={[0,1.1,0]} font="mono" size={.10} color="#c4ae8d">THE NEXT CONNECTION</WorldText>
      <WorldText size={.55} width={4}>{'What could we\nmake possible?'}</WorldText>
      <WorldText position={[0,-1.2,0]} font="body" size={.16} width={4} color="#c2b4a0">Research. Creative strategy. Something in between.</WorldText>
      <WorldText name="contact-cta" position={[0,-1.9,0]} font="mono" size={.13} color="#cbb79c">OPEN CONTACT FORM -></WorldText>
    </Billboard>
  </Suspense></group>;
}

export function WorldHUD({runtime}){
  const root=useRef(null),telemetry=useRef(null);const mobile=useThree(state=>state.size.width<760);let previous=-1;
  useFrame(({camera})=>{
    const data=runtime.current;if(!data||!root.current)return;
    root.current.position.copy(camera.position);root.current.quaternion.copy(camera.quaternion);root.current.visible=!data.introRunning;
    const percent=Math.round(data.progress*100);
    if(telemetry.current&&percent!==previous){previous=percent;telemetry.current.text=mobile?`FLIGHT ${percent}%`:`${data.zone.toUpperCase()} / FLIGHT ${String(percent).padStart(2,'0')}% / XYZ ${camera.position.toArray().map(v=>v.toFixed(1)).join(' ')}`;telemetry.current.sync();}
  });
  return <group ref={root} name="camera-space-telemetry"><Suspense fallback={null}>
    <Text ref={telemetry} name="world-text:live-flight-telemetry" font={fonts.mono} characters={CHARACTERS} position={[0,mobile?-1.3:-1.4,-4]} fontSize={.045} maxWidth={mobile?1.15:3.5} anchorX="center" color="#a1aaa5" material-depthTest={true} material-depthWrite={false} gpuAccelerateSDF={true}>FLIGHT / 00%</Text>
  </Suspense></group>;
}
