import * as THREE from 'three';
// Organic volumetric impression from true 3D particles plus a low-opacity
// shader haze. No DOM panels, sphere/orb placeholders or repeating dot grid.
export function createAnatomyNebula(scene,{economy=false}={}){
 const root=new THREE.Group();root.name='anatomy-nebula';scene.add(root);
 const count=economy?360:1000,positions=new Float32Array(count*3),seeds=new Float32Array(count);
 let seed=263;const random=()=>{seed=seed*16807%2147483647;return seed/2147483647;};
 for(let i=0;i<count;i++){positions.set([(random()-.5)*7,random()*7-2.5,(random()-.5)*5],i*3);seeds[i]=random();}
 const cyan=new THREE.Color('#00F0FF'),violet=new THREE.Color('#7B2CBF'),pink=new THREE.Color('#FF007F'),amber=new THREE.Color('#FFB703');
 const uniforms={uTime:{value:0},uPrimary:{value:cyan.clone()},uSecondary:{value:violet.clone()},uPixelRatio:{value:1},uAspect:{value:1}};
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setAttribute('aSeed',new THREE.BufferAttribute(seeds,1));
 const material=new THREE.ShaderMaterial({uniforms,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
  vertexShader:`uniform float uTime;uniform float uPixelRatio;attribute float aSeed;varying float vSeed;void main(){vSeed=aSeed;vec3 p=position;p.x+=sin(p.y*.8+uTime*.09+aSeed*6.)*.16;p.y+=sin(uTime*.08+aSeed*8.)*.12;p.z+=cos(p.x+uTime*.07)*.12;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp((18.+aSeed*32.)/-mv.z,1.,8.)*uPixelRatio;}`,
  fragmentShader:`uniform vec3 uPrimary;uniform vec3 uSecondary;varying float vSeed;void main(){float d=length(gl_PointCoord-.5);float alpha=exp(-d*9.)*.6;gl_FragColor=vec4(mix(uPrimary,uSecondary,vSeed)*1.4,alpha);}`});
 root.add(new THREE.Points(geometry,material));
 const hazeGeometry=new THREE.PlaneGeometry(2,2),hazeMaterial=new THREE.ShaderMaterial({uniforms,transparent:true,depthTest:false,depthWrite:false,
  vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,
  fragmentShader:`varying vec2 vUv;uniform float uTime;uniform float uAspect;uniform vec3 uPrimary;uniform vec3 uSecondary;void main(){vec2 p=vUv-.5;p.x*=uAspect;float flow=sin(p.y*3.+uTime*.05)*.16+sin(p.x*2.1-uTime*.04)*.1;float cloud=exp(-abs(p.x*.8+p.y*.6+flow)*5.);float edge=1.-smoothstep(.25,1.1,length(p));vec3 tint=mix(uPrimary,uSecondary,.5+.5*sin(p.y*2.+flow));gl_FragColor=vec4(tint*.65,cloud*edge*.19);}`});
 const haze=new THREE.Mesh(hazeGeometry,hazeMaterial);haze.frustumCulled=false;haze.renderOrder=-1000;root.add(haze);
 return{count,
  update(time,warmth,pixelRatio,aspect){uniforms.uTime.value=time;uniforms.uPrimary.value.copy(cyan).lerp(pink,warmth);uniforms.uSecondary.value.copy(violet).lerp(amber,warmth);uniforms.uPixelRatio.value=pixelRatio;uniforms.uAspect.value=aspect;},
  palette(){return{primary:uniforms.uPrimary.value.getHexString(),secondary:uniforms.uSecondary.value.getHexString(),particles:count};},
  dispose(){geometry.dispose();material.dispose();hazeGeometry.dispose();hazeMaterial.dispose();scene.remove(root);}
 };
}
