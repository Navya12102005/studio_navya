import {MathUtils,Vector3} from 'three';
// One complete, monotonic turn. Checkpoints use authored model pivots.
export function spiralPose(progress,anchors,aspect=1){
 const p=MathUtils.clamp(progress,0,1),segment=Math.min(2,Math.floor(p*3)),t=MathUtils.smoothstep(p*3-segment,0,1);
 const heights=[anchors.brain[1],anchors.spine[1],anchors.heart[1],-1.7];
 const radii=[5.8,4.6,2.8,5.5];
 const angle=p*Math.PI*2, y=MathUtils.lerp(heights[segment],heights[segment+1],t);
 const radius=MathUtils.lerp(radii[segment],radii[segment+1],t)*Math.max(1, .72/aspect);
 const target=new Vector3(0,y,MathUtils.lerp(anchors.brain[2],anchors.heart[2],p));
 return{angle,radius,target,position:new Vector3(Math.sin(angle)*radius,y+.15,Math.cos(angle)*radius+target.z)};
}
export function cardiacPulse(time){
 const phase=(time*75/60)%1;
 // Systolic compression, expansion, then the smaller second contraction.
 const peak=(center,width)=>Math.exp(-Math.pow((phase-center)/width,2));
 return{phase,scale:1-.025*peak(.08,.045)+.085*peak(.18,.055)+.035*peak(.36,.065),flash:peak(.18,.055)+.45*peak(.36,.065)};
}
