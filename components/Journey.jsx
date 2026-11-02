'use client';
import dynamic from 'next/dynamic';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { useMotion } from './MotionProvider';
import { ArrowUpRight } from './Icons';
const FullCanvasAnatomy=dynamic(()=>import('./FullCanvasAnatomy'),{ssr:false});
const chapters=[
 {id:'brain',label:'01 // NEURAL CORE: BIOENGINEERING & SYSTEM ARCHITECTURE',title:'Think in systems.',text:'Areas of interest: molecular docking, computational biosensors and clinical diagnostics. Technical exploration spans prompt engineering, vibe coding, Python data pipelines, Java and generative AI workflows.',domain:'tech',action:'Explore Tech & Bioengineering'},
 {id:'spine',label:'02 // BACKBONE: AWS & DATA PIPELINES',title:'Connect the unexpected.',text:'Planning, communication and coordination across student communities. The structure that connects an idea with the people bringing it to life.',domain:'creative',project:'aws',action:'View operational leadership'},
 {id:'heart',label:'03 // CREATIVE ENGINE: BRAND STRATEGY & STARTUP LEADERSHIP',title:'Create with intent.',text:'Startup Club leadership, independent design and content strategy. Work shaped around a clear purpose and the people it needs to reach.',domain:'creative',action:'Explore Creative, PR & Strategy'}
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
   <nav className="clean-chapter-links" aria-label="Explore anatomical chapters"><a href="#brain">Mind</a><a href="#spine">Connection</a><a href="#heart">Instinct</a></nav>
  </div>
  <div className="clean-chapters page-gutter">{chapters.map(chapter=><article className="clean-chapter" id={chapter.id} key={chapter.id} data-editorial-reveal>
   <p className="eyebrow">{chapter.label}</p><h2>{chapter.title}</h2><p>{chapter.text}</p>
   <button className="text-cta" onClick={event=>explore(chapter,event.currentTarget)}>{chapter.action}<ArrowUpRight size={16}/></button>
  </article>)}</div>
  <section className="anatomy-portal page-gutter" aria-label="Choose your next world" data-editorial-reveal>
   <p className="eyebrow">04 // WORLD TRANSITION</p><h2>One mind. Two worlds.</h2>
   <div className="anatomy-portal-choices"><button className="text-cta" onClick={event=>explore({domain:'tech'},event.currentTarget)}>Enter Tech Lab</button><button className="text-cta" onClick={event=>explore({domain:'creative'},event.currentTarget)}>Enter Creative Studio</button></div>
  </section>
  {mounted?createPortal(<FullCanvasAnatomy enabled={enabled} active={active}/>,document.body):null}
 </section>;
}
