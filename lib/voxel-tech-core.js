import * as THREE from 'three';

const START=.76;
const clamp01=value=>THREE.MathUtils.clamp(value,0,1);
const smooth=value=>THREE.MathUtils.smoothstep(clamp01(value),0,1);

export function voxelRealmProgress(progress){return clamp01((progress-START)/(1-START));}

export function createVoxelTechCore(scene,{economy=false}={}){
 const inheritedVisibility=new Map(scene.children.map(child=>[child,child.visible]));
 const root=new THREE.Group();root.name='voxel-tech-core';scene.add(root);root.visible=false;
 const resources=new Set(),materials=new Set(),clouds=[],vines=[],lava=[],terminals=[],circuitTiles=[];
 const own=value=>{resources.add(value);return value;},material=value=>{materials.add(value);return value;};
 const box=own(new THREE.BoxGeometry(1,1,1)),obsidian=material(new THREE.MeshStandardMaterial({color:'#090a0d',roughness:.7,metalness:.35})),deepslate=material(new THREE.MeshStandardMaterial({color:'#15171b',roughness:.92,metalness:.12})),crimson=material(new THREE.MeshStandardMaterial({color:'#5d1019',emissive:'#270006',emissiveIntensity:.5,roughness:.78})),redstone=material(new THREE.MeshStandardMaterial({color:'#7a120d',emissive:'#ff2c12',emissiveIntensity:1.4,roughness:.42})),lavaMaterial=material(new THREE.MeshStandardMaterial({color:'#ff5a16',emissive:'#ff2600',emissiveIntensity:2.6,roughness:.35}));
 function cube(parent,position,scale,mat=obsidian){const mesh=new THREE.Mesh(box,mat);mesh.position.set(...position);mesh.scale.set(...scale);parent.add(mesh);return mesh;}
 const sky=cube(root,[0,6,-42],[34,20,38],material(new THREE.MeshBasicMaterial({color:'#030407',side:THREE.BackSide})));
 const ambient=new THREE.HemisphereLight('#75839b','#210500',.42),fire=new THREE.PointLight('#ff3b12',32,28,2),moonLight=new THREE.DirectionalLight('#a9bed5',1.2);fire.position.set(0,.8,-43);moonLight.position.set(8,12,-60);root.add(ambient,fire,moonLight);

 // Tall stepped gothic arch and deep corridor, built entirely from voxel blocks.
 const arch=new THREE.Group();arch.name='obsidian-gothic-arch';root.add(arch);
 for(const side of[-1,1])for(let y=0;y<11;y++)for(const z of[-.6,.6])cube(arch,[side*(4.7-(y>7?(y-7)*.42:0)),y*.72-.2,-23+z],[.72,.72,.72],obsidian);
 for(let i=0;i<7;i++){const x=(i-3)*.78,y=7.85-Math.abs(i-3)*.45;cube(arch,[x,y,-23],[.82,.74,1.8],obsidian);}
 for(const side of[-1,1])cube(arch,[side*5.35,3.2,-23],[.7,7.3,2.4],deepslate);

 // Voxel deepslate floor with animated lava fissures and redstone circuitry.
 const floor=new THREE.Group();floor.name='deepslate-circuit-floor';root.add(floor);
 for(let z=0;z<30;z++)for(let x=-9;x<=9;x++){
  const fissure=(Math.abs(x-Math.round(Math.sin(z*.62)*3))<1&&z%3!==0)||(z>17&&Math.abs(x+4)<1);
  const tile=cube(floor,[x*.75,-.78,-20-z*.75],[.73,.18,.73],fissure?lavaMaterial:deepslate);if(fissure)lava.push({mesh:tile,phase:z*.43+x});
 }
 for(let lane=0;lane<5;lane++)for(let step=0;step<34;step++){
  const x=(lane-2)*1.65+Math.sin(step*.48+lane)*.46,z=-24-step*.62,tile=cube(floor,[x,-.59,z],[.18,.035,.46],redstone);circuitTiles.push({mesh:tile,phase:step*.22-lane*.7});
 }

 // Hanging crimson voxel vines. Their roots sway while individual segments stay crisp.
 for(let i=0;i<14;i++){
  const vine=new THREE.Group();vine.position.set(-5.5+(i%7)*1.8,7.4+(i%2)*.5,-24-Math.floor(i/7)*8);root.add(vine);
  const length=4+i%4;for(let j=0;j<length;j++){const segment=cube(vine,[Math.sin(j*.8)*.12,-j*.55,0],[.16,.55,.16],crimson);segment.rotation.z=(j%2?.12:-.12);}
  vines.push({group:vine,phase:i*.71});
 }

 // Moon and cloud layers at the far end of the hall.
 const moon=material(new THREE.MeshBasicMaterial({color:'#c7d1d7',transparent:true,opacity:.82,depthWrite:false}));
 const moonMesh=new THREE.Mesh(own(new THREE.CircleGeometry(5.3,64)),moon);moonMesh.position.set(9,10,-61);root.add(moonMesh);
 const cloudMaterial=material(new THREE.MeshBasicMaterial({color:'#20252d',transparent:true,opacity:.66,depthWrite:false}));
 for(let i=0;i<11;i++){const cloud=cube(root,[-4+(i%6)*3.2,7.7+(i%3)*.9,-58+i%2*.4],[2.4+(i%3),.34,.22],cloudMaterial);clouds.push({mesh:cloud,phase:i*.9,speed:.18+(i%4)*.035});}

 // Deterministic ash field with a shader-driven upward drift and flicker.
 const ashCount=economy?350:900,ashPositions=new Float32Array(ashCount*3),ashSeed=new Float32Array(ashCount);
 for(let i=0;i<ashCount;i++){const seed=(i*.61803398875)%1;ashPositions.set([(seed-.5)*20,((i*.173)%1)*11-1,-18-((i*.347)%1)*42],i*3);ashSeed[i]=seed;}
 const ashGeometry=own(new THREE.BufferGeometry());ashGeometry.setAttribute('position',new THREE.BufferAttribute(ashPositions,3));ashGeometry.setAttribute('aSeed',new THREE.BufferAttribute(ashSeed,1));
 const ashUniforms={uTime:{value:0},uPixelRatio:{value:1}};
 const ashMaterial=material(new THREE.ShaderMaterial({uniforms:ashUniforms,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,vertexShader:`uniform float uTime;uniform float uPixelRatio;attribute float aSeed;varying float vAlpha;void main(){vec3 p=position;p.y=mod(p.y+uTime*(.07+aSeed*.12)+1.,12.)-1.;p.x+=sin(uTime*.18+aSeed*40.)*.25;vec4 view=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*view;gl_PointSize=clamp((2.+aSeed*2.)*uPixelRatio/max(.4,-view.z*.09),1.,5.);vAlpha=.15+.38*pow(.5+.5*sin(uTime*.7+aSeed*70.),4.);}`,fragmentShader:`varying float vAlpha;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(vec3(.72,.54,.43),vAlpha*(1.-d*2.));}`}));
 root.add(new THREE.Points(ashGeometry,ashMaterial));

 // High-density voxel glass brain with a central fissure and internal data paths.
 const brain=new THREE.Group();brain.name='floating-voxel-glass-brain';brain.position.set(0,4.7,-43);root.add(brain);
 const voxelGeometry=own(new THREE.BoxGeometry(.24,.24,.24)),brainMaterial=material(new THREE.MeshPhysicalMaterial({color:'#8d1820',transmission:.78,thickness:.35,ior:1.45,roughness:.12,clearcoat:1,clearcoatRoughness:.08,metalness:0,transparent:true,opacity:.88,emissive:'#420008',emissiveIntensity:.35}));
 const brainPoints=[];for(let x=-14;x<=14;x++)for(let y=-10;y<=10;y++)for(let z=-8;z<=8;z++){
  const px=x*.19,py=y*.19,pz=z*.19,ellipsoid=px*px/7.3+py*py/3.65+pz*pz/2.3;if(ellipsoid<1&&!(Math.abs(px)<.14&&py>.15)&&(x*31+y*17+z*13)%3===0)brainPoints.push([px,py,pz]);
 }
 const voxelLimit=Math.min(brainPoints.length,economy?520:1500),brainVoxels=new THREE.InstancedMesh(voxelGeometry,brainMaterial,voxelLimit),dummy=new THREE.Object3D();
 for(let i=0;i<voxelLimit;i++){dummy.position.set(...brainPoints[Math.floor(i/voxelLimit*brainPoints.length)]);dummy.rotation.set(0,(i%5)*.04,0);dummy.updateMatrix();brainVoxels.setMatrixAt(i,dummy.matrix);}brain.add(brainVoxels);
 const pulseCount=economy?180:420,pulsePosition=new Float32Array(pulseCount*3),pulsePhase=new Float32Array(pulseCount);
 for(let i=0;i<pulseCount;i++){const t=i/pulseCount*Math.PI*8,side=i%2?-1:1,radius=.35+((i*7)%23)/23*1.55;pulsePosition.set([side*(.2+Math.cos(t)*radius),Math.sin(t*.51)*1.35,Math.sin(t)*radius*.65],i*3);pulsePhase[i]=(i%37)/37;}
 const pulseGeometry=own(new THREE.BufferGeometry());pulseGeometry.setAttribute('position',new THREE.BufferAttribute(pulsePosition,3));pulseGeometry.setAttribute('aPhase',new THREE.BufferAttribute(pulsePhase,1));
 const pulseUniforms={uTime:{value:0},uPixelRatio:{value:1}};
 const pulseMaterial=material(new THREE.ShaderMaterial({uniforms:pulseUniforms,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,vertexShader:`uniform float uTime;uniform float uPixelRatio;attribute float aPhase;varying float vPulse;void main(){vPulse=pow(max(0.,sin((aPhase-uTime*.18)*6.28318)),12.);vec4 view=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*view;gl_PointSize=(2.+vPulse*9.)*uPixelRatio/max(.45,-view.z*.1);}`,fragmentShader:`varying float vPulse;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(mix(vec3(.55,.02,.01),vec3(1.,.24,.04),vPulse),(1.-d*2.)*(.25+vPulse*.75));}`}));
 brain.add(new THREE.Points(pulseGeometry,pulseMaterial));
 const brainLight=new THREE.PointLight('#ff2b12',18,12,2);brain.add(brainLight);

 function textTexture(text){const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=192;const context=canvas.getContext('2d');context.fillStyle='#090605';context.fillRect(0,0,1024,192);context.font='38px monospace';context.fillStyle='#ff6a2b';context.textBaseline='middle';context.fillText(text,34,96);for(let x=18;x<1000;x+=32){context.fillStyle=`rgba(255,45,12,${.04+((x/32)%4)*.02})`;context.fillRect(x,24,2,144);}const texture=own(new THREE.CanvasTexture(canvas));texture.colorSpace=THREE.SRGBColorSpace;texture.minFilter=THREE.LinearFilter;return texture;}
 const snippets=['def pipeline(data):','vibe_coding()','prompt.temperature = 0.7','python.execute()','system = "architect"','return validated_rows'];
 for(let i=0;i<snippets.length;i++){
  const side=i%2?-1:1,row=Math.floor(i/2),group=new THREE.Group(),baseY=1.15+row*1.35;group.position.set(side*3.15,baseY,-48-row*.25);root.add(group);cube(group,[0,0,0],[2.55,1.05,.85],obsidian);
  const screenMaterial=material(new THREE.MeshBasicMaterial({map:textTexture(snippets[i]),transparent:true,toneMapped:false,color:'#ff9b66'})),screen=new THREE.Mesh(own(new THREE.PlaneGeometry(2.48,.48)),screenMaterial);screen.position.set(0,.08,.431);group.add(screen);terminals.push({group,material:screenMaterial,phase:i*.83,baseY});
 }

 let captured=false,wasActive=false,paths=null,report={active:false,progress:0,sequence:'anatomy'};
 function curve(points){return new THREE.CatmullRomCurve3(points,false,'catmullrom',.32);}
 function capture(camera){
  const start=camera.position.clone(),startTarget=camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(4).add(start);
  paths={
   entry:curve([start,start.clone().lerp(new THREE.Vector3(0,3,-10),.62),new THREE.Vector3(0,3.1,-13),new THREE.Vector3(0,3.2,-16)]),
   entryTarget:curve([startTarget,startTarget.clone().lerp(new THREE.Vector3(0,3,-23),.7),new THREE.Vector3(0,3,-23),new THREE.Vector3(0,3.4,-27)]),
   brain:curve([new THREE.Vector3(0,3.2,-16),new THREE.Vector3(0,4,-25),new THREE.Vector3(5.8,5.8,-34),new THREE.Vector3(0,5.2,-34)]),
   brainTarget:curve([new THREE.Vector3(0,3.4,-27),new THREE.Vector3(0,4.4,-38),new THREE.Vector3(0,4.7,-43),new THREE.Vector3(0,4.7,-43)]),
   terminal:curve([new THREE.Vector3(0,5.2,-34),new THREE.Vector3(3.5,4.8,-36),new THREE.Vector3(1.5,3.5,-37.5),new THREE.Vector3(0,2.75,-38.5)]),
   terminalTarget:curve([new THREE.Vector3(0,4.7,-43),new THREE.Vector3(0,4,-46),new THREE.Vector3(0,2.7,-48),new THREE.Vector3(0,2.1,-48)])
  };captured=true;
 }
 return{
  update(time,progress,camera,size,pixelRatio=1){const p=voxelRealmProgress(progress),active=p>0;root.visible=active;
   if(active!==wasActive){inheritedVisibility.forEach((visible,child)=>{child.visible=active?false:visible;});wasActive=active;}
   if(!active){captured=false;report={active:false,progress:0,sequence:'anatomy'};return report;}if(!captured)capture(camera);
   let position,target;if(p<.34){const phase=smooth(p/.34);position=paths.entry.getPoint(phase);target=paths.entryTarget.getPoint(phase);}else if(p<.72){const phase=smooth((p-.34)/.38);position=paths.brain.getPoint(phase);target=paths.brainTarget.getPoint(phase);}else{const phase=smooth((p-.72)/.28);position=paths.terminal.getPoint(phase);target=paths.terminalTarget.getPoint(phase);}camera.position.copy(position);camera.lookAt(target);
   brain.rotation.y=time*.16;brain.rotation.z=Math.sin(time*.22)*.035;brain.position.y=4.7+THREE.MathUtils.smoothstep(p,.72,1)*3.5+Math.sin(time*.55)*.12;brainMaterial.emissiveIntensity=.28+.22*(.5+.5*Math.sin(time*1.3));pulseUniforms.uTime.value=time;pulseUniforms.uPixelRatio.value=pixelRatio;ashUniforms.uTime.value=time;ashUniforms.uPixelRatio.value=pixelRatio;
   brain.visible=p<.86;moonMesh.visible=p<.82;vines.forEach(item=>{item.group.rotation.z=Math.sin(time*.42+item.phase)*.07;item.group.rotation.x=Math.cos(time*.3+item.phase)*.025;});clouds.forEach(item=>{item.mesh.visible=p<.82;item.mesh.position.x=-10+((time*item.speed+item.phase)%20);});lava.forEach(item=>{const wave=.75+.25*Math.sin(time*1.45+item.phase);item.mesh.scale.y=.1+wave*.13;});
   circuitTiles.forEach(item=>{const pulse=.25+.75*THREE.MathUtils.smoothstep(Math.sin(time*2.4-item.phase),.55,1);item.mesh.material=redstone;item.mesh.scale.y=.025+pulse*.045;});redstone.emissiveIntensity=.8+1.6*(.5+.5*Math.sin(time*2.4));lavaMaterial.emissiveIntensity=2.2+.9*Math.sin(time*1.45);fire.intensity=28+8*Math.sin(time*1.45);
   terminals.forEach(item=>{item.material.opacity=.58+.42*THREE.MathUtils.smoothstep(Math.sin(time*1.8+item.phase),-.1,1);item.group.position.y=item.baseY+Math.sin(time*.55+item.phase)*.025;});
   const sequence=p<.34?'atmospheric-entry':p<.72?'voxel-brain':'code-terminals';report={active:true,progress:p,sequence,camera:camera.position.toArray(),assets:{archBlocks:53,vines:vines.length,ashParticles:ashCount,lavaTiles:lava.length,brainVoxels:voxelLimit,neuralPulses:pulseCount,terminals:terminals.length,circuitTiles:circuitTiles.length},resolution:{viewport:[size.width,size.height],pixelRatio}};return report;
  },
  telemetry(){return report;},
  dispose(){inheritedVisibility.forEach((visible,child)=>{child.visible=visible;});materials.forEach(value=>value.dispose());resources.forEach(value=>value.dispose());scene.remove(root);}
 };
}
