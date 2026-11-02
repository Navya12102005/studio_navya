'use client';
import dynamic from 'next/dynamic';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { useMotion } from './MotionProvider';
import { ArrowUpRight } from './Icons';
const FullCanvasAnatomy=dynamic(()=>import('./FullCanvasAnatomy'),{ssr:false});
const chapters=[
 {id:'brain',label:'01 / BIOENGINEERING & TECHNOLOGY',title:'Think in systems.',text:'Research context, computational workflows and technical builds. Explore how I approach a question, prepare a workflow and interpret its limitations.',domain:'tech',action:'Explore Tech & Bioengineering'},
 {id:'spine',label:'02 / OPERATIONS & COORDINATION',title:'Connect the unexpected.',text:'Planning, communication and coordination across student communities. The structure that connects an idea with the people bringing it to life.',domain:'creative',project:'aws',action:'View operational leadership'},
 {id:'heart',label:'03 / CREATIVE STRATEGY & LEADERSHIP',title:'Create with intent.',text:'Startup Club leadership, independent design and content strategy. Work shaped around a clear purpose and the people it needs to reach.',domain:'creative',action:'Explore Creative, PR & Strategy'}
];
export default function Journey(){
 const [mounted,setMounted]=useState(false);const {enabled,active}=useMotion();useEffect(()=>setMounted(true),[]);
 function explore(chapter,opener){dispatchEvent(new CustomEvent('portfolio:domain',{detail:{domain:chapter.domain,project:chapter.project,opener}}));if(!chapter.project)document.getElementById('work')?.scrollIntoView({behavior:enabled?'smooth':'auto'});}
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
  {mounted?createPortal(<FullCanvasAnatomy enabled={enabled} active={active}/>,document.body):null}
 </section>;
}
