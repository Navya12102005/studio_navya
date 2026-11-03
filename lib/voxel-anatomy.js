import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const smooth=(value,a,b)=>THREE.MathUtils.smoothstep(value,a,b);
const PARTS={
 head:['Cranium','Brain','BrainLeft','BrainRight'],
 spine:['CervicalSpine','ThoracicSpine'],
 thorax:['Ribcage','CostalCartilage','Sternum','ShoulderGirdle','LungLeft','LungRight'],
 heart:['Heart','VascularNodes']
};

export function createVoxelAnatomy(scene,sculpture,{economy=false}={}){
 const root=new THREE.Group();root.name='voxel-glass-upper-body';scene.add(root);
 const resources=[],materials=[],rigs=[],originalMaterialVisibility=new Map(),dummy=new THREE.Object3D();
 const geometry=new RoundedBoxGeometry(economy ? .13 : .105,economy ? .13 : .105,economy ? .13 : .105,2,.018);resources.push(geometry);
 const palette={head:['#d9eff1','#ff310f'],spine:['#e7d1ad','#ff8a18'],thorax:['#d5e4e5','#c33219'],heart:['#ff7257','#ff1800']};
 const materialFor=key=>{const [color,emissive]=palette[key],value=new THREE.MeshPhysicalMaterial({color,transmission:.9,thickness:.28,ior:1.52,roughness:.07,clearcoat:1,clearcoatRoughness:.06,transparent:true,opacity:.92,emissive,emissiveIntensity:key==='heart'?.52:.16,metalness:0});materials.push(value);return value;};
 sculpture.model.updateMatrixWorld(true);
 for(const [key,names] of Object.entries(PARTS)){
  const targets=[],seen=new Set(),spacing=economy ? .145 : .105;
  for(const name of names){const mesh=sculpture.model.getObjectByName(name);if(!mesh?.isMesh)continue;originalMaterialVisibility.set(mesh.material,mesh.material.visible);mesh.material.visible=false;const attr=mesh.geometry.attributes.position,step=Math.max(1,Math.floor(attr.count/(economy?440:1100)));for(let i=0;i<attr.count;i+=step){const p=new THREE.Vector3(attr.getX(i),attr.getY(i),attr.getZ(i)).applyMatrix4(mesh.matrixWorld),grid=p.clone().divideScalar(spacing).round().multiplyScalar(spacing),id=`${grid.x.toFixed(3)}:${grid.y.toFixed(3)}:${grid.z.toFixed(3)}`;if(!seen.has(id)){seen.add(id);targets.push(grid);}}}
  if(!targets.length)continue;const instanced=new THREE.InstancedMesh(geometry,materialFor(key),targets.length),scatter=targets.map((target,index)=>{const angle=index*2.3999632297,radius=2.4+(index%17)*.08;return target.clone().add(new THREE.Vector3(Math.cos(angle)*radius,((index*7)%29-14)*.18,Math.sin(angle)*radius));});instanced.name=`voxel-${key}`;instanced.frustumCulled=false;root.add(instanced);rigs.push({key,instanced,targets,scatter,last:-1});
 }
 const wireMaterial=new THREE.MeshBasicMaterial({color:'#ff3518',transparent:true,opacity:.72,blending:THREE.AdditiveBlending,depthWrite:false});materials.push(wireMaterial);
 const pathPoints=[sculpture.anchors.brain,sculpture.anchors.spine,sculpture.anchors.heart].map(value=>new THREE.Vector3(...value));
 for(let lane=0;lane<7;lane++){const offset=(lane-3)*.045,points=pathPoints.map((point,index)=>point.clone().add(new THREE.Vector3(offset,0,Math.sin(lane+index)*.08))),tube=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),48,.009+(lane%2)*.004,5,false);resources.push(tube);root.add(new THREE.Mesh(tube,wireMaterial));}
 const heartLight=new THREE.PointLight('#ff2400',10,4.2,2);heartLight.position.set(...sculpture.anchors.heart);root.add(heartLight);
 let orbitX=0,orbitY=0,dragging=false,lastX=0,lastY=0,integrity=0;
 const down=event=>{if(event.button!==undefined&&event.button!==0)return;dragging=true;lastX=event.clientX;lastY=event.clientY;};
 const move=event=>{if(!dragging)return;orbitY+=(event.clientX-lastX)*.004;orbitX=THREE.MathUtils.clamp(orbitX+(event.clientY-lastY)*.003,-.45,.45);lastX=event.clientX;lastY=event.clientY;};
 const up=()=>{dragging=false;};addEventListener('pointerdown',down);addEventListener('pointermove',move);addEventListener('pointerup',up);addEventListener('pointercancel',up);
 return{
  update(time,progress){const assembly=smooth(progress,.005,.115);integrity=assembly;for(const rig of rigs){if(Math.abs(rig.last-assembly)<.001)continue;for(let i=0;i<rig.targets.length;i++){const ease=1-Math.pow(1-assembly,3),snap=Math.min(1,Math.max(0,(assembly-(i%23)*.004)/(1-(i%23)*.004))),position=rig.scatter[i].clone().lerp(rig.targets[i],Math.max(ease,snap));dummy.position.copy(position);const scale=.15+.85*smooth(snap,0,1);dummy.scale.setScalar(scale);dummy.rotation.set((1-snap)*(i%3)*.3,(1-snap)*(i%5)*.25,0);dummy.updateMatrix();rig.instanced.setMatrixAt(i,dummy.matrix);}rig.instanced.instanceMatrix.needsUpdate=true;rig.last=assembly;}
   root.rotation.y=orbitY+Math.sin(time*.13)*.035;root.rotation.x=orbitX;const beat=Math.pow(Math.max(0,Math.sin(time*Math.PI*2*75/60)),10);const heart=rigs.find(rig=>rig.key==='heart');if(heart)heart.instanced.scale.setScalar(1+beat*.035);heartLight.intensity=7+beat*9;wireMaterial.opacity=.42+.3*(.5+.5*Math.sin(time*2.4));
  },
  telemetry(){return{blocks:rigs.reduce((sum,rig)=>sum+rig.targets.length,0),regions:rigs.map(rig=>rig.key),integrity,orbit:[orbitX,orbitY],ior:1.52};},
  dispose(){removeEventListener('pointerdown',down);removeEventListener('pointermove',move);removeEventListener('pointerup',up);removeEventListener('pointercancel',up);originalMaterialVisibility.forEach((visible,value)=>{value.visible=visible;});resources.forEach(value=>value.dispose());materials.forEach(value=>value.dispose());scene.remove(root);}
 };
}
