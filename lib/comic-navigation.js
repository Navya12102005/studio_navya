import * as THREE from 'three';
export function realmCameraPoint(origin,aspect){return origin.clone().add(new THREE.Vector3(2.8,2.9,Math.max(9,3.2/(Math.tan(THREE.MathUtils.degToRad(19))*aspect))));}
export function frameFlight(from,frameCenter,target,aspect=1){
 const end=target.clone().add(new THREE.Vector3(.45,.25,Math.max(3.4,1.3/aspect)));
 return new THREE.CatmullRomCurve3([from.clone(),frameCenter.clone().add(new THREE.Vector3(0,0,2.6)),end]);
}
export function orbitPose(yaw,pitch,zoom,aspect){
 const elevation=THREE.MathUtils.clamp(pitch,-.65,.65),radius=Math.max(9.3,3/(2*Math.tan(THREE.MathUtils.degToRad(19))*aspect))*THREE.MathUtils.clamp(zoom,.8,1.8);
 return new THREE.Vector3(Math.sin(yaw)*Math.cos(elevation)*radius,1+Math.sin(elevation)*radius,Math.cos(yaw)*Math.cos(elevation)*radius);
}
export function vortexPlacement(curve,t,index){
 const position=curve.getPointAt(t),tangent=curve.getTangentAt(t),right=new THREE.Vector3().crossVectors(tangent,new THREE.Vector3(0,1,0)).normalize();
 if(right.lengthSq()<.01)right.set(1,0,0);const up=new THREE.Vector3().crossVectors(right,tangent).normalize(),angle=index*2.39996323,radius=1.5+Math.sin(t*Math.PI)*1.1;
 return position.addScaledVector(right,Math.cos(angle)*radius).addScaledVector(up,Math.sin(angle)*radius);
}
