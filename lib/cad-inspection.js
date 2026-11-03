import * as THREE from 'three';
import {createComicInkPass} from './comic-ink';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass.js';
import {OutputPass} from 'three/examples/jsm/postprocessing/OutputPass.js';

export function createCadInspection(scene,camera,renderer,sculpture,{economy=false}={}){
 const root=new THREE.Group();root.name='volumetric-cad-inspection';scene.add(root);const resources=[],points=[],nodes=[];
 const source=sculpture.sourceMeshes.map(name=>sculpture.model.getObjectByName(name));
 const box=new THREE.Box3(),cage=new THREE.Box3Helper(box,'#74c9d3');cage.material.transparent=true;cage.material.opacity=.3;cage.material.depthWrite=false;root.add(cage);resources.push(cage.geometry,cage.material);
 const uniforms={uTime:{value:0},uResolve:{value:0},uPixelRatio:{value:1},uBrainReveal:{value:1}};
 const cloudMaterial=new THREE.ShaderMaterial({uniforms,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
  vertexShader:`uniform float uBrainReveal;attribute float aBrain;uniform float uTime;uniform float uResolve;uniform float uPixelRatio;attribute float aSeed;varying float vLight;void main(){vLight=.12+.35*pow(.5+.5*sin(uTime*.8+aSeed*60.),12.)+uResolve*.35;vLight*=mix(1.,uBrainReveal,aBrain);vec4 view=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*view;gl_PointSize=clamp((5.+aSeed*8.)/max(.3,-view.z),1.,4.)*uPixelRatio;}`,
  fragmentShader:`varying float vLight;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(vec3(.25,.8,1.),exp(-d*8.)*vLight);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`});resources.push(cloudMaterial);
 for(const mesh of source){const attr=mesh.geometry.attributes.position,count=Math.min(attr.count,economy?180:600),positions=new Float32Array(count*3),seeds=new Float32Array(count);for(let i=0;i<count;i++){const n=Math.floor(i/count*attr.count);positions.set([attr.getX(n),attr.getY(n),attr.getZ(n)],i*3);seeds[i]=(i*.61803398875)%1;}const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setAttribute('aSeed',new THREE.BufferAttribute(seeds,1));geometry.setAttribute('aBrain',new THREE.BufferAttribute(new Float32Array(count).fill(mesh.name.startsWith('Brain')?1:0),1));const cloud=new THREE.Points(geometry,cloudMaterial);cloud.name=`cad-points-${mesh.name}`;cloud.raycast=()=>{};mesh.add(cloud);points.push(cloud);resources.push(geometry);}
 const image=document.createElement('canvas');image.width=image.height=32;const context=image.getContext('2d');context.strokeStyle='#ffffff';context.lineWidth=2;context.beginPath();context.arc(16,16,10,0,Math.PI*2);context.stroke();context.fillStyle='#ffffff';context.fillRect(14,14,4,4);const texture=new THREE.CanvasTexture(image);resources.push(texture);
 for(const [id,name,title] of [['cranium','Cranium','CRANIUM'],['cervical','CervicalSpine','CERVICAL SPINE'],['ribcage','Ribcage','THORACIC CAGE'],['heart','Heart','HEART CORE']]){
  const material=new THREE.SpriteMaterial({map:texture,color:'#25b5ff',transparent:true,depthTest:false,depthWrite:false}),marker=new THREE.Sprite(material);marker.scale.setScalar(.075);marker.raycast=()=>{};root.add(marker);resources.push(material);
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(new Float32Array(6),3));const lineMaterial=new THREE.LineBasicMaterial({color:'#47c8ff',transparent:true,opacity:.32,depthWrite:false,depthTest:false}),line=new THREE.Line(geometry,lineMaterial);line.raycast=()=>{};root.add(line);resources.push(geometry,lineMaterial);nodes.push({id,name,title,marker,line,world:new THREE.Vector3(),label:new THREE.Vector3()});
 }
 const composer=new EffectComposer(renderer),renderPass=new RenderPass(scene,camera);
 const scanPass=new ShaderPass({uniforms:{tDiffuse:{value:null},uStrength:{value:0},uTime:{value:0},uResolution:{value:new THREE.Vector2(1,1)}},vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`uniform sampler2D tDiffuse;uniform float uStrength;uniform float uTime;uniform vec2 uResolution;varying vec2 vUv;void main(){float band=step(.7,sin(vUv.y*110.+uTime*4.));float shift=uStrength*band*2.5/uResolution.x;vec2 uv=vUv+vec2(shift,0.);vec4 base=texture2D(tDiffuse,uv);float r=texture2D(tDiffuse,uv+vec2(uStrength*1.7/uResolution.x,0.)).r;float b=texture2D(tDiffuse,uv-vec2(uStrength*1.7/uResolution.x,0.)).b;float sweep=1.-uStrength*.05*step(.65,fract(vUv.y*uResolution.y*.5));gl_FragColor=vec4(vec3(r,base.g,b)*sweep,base.a);}`});
 const comicPass=createComicInkPass(),output=new OutputPass();composer.addPass(renderPass);composer.addPass(comicPass);composer.addPass(scanPass);composer.addPass(output);
 const oldAutoReset=renderer.info.autoReset;renderer.info.autoReset=false;
 const frustum=new THREE.Frustum(),matrix=new THREE.Matrix4(),localBox=new THREE.Box3();let selected='cranium',chapter=0,lastJump=-100,width=0,height=0,ratio=0,drawCalls=0,report={};
 const select=event=>{if(nodes.some(node=>node.id===event.detail))selected=event.detail;};addEventListener('portfolio:inspect',select);
 return{
  update(time,progress,velocity,size,brainMorph=1){uniforms.uBrainReveal.value=brainMorph;
   const dpr=renderer.getPixelRatio();if(width!==size.width||height!==size.height||ratio!==dpr){width=size.width;height=size.height;ratio=dpr;composer.setPixelRatio(dpr);composer.setSize(width,height);scanPass.uniforms.uResolution.value.set(width*dpr,height*dpr);comicPass.uniforms.uResolution.value.set(width*dpr,height*dpr);}
   const next=Math.min(3,Math.floor(progress*4));if(next!==chapter){chapter=next;lastJump=time;}
   const strength=Math.exp(-Math.max(0,time-lastJump)*14)*.7;scanPass.uniforms.uStrength.value=strength;scanPass.uniforms.uTime.value=time;comicPass.uniforms.uTime.value=time;uniforms.uTime.value=time;uniforms.uResolve.value=Math.min(1,Math.abs(velocity)/2200);uniforms.uPixelRatio.value=dpr;
   sculpture.model.updateWorldMatrix(true,true);camera.updateMatrixWorld();box.makeEmpty();source.forEach(mesh=>box.union(localBox.setFromObject(mesh)));cage.updateMatrixWorld(true);
   matrix.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);frustum.setFromProjectionMatrix(matrix);let visibleVertices=0,totalVertices=0;
   for(const mesh of source){totalVertices+=mesh.geometry.attributes.position.count;if(mesh.visible&&mesh.material.opacity>.005&&frustum.intersectsObject(mesh))visibleVertices+=mesh.geometry.attributes.position.count;}
   const right=new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,0),up=new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,1);
   const data=nodes.map((node,index)=>{
    localBox.setFromObject(sculpture.model.getObjectByName(node.name));localBox.getCenter(node.world);if(node.id==='ribcage')node.world.x=localBox.max.x;
    node.marker.position.copy(node.world);node.marker.material.color.set(node.id===selected?'#FFB703':'#25b5ff');
    node.label.copy(node.world).addScaledVector(right,index%2?.65:-.65).addScaledVector(up,.22).add(camera.position.clone().sub(node.world).normalize().multiplyScalar(.5));
    const line=node.line.geometry.attributes.position;line.setXYZ(0,...node.world.toArray());line.setXYZ(1,...node.label.toArray());line.needsUpdate=true;node.line.geometry.computeBoundingSphere();
    const projected=node.world.clone().project(camera),label=node.label.clone().project(camera);label.x=THREE.MathUtils.clamp(label.x,-1+Math.min(.72,280/width),1-Math.min(.72,280/width));label.y=THREE.MathUtils.clamp(label.y,-.92,.92);node.label.copy(label).unproject(camera);line.setXYZ(1,...node.label.toArray());line.needsUpdate=true;node.line.geometry.computeBoundingSphere();const visible=progress<.995&&projected.z>-1&&projected.z<1&&Math.abs(projected.x)<1-36/width&&Math.abs(projected.y)<1-36/height;
    return{id:node.id,title:node.title,world:node.world.toArray(),screen:[(projected.x*.5+.5)*width,(-projected.y*.5+.5)*height],labelScreen:[(label.x*.5+.5)*width,(-label.y*.5+.5)*height],visible};
   });
   report={selected,visibleVertices,totalVertices,drawCalls,pointClouds:points.length,postprocessing:'ShaderPass',glitchStrength:strength,bounds:{min:box.min.toArray(),max:box.max.toArray()},nodes:data};dispatchEvent(new CustomEvent('portfolio:inspection-frame',{detail:report}));
  },
  setComic(data){comicPass.uniforms.uCut.value=data.cut||0;comicPass.uniforms.uRealm.value=data.realm||0;},
  render(){renderer.info.reset();composer.render();drawCalls=renderer.info.render.calls;},
  telemetry(){return report;},
  dispose(){removeEventListener('portfolio:inspect',select);points.forEach(node=>node.removeFromParent());resources.forEach(r=>r.dispose());renderPass.dispose();scanPass.dispose();comicPass.dispose();output.dispose();composer.dispose();renderer.info.autoReset=oldAutoReset;scene.remove(root);}
 };
}
