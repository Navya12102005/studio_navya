import * as THREE from 'three';
import {spiralPose,cardiacPulse} from './spiral-camera';

// Bounded, frame-rate-independent response to pixels/second, not wheel events.
export function acousticResponse(velocity){
 const drive=THREE.MathUtils.clamp(Math.abs(Number.isFinite(velocity)?velocity:0)/2400,0,1);
 return{drive,frequency:12+drive*24,speed:1.8+drive*6.2,intensity:.32+drive*.5};
}
const shellVertex=`
 uniform float uPhase; uniform float uFrequency; uniform float uDrive;
 varying vec3 vDirection; varying vec3 vNormalView; varying vec3 vView;
 void main(){
  vec3 direction=normalize(position);float distanceFromPole=distance(direction,vec3(0.,1.,0.));
  float wave=sin(distanceFromPole*uFrequency-uPhase);
  vec3 p=position+normal*wave*(.006+uDrive*.014);
  vec4 view=modelViewMatrix*vec4(p,1.);
  vDirection=direction;vNormalView=normalize(normalMatrix*normal);vView=-view.xyz;
  gl_Position=projectionMatrix*view;
 }`;
const shellFragment=`
 uniform float uPhase;uniform float uFrequency;uniform float uIntensity;uniform float uBeat;
 varying vec3 vDirection;varying vec3 vNormalView;varying vec3 vView;
 float ring(float phase){float wave=.5+.5*sin(phase);return pow(wave,40.);}
 void main(){
  float facing=abs(dot(normalize(vNormalView),normalize(vView)));
  float aperture=smoothstep(.18,.48,sqrt(max(0.,1.-facing*facing)));
  float waveDistance=distance(normalize(vDirection),vec3(0.,1.,0.));
  float phase=waveDistance*uFrequency-uPhase;
  // Offset the ring phases to separate the cyan/violet/amber spectral edges.
  vec3 cyan=vec3(0.,.94,1.),violet=vec3(.482,.172,.75),amber=vec3(1.,.718,.012);
  vec3 fringe=cyan*ring(phase-.55)+violet*ring(phase)+amber*ring(phase+.55);
  float edge=pow(1.-facing,2.);
  float brightness=max(max(fringe.r,fringe.g),fringe.b);
  float alpha=aperture*clamp((brightness*.42+edge*.16)*uIntensity*(1.+uBeat*.35),0.,.62);
  if(alpha<.004)discard;
  gl_FragColor=vec4(fringe*(1.1+edge*.8),alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
 }`;
const vortexVertex=`
 uniform float uPhase;uniform float uDrive;uniform float uPixelRatio;
 attribute float aSeed;varying float vSeed;
 void main(){
  vSeed=aSeed;float angle=uPhase*.24+aSeed*31.;
  float radius=.08+position.x*(.6+.08*sin(uPhase*.3+aSeed*9.));
  vec3 p=vec3(cos(angle)*radius,position.y*.5+sin(angle*1.7)*.045,sin(angle)*radius);
  vec4 view=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*view;
  gl_PointSize=clamp((8.+aSeed*10.+uDrive*5.)/max(.3,-view.z),1.,5.)*uPixelRatio;
 }`;
const vortexFragment=`
 varying float vSeed;uniform float uIntensity;
 void main(){float d=length(gl_PointCoord-.5);float glow=exp(-d*10.);if(d>.5)discard;
 vec3 color=mix(vec3(0.,.94,1.),vec3(1.,.718,.012),vSeed);
 gl_FragColor=vec4(color,glow*(.35+uIntensity*.35));
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
 }`;

