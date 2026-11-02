import * as THREE from 'three';
import { techProjects, creativeProjects } from './projects';

export const BIO_NODE_POSITIONS = [[4,0,-2],[6,1,-7],[3,0,-12],[6,-1,-17]];
export const STUDIO_NODE_POSITIONS = [[20,0,-28],[24,1,-32],[21,-1,-37],[26,.5,-41],[23,1,-46],[27,0,-50]];
export const PROJECT_STOPS = [
  ...techProjects.map((project,i)=>({project,realm:'tech',progress:.39+i*.05,position:BIO_NODE_POSITIONS[i]})),
  ...creativeProjects.map((project,i)=>({project,realm:'creative',progress:.67+i*.05,position:STUDIO_NODE_POSITIONS[i]}))
];
export const FLIGHT_JUMPS = { home:0, brain:.09, spine:.22, heart:.30, tech:.39, creative:.67, contact:.98 };

export function transitionPulse(progress) {
  const t=(progress-.55)/.10;
  return t>0&&t<1 ? Math.sin(t*Math.PI)**2 : 0;
}

export function createFlightRoute(heart=[.2,.1,.6]) {
  const keyframes=[
    [0,[0,.9,9.5],[0,1,0]],
    [.08,[3.8,3.2,2.8],[0,2.8,0]],
    [.16,[0,2.6,-4.5],[0,2.1,0]],
    [.24,[-3.4,.8,1.2],[0,.5,0]],
    [.30,[heart[0],heart[1],heart[2]+.19],heart],
    [.34,[0,.9,7.5],[0,.9,0]],
    [.39,[4,1,4],[4,0,-2]],
    [.44,[6,1.4,-1],[6,1,-7]],
    [.49,[3,.8,-6],[3,0,-12]],
    [.54,[6,.1,-11],[6,-1,-17]],
    [.59,[10,.7,-19],[13,1,-21]],
    [.63,[16,.6,-24],[20,0,-28]],
    [.67,[20,1,-22],[20,0,-28]],
    [.72,[24,1.4,-26],[24,1,-32]],
    [.77,[21,.4,-31],[21,-1,-37]],
    [.82,[26,1.5,-35],[26,.5,-41]],
    [.87,[23,2,-40],[23,1,-46]],
    [.92,[27,.8,-44],[27,0,-50]],
    [.98,[27,1.5,-48],[27,1,-54]],
    [1,[27,1.8,-48],[27,1,-54]]
  ];
  const cameraCurve=new THREE.CatmullRomCurve3(keyframes.map(k=>new THREE.Vector3(...k[1])),false,'centripetal');
  const focusCurve=new THREE.CatmullRomCurve3(keyframes.map(k=>new THREE.Vector3(...k[2])),false,'centripetal');
  const position=new THREE.Vector3(),target=new THREE.Vector3();
  function parameter(progress){
    const p=THREE.MathUtils.clamp(progress,0,1);
    let i=keyframes.findIndex((k,index)=>index<keyframes.length-1&&p<=keyframes[index+1][0]);if(i<0)i=keyframes.length-2;
    const t=(p-keyframes[i][0])/(keyframes[i+1][0]-keyframes[i][0]);
    return (i+t)/(keyframes.length-1);
  }
  return {
    cameraCurve,focusCurve,keyframes,
    sample(progress,mobile=false){
      const t=parameter(progress);cameraCurve.getPoint(t,position);focusCurve.getPoint(t,target);
      // Increase viewing distance on narrow displays while retaining the same
      // world coordinates; the cardiac dive itself stays close to the model.
      if(mobile&&!(progress>.275&&progress<.325))position.sub(target).multiplyScalar(1.9).add(target);
      const warmth=THREE.MathUtils.smoothstep(progress,.55,.67);
      return{position:position.toArray(),target:target.toArray(),parameter:t,warmth,jump:transitionPulse(progress),zone:progress<.56?'bio-tech':progress<.65?'portal':'creative-studio'};
    }
  };
}
