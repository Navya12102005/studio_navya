import * as THREE from 'three';
// Gateway architecture only. All anatomy still comes from the authored GLB.
export function createSplitPortal(scene){
 const group=new THREE.Group();group.name='dual-domain-gateway';group.position.set(0,-1.7,1.5);scene.add(group);
 const resources=[];
 for(const [side,color] of [[-1,'#00F0FF'],[1,'#FFB703']]){
  const points=[[side*.12,-.85,0],[side*.85,-.6,0],[side*1.15,.1,0],[side*.85,.85,0],[side*.12,1.1,0]].map(p=>new THREE.Vector3(...p));
  const geometry=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),32,.012,5,false);
  const material=new THREE.MeshBasicMaterial({color,transparent:true,opacity:0,depthWrite:false});group.add(new THREE.Mesh(geometry,material));resources.push(geometry,material);
 }
 return{update(p){group.visible=p>.8;for(const child of group.children)child.material.opacity=THREE.MathUtils.smoothstep(p,.8,1)*.8;},dispose(){resources.forEach(r=>r.dispose());scene.remove(group);}};
}