export function createAcousticField(scene,anchors,{economy=false}={}){
 const root=new THREE.Group();root.name='cymatics-acoustic-field';scene.add(root);
 const resources=[],nodes=[],spheres=[];
 const uniforms={uPhase:{value:0},uFrequency:{value:12},uDrive:{value:0},uIntensity:{value:.32},uBeat:{value:0},uPixelRatio:{value:1}};
 const sphereGeometry=new THREE.SphereGeometry(1,economy?32:64,economy?20:40);resources.push(sphereGeometry);
 for(const [name,position,radius] of [['brain',anchors.brain,.95],['heart',anchors.heart,.48]]){
  const group=new THREE.Group();group.name=`acoustic-${name}`;group.position.set(...position);root.add(group);nodes.push(group);
  for(const scale of [1,1.12]){
   const material=new THREE.ShaderMaterial({uniforms,vertexShader:shellVertex,fragmentShader:shellFragment,transparent:true,depthWrite:false,side:THREE.FrontSide,blending:THREE.AdditiveBlending});
   const shell=new THREE.Mesh(sphereGeometry,material);shell.name=`${name}-acoustic-shell`;shell.scale.setScalar(radius*scale);shell.rotation.z=scale===1?.18:-.22;group.add(shell);spheres.push(shell);resources.push(material);
  }
  const count=economy?100:220,positions=new Float32Array(count*3),seeds=new Float32Array(count);
  for(let i=0;i<count;i++){const seed=(i*.61803398875)%1;positions.set([seed,(i/count-.5)*1.4,0],i*3);seeds[i]=seed;}
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setAttribute('aSeed',new THREE.BufferAttribute(seeds,1));
  const material=new THREE.ShaderMaterial({uniforms,vertexShader:vortexVertex,fragmentShader:vortexFragment,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
  const vortex=new THREE.Points(geometry,material);vortex.name=`${name}-acoustic-vortex`;vortex.scale.setScalar(radius);group.add(vortex);resources.push(geometry,material);
 }
 // Four acoustic apertures lie directly on the spinal camera flight path.
 const corridor=new THREE.Group();corridor.name='spinal-acoustic-corridor';corridor.visible=false;root.add(corridor);
 const ringGeometry=new THREE.TorusGeometry(.55,.014,5,64);
 const corridorUniforms={...uniforms,uCorridorFade:{value:0}};
 const ringMaterial=new THREE.ShaderMaterial({uniforms:corridorUniforms,vertexShader:shellVertex,fragmentShader:'uniform float uCorridorFade;\n'+shellFragment.replace('float alpha=aperture*','float alpha=uCorridorFade*aperture*'),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
 for(const q of [.29,.35,.41,.47]){const ring=new THREE.Mesh(ringGeometry,ringMaterial);ring.userData.pathProgress=q;corridor.add(ring);}
 resources.push(ringGeometry,ringMaterial);
 let drive=0,phase=0,currentTime=0,lastAspect=0;

 return{
  update(time,delta,velocity,pixelRatio,progress=0,aspect=1){
   currentTime=time;const dt=Math.min(Math.max(delta,0),.1),target=acousticResponse(velocity);
   drive=THREE.MathUtils.damp(drive,target.drive,5,dt);const response=acousticResponse(drive*2400),beat=cardiacPulse(time).flash;
   // Integrate speed: changing velocity must not jump the wave's phase.
   phase+=dt*response.speed;uniforms.uPhase.value=phase;
   uniforms.uDrive.value=drive;uniforms.uFrequency.value=response.frequency;
   uniforms.uIntensity.value=response.intensity;uniforms.uBeat.value=beat;uniforms.uPixelRatio.value=pixelRatio;
   nodes.forEach(group=>group.scale.setScalar(1+beat*.025));
   corridorUniforms.uCorridorFade.value=THREE.MathUtils.smoothstep(progress,.24,.27)*(1-THREE.MathUtils.smoothstep(progress,.49,.52));corridor.visible=corridorUniforms.uCorridorFade.value>.001;
   if(aspect!==lastAspect){lastAspect=aspect;for(const ring of corridor.children){const q=ring.userData.pathProgress,pose=spiralPose(q,anchors,aspect),ahead=spiralPose(q+.001,anchors,aspect).position;ring.position.copy(pose.position);ring.lookAt(ahead);}}

  },
  telemetry(){return{spinalRings:corridor.children.length,corridorVisible:corridor.visible,time:currentTime,phase,drive,frequency:uniforms.uFrequency.value,speed:acousticResponse(drive*2400).speed,intensity:uniforms.uIntensity.value,shells:spheres.length,vortices:nodes.length,anchors:nodes.map(n=>({name:n.name,position:n.position.toArray()})),particlesPerVortex:economy?100:220};},
  dispose(){resources.forEach(resource=>resource.dispose());scene.remove(root);}
 };
}
