import * as THREE from 'three';
const ramp=(p,a,b)=>THREE.MathUtils.smoothstep(p,a,b);
export function surgicalState(progress){
 const p=THREE.MathUtils.clamp(progress,0,1);
 return{progress:p,cut:ramp(p,.075,.14),separation:ramp(p,.12,.24),laser:ramp(p,.065,.085)*(1-ramp(p,.14,.175)),blade:ramp(p,.51,.595),impact:ramp(p,.595,.615),burst:ramp(p,.605,.735),creativeMix:ramp(p,.60,.75)};
}
export function createSurgicalNarrative(scene,sculpture,{economy=false}={}){
 const root=new THREE.Group();root.name='surgical-domain-narrative';scene.add(root);
 const resources=[],{anchors,heart}=sculpture;
 // A razor-thin sagittal light sheet sweeps the existing, pre-split GLB nodes.
 const laserGeometry=new THREE.PlaneGeometry(1.4,1.65),laserMaterial=new THREE.MeshBasicMaterial({color:'#00F0FF',transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending});
 const laser=new THREE.Mesh(laserGeometry,laserMaterial);laser.position.set(...anchors.brain);laser.rotation.y=Math.PI/2;root.add(laser);resources.push(laserGeometry,laserMaterial);
 // Abstract energy dagger, no blood, wound texture or replacement anatomy.
 const dagger=new THREE.Group();dagger.name='creative-energy-dagger';dagger.visible=false;dagger.position.set(...anchors.heart);root.add(dagger);
 const bladeGeometry=new THREE.ConeGeometry(.055,.75,4),bladeMaterial=new THREE.MeshBasicMaterial({color:'#FF007F',transparent:true,opacity:.85});
 const blade=new THREE.Mesh(bladeGeometry,bladeMaterial);blade.rotation.z=Math.PI;blade.position.y=.35;dagger.add(blade);resources.push(bladeGeometry,bladeMaterial);
 const hiltGeometry=new THREE.BoxGeometry(.23,.035,.035),hiltMaterial=new THREE.MeshBasicMaterial({color:'#FFB703',transparent:true,opacity:1});
 const hilt=new THREE.Mesh(hiltGeometry,hiltMaterial);hilt.position.y=.72;dagger.add(hilt);resources.push(hiltGeometry,hiltMaterial);
 const count=economy?700:1600,positions=new Float32Array(count*3),velocities=new Float32Array(count*3),seeds=new Float32Array(count);
 const vertices=heart.geometry.attributes.position;
 // Shattering particles start on actual authored heart vertices.
 for(let i=0;i<count;i++){
  const n=Math.floor(i/count*vertices.count),seed=(i*.61803398875)%1;
  positions.set([vertices.getX(n),vertices.getY(n),vertices.getZ(n)],i*3);
  const angle=i*2.3999632297,y=1-2*(i+.5)/count,r=Math.sqrt(1-y*y);
  velocities.set([Math.cos(angle)*r,y,Math.sin(angle)*r],i*3);seeds[i]=seed;
 }
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setAttribute('aVelocity',new THREE.BufferAttribute(velocities,3));geometry.setAttribute('aSeed',new THREE.BufferAttribute(seeds,1));
 const uniforms={uBurst:{value:0},uPixelRatio:{value:1}};
 const material=new THREE.ShaderMaterial({uniforms,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
  vertexShader:`uniform float uBurst;uniform float uPixelRatio;attribute vec3 aVelocity;attribute float aSeed;varying float vSeed;varying float vAlpha;void main(){vSeed=aSeed;vec3 p=position+aVelocity*uBurst*(1.3+aSeed*1.8);p.y-=uBurst*uBurst*.25;vec4 view=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*view;gl_PointSize=clamp((24.+aSeed*40.)/max(.3,-view.z),1.,14.)*uPixelRatio;vAlpha=smoothstep(0.,.08,uBurst)*(1.-uBurst*.35);}`,
  fragmentShader:`varying float vSeed;varying float vAlpha;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;vec3 color=mix(vec3(1.,0.,.498),vec3(1.,.718,.012),vSeed);gl_FragColor=vec4(color*2.2,exp(-d*6.)*vAlpha);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`});
 const burst=new THREE.Points(geometry,material);burst.name='authored-heart-light-fragments';burst.visible=false;burst.position.copy(heart.position);burst.frustumCulled=false;root.add(burst);resources.push(geometry,material);
 const flash=new THREE.PointLight('#FF007F',0,5,1.6);flash.position.set(...anchors.heart);root.add(flash);
 let state=surgicalState(0);
 return{
  update(progress,time,pixelRatio){
   state=surgicalState(progress);flash.intensity=30*state.impact*(1-state.burst);sculpture.applyNarrative(state,time);
   laser.visible=state.laser>.001;laserMaterial.opacity=state.laser*.9;laser.position.z=anchors.brain[2]+THREE.MathUtils.lerp(-.7,.7,state.cut);
   dagger.visible=progress>=.50&&state.burst<.98;dagger.position.y=anchors.heart[1]+THREE.MathUtils.lerp(1.15,-.1,state.blade);bladeMaterial.opacity=.85*(1-state.burst);hiltMaterial.opacity=1-state.burst;
   burst.visible=state.burst>0;uniforms.uBurst.value=state.burst;uniforms.uPixelRatio.value=pixelRatio;
   return state;
  },
  telemetry(){return{...state,heartVisible:heart.visible,hemispherePositions:['BrainLeft','BrainRight'].map(name=>sculpture.model.getObjectByName(name).position.toArray()),daggerY:dagger.position.y,fragmentCount:count};},
  dispose(){resources.forEach(resource=>resource.dispose());scene.remove(root);}
 };
}
