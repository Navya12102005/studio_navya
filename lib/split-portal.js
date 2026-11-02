import * as THREE from 'three';
// Gateway architecture only. All anatomy still comes from the authored GLB.
export function createSplitPortal(scene,anchors){
 const group=new THREE.Group();group.name='dual-domain-gateway';group.position.set(0,-1.7,1.5);scene.add(group);
 const resources=[];
 for(const [side,color] of [[-1,'#00F0FF'],[1,'#FFB703']]){
  const points=[[side*.12,-.85,0],[side*.85,-.6,0],[side*1.15,.1,0],[side*.85,.85,0],[side*.12,1.1,0]].map(p=>new THREE.Vector3(...p));
  const geometry=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),32,.012,5,false);
  const material=new THREE.MeshBasicMaterial({color,transparent:true,opacity:0,depthWrite:false});group.add(new THREE.Mesh(geometry,material));resources.push(geometry,material);
 }
 return{update(p,camera){
  group.visible=p>.72;const exit=THREE.MathUtils.smoothstep(p,.78,1);
  group.position.set(0,THREE.MathUtils.lerp(anchors.heart[1],-1.7,exit),THREE.MathUtils.lerp(anchors.heart[2],1.5,exit));
  if(camera)group.quaternion.copy(camera.quaternion);
  for(const child of group.children)child.material.opacity=THREE.MathUtils.smoothstep(p,.72,.74)*.8;
 },telemetry(){return{visible:group.visible,position:group.position.toArray()};},dispose(){resources.forEach(r=>r.dispose());scene.remove(group);}};
}
