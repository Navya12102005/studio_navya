'use client';
import {useEffect,useRef,useState} from 'react';
import {useMotion} from './MotionProvider';
const NODES=[['cranium','Cranium'],['cervical','Cervical spine'],['ribcage','Ribcage'],['heart','Heart core']];
export default function CadInspection(){
 const {enabled}=useMotion(),refs=useRef({}),labels=useRef({}),[selected,setSelected]=useState('cranium'),[data,setData]=useState(null);
 useEffect(()=>{const frame=event=>{for(const node of event.detail.nodes){const button=refs.current[node.id],label=labels.current[node.id];if(button){button.style.visibility=node.visible?'visible':'hidden';button.style.transform=`translate3d(${node.screen[0]}px,${node.screen[1]}px,0) translate(-50%,-50%)`;}if(label){label.style.visibility=node.visible?'visible':'hidden';label.style.transform=`translate3d(${node.labelScreen[0]}px,${node.labelScreen[1]}px,0) translate(-50%,-50%)`;label.textContent=`${node.title} / ${node.world.map(v=>v.toFixed(2)).join(' ')}`;}}};const update=event=>setData(event.detail.inspection||null);addEventListener('portfolio:inspection-frame',frame);addEventListener('portfolio:telemetry',update);return()=>{removeEventListener('portfolio:inspection-frame',frame);removeEventListener('portfolio:telemetry',update);};},[]);
 if(!enabled)return null;
 const node=data?.nodes.find(node=>node.id===selected);
 return <aside className="cad-inspection" aria-label="Interactive anatomical inspection" data-cad-inspection>
  {NODES.map(([id,title])=><div key={id}><button ref={el=>refs.current[id]=el} className="cad-node" aria-label={`Inspect ${title.toLowerCase()}`} aria-pressed={selected===id} onClick={()=>{setSelected(id);dispatchEvent(new CustomEvent('portfolio:inspect',{detail:id}));}}/><span ref={el=>labels.current[id]=el} className="cad-node-label" aria-hidden="true"/></div>)}
  {data?<div className="cad-summary"><span>CAD / {node?.title}</span><span data-vertex-count>VISIBLE MESH VERTICES {data.visibleVertices.toLocaleString()} / {data.totalVertices.toLocaleString()}</span><span>FRAME DRAWS {data.drawCalls} / POINT LAYERS {data.pointClouds}</span><small>{node?.visible?'NODE IN VIEW':'SELECTED NODE OUTSIDE VIEW'}</small></div>:null}
 </aside>;
}
