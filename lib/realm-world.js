import * as THREE from 'three';

// Spatial installations, separate from the authored anatomical GLB.
export function createRealmWorld(scene,{worldMode=false}={}){
 const root=new THREE.Group(),tech=new THREE.Group(),creative=new THREE.Group();root.name='dual-realm-world';root.add(tech,creative);scene.add(root);
 const materials=[],geometries=[];const keep=m=>(materials.push(m),m),geo=g=>(geometries.push(g),g);
 const transform=new THREE.Object3D();
 const dnaMaterial=keep(new THREE.MeshStandardMaterial({color:'#8fa5a3',roughness:.5,metalness:.32,emissive:'#263331',emissiveIntensity:.18}));
 const steps=44,dna=new THREE.InstancedMesh(geo(new THREE.BoxGeometry(.08,.08,.08)),dnaMaterial,steps*4);dna.name='voxel-dna-double-helix';
 for(let i=0;i<steps;i++)for(let strand=0;strand<2;strand++){
  const angle=i/steps*Math.PI*5+strand*Math.PI,y=i/(steps-1)*3.5-1.75;
  transform.position.set(Math.cos(angle)*.65,y,Math.sin(angle)*.65);transform.rotation.set(0,angle,0);transform.scale.setScalar(1);transform.updateMatrix();dna.setMatrixAt(i*4+strand,transform.matrix);
  transform.position.set(Math.cos(angle)*.25,y,Math.sin(angle)*.25);transform.rotation.set(0,-angle+Math.PI/2,0);transform.scale.set(.5,.4,5);transform.updateMatrix();dna.setMatrixAt(i*4+2+strand,transform.matrix);
 }tech.add(dna);
 // A folded metal installation, with no glass orb, vinyl disc or stickers.
 const installation=new THREE.Group();installation.name='folded-studio-installation';creative.add(installation);
 const clay=keep(new THREE.MeshStandardMaterial({color:'#ae967c',metalness:.52,roughness:.42}));
 const slab=geo(new THREE.BoxGeometry(.045,2.6,1.5));
 for(let i=0;i<3;i++){const panel=new THREE.Mesh(slab,clay);panel.rotation.y=i*Math.PI/3;panel.position.x=(i-1)*.24;installation.add(panel);}
 const key=new THREE.PointLight('#b9a48a',24,16,2);key.position.set(2,3,5);creative.add(key);
 const fill=new THREE.PointLight('#97b0ac',18,16,2);fill.position.set(-2,2,4);tech.add(fill);
 let clicks=0;
 return{root,tech,creative,
  burst(){clicks++;},
  update(time,delta,{opacity=1}){root.visible=opacity>.001;dna.rotation.y=Math.sin(time*.08)*.15;installation.rotation.y=Math.sin(time*.055)*.08;},
  diagnostics(){return{interactions:clicks,installations:2};},
  dispose(){geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());scene.remove(root);}
 };
}

export function createAmbientField(){
 const scene=new THREE.Scene(),camera=new THREE.Camera();
 const material=new THREE.ShaderMaterial({depthWrite:false,depthTest:false,uniforms:{uWarmth:{value:0}},
  vertexShader:'void main(){gl_Position=vec4(position.xy,0.,1.);}',
  fragmentShader:'uniform float uWarmth;void main(){gl_FragColor=vec4(mix(vec3(.007,.009,.009),vec3(.011,.009,.007),uWarmth),1.);}'});
 const geometry=new THREE.PlaneGeometry(2,2);scene.add(new THREE.Mesh(geometry,material));
 return{scene,camera,update(time,warmth){material.uniforms.uWarmth.value=warmth;},dispose(){geometry.dispose();material.dispose();}};
}
