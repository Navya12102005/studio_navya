import * as THREE from 'three';
import { PROJECT_STOPS } from './flight-path';

export function createFlightInstallations(scene,route){
 const root=new THREE.Group();root.name='world-installations';scene.add(root);
 const nodeGeometry=new THREE.BoxGeometry(.11,.11,.11),nodeMaterial=new THREE.MeshStandardMaterial({color:'#9faeaa',roughness:.55,metalness:.3}),nodes=[];
 for(const {project,position} of PROJECT_STOPS){const node=new THREE.Mesh(nodeGeometry,nodeMaterial);node.position.set(position[0]+1.95,position[1]+.3,position[2]-.25);node.name=`project-node:${project.id}`;root.add(node);nodes.push(node);}
 const portalPosition=new THREE.Vector3(...route.sample(.605).position),portal=new THREE.Group();portal.position.copy(portalPosition);portal.name='spatial-world-portal';root.add(portal);
 const tangent=route.cameraCurve.getTangent(route.sample(.605).parameter);portal.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),tangent.normalize());
 const stone=new THREE.MeshStandardMaterial({color:'#8b9288',roughness:.68,metalness:.08}),postGeometry=new THREE.BoxGeometry(.13,4.1,.24),lintelGeometry=new THREE.BoxGeometry(3.2,.13,.24);
 for(const side of [-1,1]){const post=new THREE.Mesh(postGeometry,stone);post.position.x=side*1.55;portal.add(post);}const lintel=new THREE.Mesh(lintelGeometry,stone);lintel.position.y=2;portal.add(lintel);
 const light=new THREE.PointLight('#bca98a',12,9,2);light.position.set(0,1,1.5);portal.add(light);
 return{root,portalPosition,update(time,jump){light.intensity=12+jump*3;},dispose(){[nodeGeometry,postGeometry,lintelGeometry].forEach(g=>g.dispose());[nodeMaterial,stone].forEach(m=>m.dispose());scene.remove(root);}};
}
