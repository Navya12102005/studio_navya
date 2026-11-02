'use client';
import {useEffect} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {useMotion} from './MotionProvider';
export default function EditorialMotion(){
 const {enabled,paused}=useMotion();
 useEffect(()=>{
  if(!enabled||paused)return;gsap.registerPlugin(ScrollTrigger);let context,frame;
  function build(){context?.revert();context=gsap.context(()=>{
   for(const element of document.querySelectorAll('main [data-editorial-reveal],main .spatial-project,main .domain-intro,main .about-copy,main .contact-heading')){
    const bounds=element.getBoundingClientRect(),visible=bounds.top<innerHeight*.88&&bounds.bottom>0;
    const timeline=gsap.timeline({scrollTrigger:{trigger:element,start:'top 90%',end:'bottom 10%',scrub:.65,invalidateOnRefresh:true}});
    timeline.fromTo(element,{opacity:visible?1:.3,filter:visible?'blur(0px)':'blur(3px)'},{opacity:1,filter:'blur(0px)',duration:.3,ease:'none'})
     .to(element,{opacity:1,filter:'blur(0px)',duration:.4,ease:'none'})
     .to(element,{opacity:.3,filter:'blur(3px)',duration:.3,ease:'none'});
   }
  });ScrollTrigger.refresh();}
  frame=requestAnimationFrame(build);const rebuild=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(build);};addEventListener('portfolio:realm',rebuild);
  return()=>{cancelAnimationFrame(frame);removeEventListener('portfolio:realm',rebuild);context?.revert();};
 },[enabled,paused]);return null;
}
