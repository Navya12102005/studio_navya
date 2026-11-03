'use client';
import {useEffect,useState} from 'react';
import {useMotion} from './MotionProvider';
import {cardiacPulse} from '../lib/spiral-camera';
function monitor(time,volume){return Array.from({length:72},(_,i)=>{const pulse=cardiacPulse(time-(71-i)/45);const value=volume?(Math.pow(1+.018*Math.sin((time-(71-i)/45)*Math.PI*2*12/60),3)-.93)*5:pulse.flash;return `${i?'L':'M'}${(i/71*180).toFixed(1)},${(31-value*22).toFixed(1)}`;}).join(' ');}
export default function TechnicalTelemetry(){
 const {enabled}=useMotion(),[data,setData]=useState(null);
 useEffect(()=>{const update=event=>setData(event.detail);addEventListener('portfolio:telemetry',update);return()=>removeEventListener('portfolio:telemetry',update);},[]);
 if(!enabled||!data?.online)return null;
 const cranial=data.progress<.32;
 return <aside className="technical-telemetry" aria-label="Live scene telemetry" data-technical-telemetry>
  {['tl','tr','bl','br'].map(corner=><i key={corner} className={`scan-reticle ${corner}`} aria-hidden="true"/>)}
  <div className="telemetry-status"><span>SCENE ONLINE</span><span>ANATOMY...CHECK / {data.meshes} REGIONS</span><small>LOCAL RENDER TELEMETRY</small></div>
  <div className="telemetry-coordinates" data-live-coordinates>{data.camera.map((v,i)=><span key={i}>{'XYZ'[i]} {v.toFixed(2)}</span>)}</div>
  {cranial?<div className="telemetry-about"><span className="telemetry-kicker">01 // BRAIN / TECH</span><p>ABOUT / Technical exploration through Python workflows, prompt systems, generative AI and creative coding.</p></div>:null}
  <div className="telemetry-monitors"><div><span>PULSE / {data.bpm} BPM</span><svg viewBox="0 0 180 36" aria-label="Simulated cardiac waveform"><path d={monitor(data.time,false)} fill="none" stroke="currentColor" strokeWidth="1"/></svg></div><div><span>VOLUME / {data.relativeVolume.toFixed(3)}×</span><svg viewBox="0 0 180 36" aria-label="Modeled relative lung volume"><path d={monitor(data.time,true)} fill="none" stroke="currentColor" strokeWidth="1"/></svg></div><small>SIMULATED ORGAN SIGNALS / NOT MEDICAL DATA</small></div>
 </aside>;
}
