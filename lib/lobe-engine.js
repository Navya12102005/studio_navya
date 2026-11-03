import * as THREE from 'three';
export function createLobeEngine(scene,sculpture,{economy=false}={}){
 const left=sculpture.model.getObjectByName('BrainLeft'),right=sculpture.model.getObjectByName('BrainRight');
 const owned=[],attachments=[],root=new THREE.Group();root.name='exposed-neural-core';root.position.set(...sculpture.anchors.brain);scene.add(root);
 const coreMaterial=new THREE.MeshBasicMaterial({color:'#00F0FF',transparent:true,opacity:0,depthWrite:false,depthTest:false,blending:THREE.AdditiveBlending});owned.push(coreMaterial);
 const coreUniform={value:0};
 for(let i=0;i<5;i++){
  const y=(i-2)*.085,curve=new THREE.CatmullRomCurve3([new THREE.Vector3(-.1,y,0),new THREE.Vector3(0,y+.045,.1),new THREE.Vector3(.1,y,0)]),geometry=new THREE.TubeGeometry(curve,20,.006,4,false);
  // Stretch the artistic core fibers as the actual GLB halves separate.
  const material=coreMaterial.clone();material.onBeforeCompile=shader=>{shader.uniforms.uSeparation=coreUniform;shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nuniform float uSeparation;').replace('#include <begin_vertex>','#include <begin_vertex>\ntransformed.x *= 1.0 + uSeparation * 4.5;');};
  const mesh=new THREE.Mesh(geometry,material);mesh.raycast=()=>{};root.add(mesh);owned.push(geometry,material);
 }
 const lightLeft=new THREE.PointLight('#00F0FF',3,1.7,1.7),lightRight=new THREE.PointLight('#7B2CBF',3,1.7,1.7),lightPink=new THREE.PointLight('#FF007F',1.5,1.3,1.7);
 left.add(lightLeft);right.add(lightRight,lightPink);lightPink.position.set(0,.12,.06);attachments.push(lightLeft,lightRight,lightPink);
 const samples=economy?32:64,count=samples*4,positions=new Float32Array(count*3),parameters=new Float32Array(count),seeds=new Float32Array(count);
 const size=left.geometry.boundingBox?.getSize(new THREE.Vector3())||new THREE.Box3().setFromBufferAttribute(left.geometry.attributes.position).getSize(new THREE.Vector3());
 for(let branch=0;branch<4;branch++){
  const x=(branch-1.5)*size.x*.15,curve=new THREE.CatmullRomCurve3([new THREE.Vector3(0,-size.y*.24,0),new THREE.Vector3(x,size.y*.02,size.z*.18),new THREE.Vector3(x*1.1,size.y*.26,-size.z*.05),new THREE.Vector3(x*.5,size.y*.38,size.z*.12)]);
  for(let j=0;j<samples;j++){const index=branch*samples+j;positions.set(curve.getPoint(j/(samples-1)).toArray(),index*3);parameters[index]=j/(samples-1);seeds[index]=branch*.23;}
 }
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setAttribute('aParameter',new THREE.BufferAttribute(parameters,1));geometry.setAttribute('aSeed',new THREE.BufferAttribute(seeds,1));
 const uniforms={uTime:{value:0},uPixelRatio:{value:1},uVisibility:{value:1}};
 const material=new THREE.ShaderMaterial({uniforms,transparent:true,depthWrite:false,depthTest:false,blending:THREE.AdditiveBlending,
  vertexShader:`uniform float uTime;uniform float uPixelRatio;attribute float aParameter;attribute float aSeed;varying float vSignal;void main(){float gap=fract(uTime*.35+aSeed-aParameter);vSignal=exp(-gap*26.);vec4 view=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*view;gl_PointSize=clamp((8.+vSignal*24.)/max(.3,-view.z),1.,8.)*uPixelRatio;}`,
  fragmentShader:`uniform float uVisibility;varying float vSignal;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(vec3(0.,.94,1.)*(.6+vSignal*1.4),exp(-d*8.)*(.06+vSignal*.85)*uVisibility);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`});
 const sparks=new THREE.Points(geometry,material);sparks.name='left-synaptic-pulse-paths';sparks.raycast=()=>{};left.add(sparks);attachments.push(sparks);owned.push(geometry,material);
 let time=0,separation=0;
 return{
  update(t,split,pixelRatio,brainMorph=1){uniforms.uVisibility.value=brainMorph;time=t;separation=split;uniforms.uTime.value=t;uniforms.uPixelRatio.value=pixelRatio;coreUniform.value=split;root.visible=split>.01;root.children.forEach(node=>node.material.opacity=split*(.2+.08*Math.sin(t*2.5)));lightLeft.intensity=2.8+.5*Math.sin(t*2.5);lightRight.intensity=2.4+.4*Math.cos(t*2.5);lightPink.intensity=1.3+.4*Math.sin(t*1.7);},
  telemetry(){return{time,separation,sparkPaths:4,sparkPoints:count,coreFibers:5,lights:[lightLeft.color.getHexString(),lightRight.color.getHexString(),lightPink.color.getHexString()],copperTraces:true};},
  dispose(){attachments.forEach(node=>node.removeFromParent());owned.forEach(resource=>resource.dispose());scene.remove(root);}
 };
}
