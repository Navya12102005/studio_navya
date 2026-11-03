import * as THREE from 'three';
import {CRYSTAL_OPTICS} from './crystal-optics';
import {cardiacPulse} from './spiral-camera';

// Decorative surface dust and botanical artwork. Anatomy remains authored GLB.
export function createCrystalArt(scene,sculpture,{economy=false}={}){
 const root=new THREE.Group();root.name='thoracic-glass-botanicals';scene.add(root);
 const resources=new Set(),dustNodes=[],uniforms={uTime:{value:0},uPixelRatio:{value:1},uNeuralReveal:{value:1}};
 const dustMaterial=new THREE.ShaderMaterial({uniforms,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
  vertexShader:`uniform float uTime;uniform float uPixelRatio;attribute float aSeed;attribute vec3 aSurfaceNormal;attribute float aNeural;varying float vSeed;varying float vGlint;varying float vNeural;void main(){vSeed=aSeed;vNeural=aNeural;vGlint=pow(.5+.5*sin(uTime*1.7+aSeed*80.),24.);vec3 p=position+aSurfaceNormal*(.006+.003*sin(uTime+aSeed*20.));vec4 view=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*view;gl_PointSize=clamp((7.+aSeed*14.)*(1.+vGlint*.6)/max(.3,-view.z),1.,6.)*uPixelRatio;}`,
  fragmentShader:`uniform float uNeuralReveal;varying float vSeed;varying float vGlint;varying float vNeural;void main(){vec2 p=gl_PointCoord-.5;float diamond=abs(p.x)+abs(p.y);if(diamond>.5)discard;float core=exp(-dot(p,p)*24.);vec3 cyan=vec3(0.,.94,1.),amber=vec3(1.,.718,.012),violet=vec3(.482,.172,.75);vec3 color=mix(amber,mix(cyan,violet,vSeed),vNeural);vec3 fringe=vec3(exp(-length(p-vec2(.09,0.))*10.),exp(-length(p)*10.),exp(-length(p+vec2(.09,0.))*10.));gl_FragColor=vec4(color*core+fringe*vGlint*.65,(.06+vGlint*.85)*(1.-diamond*2.)*mix(1.,uNeuralReveal,vNeural));
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`});resources.add(dustMaterial);
 for(const name of ['CervicalSpine','ThoracicSpine','BrainLeft','BrainRight','VascularNodes']){
  const mesh=sculpture.model.getObjectByName(name),vertices=mesh.geometry.attributes.position,normals=mesh.geometry.attributes.normal,neural=name.startsWith('Brain');
  const count=neural?(economy?140:400):(economy?80:200),positions=new Float32Array(count*3),surfaceNormals=new Float32Array(count*3),seeds=new Float32Array(count),kinds=new Float32Array(count);
  for(let i=0;i<count;i++){const n=Math.floor(i/count*vertices.count);positions.set([vertices.getX(n),vertices.getY(n),vertices.getZ(n)],i*3);surfaceNormals.set([normals.getX(n),normals.getY(n),normals.getZ(n)],i*3);seeds[i]=(i*.61803398875)%1;kinds[i]=neural?1:0;}
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setAttribute('aSurfaceNormal',new THREE.BufferAttribute(surfaceNormals,3));geometry.setAttribute('aSeed',new THREE.BufferAttribute(seeds,1));geometry.setAttribute('aNeural',new THREE.BufferAttribute(kinds,1));resources.add(geometry);
  const points=new THREE.Points(geometry,dustMaterial);points.name=`diamond-dust-${name}`;points.raycast=()=>{};mesh.add(points);dustNodes.push(points);
 }
 // A curved, low-poly petal surface. Two instanced batches build three roses.
 const vertices=[],indices=[],columns=4,rows=6;
 for(let row=0;row<=rows;row++){const v=row/rows;for(let col=0;col<=columns;col++){const u=col/columns*2-1;vertices.push(Math.sin(Math.PI*v)*u*.095,v*.24,v*v*.13-.07*Math.sin(Math.PI*v)+u*u*.04*Math.sin(Math.PI*v));if(row<rows&&col<columns){const a=row*(columns+1)+col,b=a+columns+1;indices.push(a,b,a+1,a+1,b,b+1);}}}
 const petalGeometry=new THREE.BufferGeometry();petalGeometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));petalGeometry.setIndex(indices);petalGeometry.computeVertexNormals();resources.add(petalGeometry);
 const pink=new THREE.MeshPhysicalMaterial({...CRYSTAL_OPTICS,thickness:.08,color:'#f9b0cf',emissive:'#FF007F',emissiveIntensity:.16,side:THREE.DoubleSide,metalness:0});
 const amber=pink.clone();amber.color.set('#ffdc9a');amber.emissive.set('#FFB703');resources.add(pink);resources.add(amber);
 const centers=[[-.5,-.12,.06],[.46,.28,.02],[.34,-.48,.05]],petalsPerRose=21;
 const blooms=[new THREE.InstancedMesh(petalGeometry,pink,petalsPerRose*2),new THREE.InstancedMesh(petalGeometry,amber,petalsPerRose)];blooms.forEach((mesh,i)=>{mesh.name=i?'amber-glass-rose':'pink-glass-roses';root.add(mesh);});
 const offsets=[0,0],dummy=new THREE.Object3D();
 centers.forEach((center,rose)=>{const color=rose===1?1:0;for(let layer=0;layer<3;layer++){const count=5+layer*2;for(let j=0;j<count;j++){
  dummy.position.set(center[0],center[1],center[2]+.09-layer*.025);dummy.rotation.set(.12,-.16,(j/count*Math.PI*2)+layer*.43+rose*.7);dummy.scale.setScalar(.55+layer*.3);dummy.updateMatrix();blooms[color].setMatrixAt(offsets[color]++,dummy.matrix);
 }}});blooms.forEach(mesh=>{mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();});
 // Fine botanical stems curl through the otherwise open thoracic cavity.
 const wireMaterial=new THREE.MeshPhysicalMaterial({...CRYSTAL_OPTICS,thickness:.025,color:'#f5a9c9',emissive:'#FF007F',emissiveIntensity:.18,metalness:0});resources.add(wireMaterial);
 const stemMaterial=wireMaterial.clone();stemMaterial.emissive.set('#FFB703');resources.add(stemMaterial);
 for(let i=0;i<centers.length;i++){
  const [x,y,z]=centers[i],curve=new THREE.CatmullRomCurve3([new THREE.Vector3(0,-.6,0),new THREE.Vector3(x*.6,y-.25,z-.06),new THREE.Vector3(x+.08,y-.1,z),new THREE.Vector3(x,y,z)]);
  const geometry=new THREE.TubeGeometry(curve,24,.006,4,false);resources.add(geometry);root.add(new THREE.Mesh(geometry,i===1?stemMaterial:wireMaterial));
  for(const side of [-1,1]){const tendril=new THREE.CatmullRomCurve3(Array.from({length:10},(_,j)=>{const t=j/9,angle=t*Math.PI*2;return new THREE.Vector3(x*.6+side*t*.16,y-.25+t*.16+Math.sin(angle)*t*.025,z-.06+Math.cos(angle)*t*.07);}));const geometry=new THREE.TubeGeometry(tendril,20,.0035,3,false);resources.add(geometry);root.add(new THREE.Mesh(geometry,i===1?stemMaterial:wireMaterial));}
 }
 root.position.set(...sculpture.anchors.heart);let currentTime=0;
 return{
  update(time,pixelRatio,burst=0,brainMorph=1){uniforms.uNeuralReveal.value=brainMorph;currentTime=time;uniforms.uTime.value=time;uniforms.uPixelRatio.value=pixelRatio;const beat=cardiacPulse(time).flash;pink.emissiveIntensity=.16+beat*.25;amber.emissiveIntensity=.2+beat*.3;wireMaterial.emissiveIntensity=.16+beat*.18;stemMaterial.emissiveIntensity=.2+beat*.2;root.scale.setScalar(1+beat*.012);root.rotation.z=Math.sin(time*.2)*.012;root.visible=burst<.999;},
  telemetry(){return{time:currentTime,dustPoints:dustNodes.reduce((count,node)=>count+node.geometry.attributes.position.count,0),dustRegions:dustNodes.map(node=>node.parent.name),roses:centers.length,petals:petalsPerRose*centers.length,filigreeWires:9,botanicalsVisible:root.visible};},
  dispose(){dustNodes.forEach(node=>node.removeFromParent());blooms.forEach(mesh=>mesh.dispose());resources.forEach(resource=>resource.dispose());scene.remove(root);}
 };
}
