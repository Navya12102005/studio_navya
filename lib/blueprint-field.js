import * as THREE from 'three';
export function createBlueprintField(scene,anchors){
 const root=new THREE.Group();root.name='cyber-blueprint-field';scene.add(root);const resources=[];
 const uniforms={uAspect:{value:1},uSpacing:{value:.085}};
 const gridGeometry=new THREE.PlaneGeometry(2,2),gridMaterial=new THREE.ShaderMaterial({uniforms,transparent:true,depthWrite:false,depthTest:false,
  vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,
  fragmentShader:`varying vec2 vUv;uniform float uAspect;uniform float uSpacing;void main(){vec2 p=(vUv-.5)*vec2(uAspect,1.)/uSpacing;vec2 a=abs(fract(p-.5)-.5)/max(fwidth(p),vec2(.0001));float line=1.-min(min(a.x,a.y),1.);float center=1.-smoothstep(.2,.95,length(vUv-.5));gl_FragColor=vec4(mix(vec3(.65,.78,.8),vec3(0.,.94,1.),center),line*.0065);}`});
 const grid=new THREE.Mesh(gridGeometry,gridMaterial);grid.frustumCulled=false;grid.renderOrder=-2000;root.add(grid);resources.push(gridGeometry,gridMaterial);
 const radar=new THREE.Group();radar.name='cranial-technical-radar';radar.position.set(...anchors.brain);root.add(radar);
 for(const radius of[1.12,1.32,1.5]){
  const points=Array.from({length:96},(_,i)=>new THREE.Vector3(Math.cos(i/96*Math.PI*2)*radius,Math.sin(i/96*Math.PI*2)*radius,0));
  const geometry=new THREE.BufferGeometry().setFromPoints(points),material=new THREE.LineBasicMaterial({color:'#00F0FF',transparent:true,opacity:.2,depthWrite:false});radar.add(new THREE.LineLoop(geometry,material));resources.push(geometry,material);
 }
 const ticks=[];for(let i=0;i<60;i++){const angle=i/60*Math.PI*2,r=i%5===0?1.39:1.44;ticks.push(Math.cos(angle)*r,Math.sin(angle)*r,0,Math.cos(angle)*1.5,Math.sin(angle)*1.5,0);}
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(ticks,3));const material=new THREE.LineBasicMaterial({color:'#d8f5f6',transparent:true,opacity:.16,depthWrite:false});radar.add(new THREE.LineSegments(geometry,material));resources.push(geometry,material);
 return{update(progress,camera,aspect){uniforms.uAspect.value=aspect;radar.visible=progress<.32;radar.quaternion.copy(camera.quaternion);const alpha=1-THREE.MathUtils.smoothstep(progress,.25,.32);radar.children.forEach(node=>node.material.opacity=alpha*.18);},dispose(){resources.forEach(r=>r.dispose());scene.remove(root);}};
}
