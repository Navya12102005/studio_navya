import {MathUtils,Vector3} from 'three';
// One complete, monotonic turn. Checkpoints use authored model pivots.
export function spiralPose(progress,anchors,aspect=1){
 const p=MathUtils.clamp(progress,0,1);
 const keys=[
  [0,anchors.brain[1]-.25,5.8,0], [.1,anchors.brain[1],4.8,Math.PI*.28],
  [.25,anchors.brain[1],4.8,Math.PI*2/3], [.375,anchors.spine[1],4,Math.PI],
  [.5,anchors.heart[1],2.8,Math.PI*4/3], [.75,anchors.heart[1],2.8,Math.PI*4/3], [1,-1.7,5.5,Math.PI*2]
 ];
 let i=0;while(i<keys.length-2&&p>keys[i+1][0])i++;
 const a=keys[i],b=keys[i+1],t=MathUtils.smoothstep((p-a[0])/(b[0]-a[0]),0,1);
 const y=MathUtils.lerp(a[1],b[1],t),angle=MathUtils.lerp(a[3],b[3],t);
 const radius=MathUtils.lerp(a[2],b[2],t)*Math.max(1,.72/aspect);
 const depth=MathUtils.smoothstep(p,.25,.5);
 const target=new Vector3(0,y,MathUtils.lerp(anchors.brain[2],anchors.heart[2],depth));
 return{angle,radius,target,position:new Vector3(Math.sin(angle)*radius,y+.15,Math.cos(angle)*radius+target.z)};
}
export function cardiacPulse(time){
 const phase=(time*75/60)%1;
 // Systolic compression, expansion, then the smaller second contraction.
 const peak=(center,width)=>Math.exp(-Math.pow((phase-center)/width,2));
 return{phase,scale:1-.025*peak(.08,.045)+.085*peak(.18,.055)+.035*peak(.36,.065),flash:peak(.18,.055)+.45*peak(.36,.065)};
}
