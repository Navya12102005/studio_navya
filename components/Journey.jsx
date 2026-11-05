'use client';
import dynamic from 'next/dynamic';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { useMotion } from './MotionProvider';
import { ArrowUpRight } from './Icons';
const FullCanvasAnatomy=dynamic(()=>import('./FullCanvasAnatomy'),{ssr:false});
const chapters=[
 {id:'brain',label:'01 // TECH ENTHUSIAST: PROMPT ENGINEER & VIBE CODER',title:'Think in code.',text:'Technical exploration through Python data pipelines, prompt engineering, generative AI workflows and creative coding. Explore the working Python demonstration and the systems behind this installation.',domain:'tech',project:'data',action:'Explore technical workflows'},
 {id:'spine',label:'02 // BIOENGINEERING & BIOMEDICAL INNOVATION: HEALTHCARE CONTRIBUTOR',title:'A biomedical foundation.',text:'My bioengineering foundation connects research context, molecular docking workflows, computational biosensors and an interest in future healthcare. Academic exploration is distinguished from clinically validated work.',domain:'tech',project:'oculomics',action:'Explore biomedical foundation'},
 {id:'heart',label:'03 // CREATIVE & NON-TECH ROLES: DESIGN LEADERSHIP & STUDIO NAVYA',title:'Create with intent.',text:'Studio Navya, startup leadership, PR, content strategy and event direction. Explore the creative and community work that connects an idea with people.',domain:'creative',action:'Explore Creative, PR & Strategy'}
];
export default function Journey(){
 const [mounted,setMounted]=useState(false);const {enabled,active}=useMotion();useEffect(()=>setMounted(true),[]);
 function explore(chapter,opener){dispatchEvent(new CustomEvent('portfolio:domain',{detail:{domain:chapter.domain,project:chapter.project,opener}}));if(!chapter.project)requestAnimationFrame(()=>requestAnimationFrame(()=>document.getElementById('work')?.scrollIntoView({behavior:'auto',block:'start'})));}
 return <section id="home" className="clean-journey" aria-label="From thought to feeling">
  <div className="clean-hero page-gutter" data-editorial-reveal>
   <p className="eyebrow">NAVYA GUPTA / BIOENGINEERING & CREATIVE STRATEGY</p>
   <h1>The science<br/>of possibility.</h1>
   <p className="clean-deck">Research, technology and the work of bringing people around an idea.</p>
   <a className="text-cta" href="#work">Explore my work <ArrowUpRight size={16}/></a>
   <nav className="clean-chapter-links" aria-label="Explore anatomical chapters"><a href="#brain">Mind</a><a href="#spine">Foundation</a><a href="#heart">Instinct</a></nav>
  </div>
  <div className="clean-chapters page-gutter">{chapters.map(chapter=><article className="clean-chapter" id={chapter.id} key={chapter.id} data-editorial-reveal>
   <p className="eyebrow">{chapter.label}</p><h2>{chapter.title}</h2><p>{chapter.text}</p>
   <button className="text-cta" onClick={event=>explore(chapter,event.currentTarget)}>{chapter.action}<ArrowUpRight size={16}/></button>
  </article>)}</div>
  <section className="anatomy-portal page-gutter" aria-label="Tech Core gateway" data-editorial-reveal data-gateway-state="tech-core-online">
   <p className="eyebrow">04 // POST-HEART SPLIT</p><h2>The gateway is clear.</h2>
   <p className="gateway-reset-note">Three voxel portals condensed. Hover and scroll deeper, or choose an arch to enter Tech Core, Bio Sanctuary or Creative Studio.</p>
  </section>
  {mounted?createPortal(<FullCanvasAnatomy enabled={enabled} active={active}/>,document.body):null}
 </section>;
}
