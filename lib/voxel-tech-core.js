import * as THREE from 'three';

const START=.76;
const clamp01=value=>THREE.MathUtils.clamp(value,0,1);
const smooth=value=>THREE.MathUtils.smoothstep(clamp01(value),0,1);

export function voxelRealmProgress(progress){return clamp01((progress-START)/(1-START));}

export function createVoxelTechCore(scene,{economy=false,sourceModel=null}={}){
 const inheritedVisibility=new Map(scene.children.map(child=>[child,child.visible]));
 const root=new THREE.Group();root.name='voxel-tech-core';scene.add(root);root.visible=false;
 const resources=new Set(),materials=new Set(),clouds=[],vines=[],lanterns=[],portalParticles=[],commandBlocks=[],roamers=[],lava=[],terminals=[],circuitTiles=[];
 const own=value=>{resources.add(value);return value;},material=value=>{materials.add(value);return value;};
 const box=own(new THREE.BoxGeometry(1,1,1)),obsidian=material(new THREE.MeshStandardMaterial({color:'#090a0d',roughness:.7,metalness:.35})),deepslate=material(new THREE.MeshStandardMaterial({color:'#15171b',roughness:.92,metalness:.12})),crimson=material(new THREE.MeshStandardMaterial({color:'#5d1019',emissive:'#270006',emissiveIntensity:.5,roughness:.78})),foliage=material(new THREE.MeshStandardMaterial({color:'#381014',emissive:'#180205',emissiveIntensity:.32,roughness:.9})),lanternMaterial=material(new THREE.MeshStandardMaterial({color:'#ff8a2b',emissive:'#ff4800',emissiveIntensity:3.5,roughness:.25})),soulMaterial=material(new THREE.MeshStandardMaterial({color:'#2bbad1',emissive:'#00b8d8',emissiveIntensity:4.2,roughness:.22})),dragonMaterial=material(new THREE.MeshPhysicalMaterial({color:'#b9c2c4',transmission:.42,ior:1.52,roughness:.2,clearcoat:1,emissive:'#361008',emissiveIntensity:.34})),portalMaterial=material(new THREE.MeshBasicMaterial({color:'#6a1f83',transparent:true,opacity:.44,blending:THREE.AdditiveBlending,depthWrite:false})),redstone=material(new THREE.MeshStandardMaterial({color:'#7a120d',emissive:'#ff2c12',emissiveIntensity:1.4,roughness:.42})),lavaMaterial=material(new THREE.MeshStandardMaterial({color:'#ff5a16',emissive:'#ff2600',emissiveIntensity:2.6,roughness:.35}));
 function cube(parent,position,scale,mat=obsidian){const mesh=new THREE.Mesh(box,mat);mesh.position.set(...position);mesh.scale.set(...scale);parent.add(mesh);return mesh;}
 const sky=cube(root,[0,6,-42],[34,20,38],material(new THREE.MeshBasicMaterial({color:'#030407',side:THREE.BackSide})));
 const ambient=new THREE.HemisphereLight('#75839b','#210500',.42),fire=new THREE.PointLight('#ff3b12',32,28,2),moonLight=new THREE.DirectionalLight('#a9bed5',1.2);fire.position.set(0,.8,-43);moonLight.position.set(8,12,-60);root.add(ambient,fire,moonLight);

 // Exterior gothic canyon: alternating obsidian towers, brick courses, lanterns and crimson growth.
 const canyon=new THREE.Group();canyon.name='gothic-street-canyon';root.add(canyon);
 for(let depth=0;depth<9;depth++)for(const side of[-1,1]){
  const z=-7-depth*1.9,height=5.2+(depth%3)*1.25,width=1.5+(depth%2)*.45;
  cube(canyon,[side*(5.7+(depth%2)*.3),height*.5-.7,z],[width,height,1.72],depth%3===0?deepslate:obsidian);
  for(let row=0;row<3;row++)for(let column=0;column<2;column++)cube(canyon,[side*(4.72+(depth%2)*.3),1.1+row*1.25,z+(column-.5)*.62],[.12,.18,.24],lanternMaterial);
  for(let leaf=0;leaf<5;leaf++)cube(canyon,[side*(4.55+leaf%2*.28),2.1+leaf*.48,z-.45+(leaf%3)*.42],[.28,.32,.28],foliage);
  if(depth%2===0){const lamp=cube(canyon,[side*4.35,3.7,z],[.22,.34,.22],lanternMaterial),light=new THREE.PointLight('#ff6a22',5.5,5.5,2);light.position.copy(lamp.position);canyon.add(light);lanterns.push({mesh:lamp,light,phase:depth*.61+side});}
 }
 for(let depth=0;depth<8;depth++)for(const side of[-1,1])for(let course=0;course<4;course++)cube(canyon,[side*(4.9+course*.36),-.43,-7-depth*2.1],[.34,.36,1.98],course%2?obsidian:deepslate);

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

 // Subterranean cavern landmarks: lava falls, soul-fire beacons, fungus and two energetic portals.
 const cavern=new THREE.Group();cavern.name='nether-core-cavern';root.add(cavern);
 for(const side of[-1,1]){
  for(let y=0;y<12;y++){const fall=cube(cavern,[side*7.1,6.8-y*.62,-35-side*4.2],[.72,.58,.34],lavaMaterial);lava.push({mesh:fall,phase:y*.35+side});}
  for(let tier=0;tier<7;tier++)cube(cavern,[side*(7.8+tier*.4),tier*.7-.5,-38-tier*.6],[1.35,.68,1.2],tier%2?obsidian:deepslate);
 }
 for(let i=0;i<8;i++){
  const side=i%2?-1:1,x=side*(2.6+(i%3)*1.1),z=-27-Math.floor(i/2)*4.1;
  cube(cavern,[x,-.15,z],[.42,.22,.42],deepslate);cube(cavern,[x,.2,z],[.24,.5,.24],soulMaterial);cube(cavern,[x,.68,z],[.12,.28,.12],soulMaterial);
  const light=new THREE.PointLight('#00c8e8',4.2,4.8,2);light.position.set(x,.75,z);cavern.add(light);lanterns.push({mesh:light,light,phase:i*.8,soul:true});
 }
 for(let i=0;i<34;i++){const side=i%2?-1:1;cube(cavern,[side*(3.8+(i%5)*.38),-.28,-25-Math.floor(i/5)*2.7],[.18,.28+(i%3)*.13,.18],i%4===0?soulMaterial:crimson);}
 for(const [index,x] of[-4.9,4.9].entries()){
  const portal=new THREE.Group();portal.position.set(x,2.2,-32-index*7);portal.rotation.y=x<0?.34:-.34;cavern.add(portal);
  for(const side of[-1,1])for(let y=0;y<7;y++)cube(portal,[side*1.35,y*.55-1.65,0],[.34,.52,.38],obsidian);
  for(let top=0;top<5;top++)for(const y of[-1.92,1.92])cube(portal,[(top-2)*.55,y,0],[.52,.34,.38],obsidian);
  const field=new THREE.Mesh(own(new THREE.PlaneGeometry(2.3,3.35)),portalMaterial);field.position.z=.03;portal.add(field);
  const count=90,positions=new Float32Array(count*3);for(let i=0;i<count;i++)positions.set([((i*.618)%1-.5)*2.2,((i*.347)%1-.5)*3.25,.12+((i*.173)%1)*.18],i*3);
  const geometry=own(new THREE.BufferGeometry());geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));const points=new THREE.Points(geometry,material(new THREE.PointsMaterial({color:'#a044c4',size:.045,transparent:true,opacity:.72,blending:THREE.AdditiveBlending,depthWrite:false})));portal.add(points);portalParticles.push({portal,field,points,phase:index*1.7});
 }
 for(let i=0;i<6;i++){const group=new THREE.Group();group.position.set((i%2?-1:1)*(3.2+(i%3)*.55),1.5+(i%3)*1.15,-34-Math.floor(i/2)*3.3);cavern.add(group);cube(group,[0,0,0],[.62,.62,.62],obsidian);for(const side of[-1,1])cube(group,[side*.64,0,0],[.06,.38,.38],redstone);cube(group,[0,0,.64],[.38,.38,.06],lanternMaterial);commandBlocks.push({group,baseY:group.position.y,phase:i*.9});}

 // A suspended skeletal dragon occupies the upper citadel without blocking the camera corridor.
 const dragon=new THREE.Group(),dragonBody=new THREE.Group(),dragonTail=new THREE.Group(),dragonWings=new THREE.Group();dragon.name='voxel-skeletal-dragon';dragon.position.set(-1.2,8.5,-31);dragon.scale.setScalar(.72);dragon.add(dragonBody,dragonTail,dragonWings);cavern.add(dragon);let dragonVoxels=0;
 const dragonCube=(parent,position,scale,mat=dragonMaterial)=>{dragonVoxels++;return cube(parent,position,scale,mat);};
 for(let i=0;i<24;i++){const x=-2.8+i*.24,y=Math.sin(i*.38)*.12;dragonCube(dragonBody,[x,y,0],[.22,.18,.18]);if(i%2===0)for(const side of[-1,1])for(let rib=1;rib<5;rib++)dragonCube(dragonBody,[x,-rib*.18,side*rib*.19],[.1,.15,.16],rib===4?lanternMaterial:dragonMaterial);}
 for(let i=0;i<28;i++){const t=i/27,angle=t*1.25;dragonCube(dragonTail,[-2.9-Math.cos(angle)*i*.17,-.05-i*.025,Math.sin(angle)*i*.11],[.18*(1-t*.7),.15*(1-t*.7),.15*(1-t*.7)]);}
 for(let i=0;i<18;i++){const t=i/17;for(const side of[-1,1])dragonCube(dragonWings,[.2+i*.12,-.05+t*.7,side*(.28+i*.24)],[.12,.1,.28],i%4===0?redstone:dragonMaterial);}
 for(let x=0;x<4;x++)for(let y=0;y<3;y++)dragonCube(dragonBody,[3+x*.24,y*.22-.05,(x%2-.5)*.22],[.22,.2,.22],x===3&&y===1?lavaMaterial:dragonMaterial);

 // Small bridge walkers use independent limb pivots and loop through the lower route.
 for(let i=0;i<6;i++){const entity=new THREE.Group(),leftLeg=new THREE.Group(),rightLeg=new THREE.Group();entity.position.set(i%2?-4.2:4.2,-.15,-10-i*4.8);cavern.add(entity);cube(entity,[0,.85,0],[.34,.55,.25],i%3===0?crimson:deepslate);cube(entity,[0,1.65,0],[.38,.38,.34],dragonMaterial);leftLeg.position.set(-.18,.3,0);rightLeg.position.set(.18,.3,0);cube(leftLeg,[0,-.34,0],[.14,.38,.16],obsidian);cube(rightLeg,[0,-.34,0],[.14,.38,.16],obsidian);entity.add(leftLeg,rightLeg);roamers.push({entity,leftLeg,rightLeg,phase:i*.9,lane:i%2?-1:1});}

 // Hanging crimson voxel vines. Their roots sway while individual segments stay crisp.
 for(let i=0;i<14;i++){
  const vine=new THREE.Group();vine.position.set(-5.5+(i%7)*1.8,7.4+(i%2)*.5,-24-Math.floor(i/7)*8);root.add(vine);
  const length=4+i%4;for(let j=0;j<length;j++){const segment=cube(vine,[Math.sin(j*.8)*.12,-j*.55,0],[.16,.55,.16],crimson);segment.rotation.z=(j%2?.12:-.12);}
  vines.push({group:vine,phase:i*.71});
 }

 // Moon and cloud layers cover the distant hall and exterior canyon.
 const moon=material(new THREE.MeshBasicMaterial({color:'#c7d1d7',transparent:true,opacity:.82,depthWrite:false}));
 const moonMesh=new THREE.Mesh(own(new THREE.CircleGeometry(5.3,64)),moon);moonMesh.position.set(9,10,-61);root.add(moonMesh);
 const cloudMaterial=material(new THREE.MeshBasicMaterial({color:'#20252d',transparent:true,opacity:.66,depthWrite:false}));
 const crimsonCloudMaterial=material(new THREE.MeshBasicMaterial({color:'#35070c',transparent:true,opacity:.58,depthWrite:false,blending:THREE.AdditiveBlending}));
 for(let i=0;i<11;i++){const cloud=cube(root,[-4+(i%6)*3.2,7.7+(i%3)*.9,-58+i%2*.4],[2.4+(i%3),.34,.22],cloudMaterial);clouds.push({mesh:cloud,phase:i*.9,speed:.18+(i%4)*.035});}
 for(let i=0;i<14;i++){const cloud=cube(root,[-10+(i%7)*3.2,8.5+(i%3)*.65,-8-Math.floor(i/7)*10],[2.8+(i%4)*.7,.28,2.2],crimsonCloudMaterial);clouds.push({mesh:cloud,phase:i*.73,speed:.11+(i%3)*.025,origin:-12,crimson:true});}

 // Deterministic ash field with a shader-driven upward drift and flicker.
 const ashCount=economy?350:900,ashPositions=new Float32Array(ashCount*3),ashSeed=new Float32Array(ashCount);
 for(let i=0;i<ashCount;i++){const seed=(i*.61803398875)%1;ashPositions.set([(seed-.5)*20,((i*.173)%1)*11-1,-18-((i*.347)%1)*42],i*3);ashSeed[i]=seed;}
 const ashGeometry=own(new THREE.BufferGeometry());ashGeometry.setAttribute('position',new THREE.BufferAttribute(ashPositions,3));ashGeometry.setAttribute('aSeed',new THREE.BufferAttribute(ashSeed,1));
 const ashUniforms={uTime:{value:0},uPixelRatio:{value:1}};
 const ashMaterial=material(new THREE.ShaderMaterial({uniforms:ashUniforms,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,vertexShader:`uniform float uTime;uniform float uPixelRatio;attribute float aSeed;varying float vAlpha;void main(){vec3 p=position;p.y=mod(p.y+uTime*(.07+aSeed*.12)+1.,12.)-1.;p.x+=sin(uTime*.18+aSeed*40.)*.25;vec4 view=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*view;gl_PointSize=clamp((2.+aSeed*2.)*uPixelRatio/max(.4,-view.z*.09),1.,5.);vAlpha=.15+.38*pow(.5+.5*sin(uTime*.7+aSeed*70.),4.);}`,fragmentShader:`varying float vAlpha;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(vec3(.72,.54,.43),vAlpha*(1.-d*2.));}`}));
 root.add(new THREE.Points(ashGeometry,ashMaterial));

 // Dense GPU ember volume. Adaptive counts preserve the atmospheric depth without overwhelming software renderers.
 const emberCount=economy?1800:16000,emberPosition=new Float32Array(emberCount*3),emberSeed=new Float32Array(emberCount);
 for(let i=0;i<emberCount;i++){const a=(i*.61803398875)%1,b=(i*.41421356237)%1,c=(i*.73205080757)%1;emberPosition.set([(a-.5)*27,b*12-1,-5-c*57],i*3);emberSeed[i]=(i*.2718281828)%1;}
 const emberGeometry=own(new THREE.BufferGeometry());emberGeometry.setAttribute('position',new THREE.BufferAttribute(emberPosition,3));emberGeometry.setAttribute('aSeed',new THREE.BufferAttribute(emberSeed,1));
 const emberUniforms={uTime:{value:0},uPixelRatio:{value:1}},emberMaterial=material(new THREE.ShaderMaterial({uniforms:emberUniforms,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,vertexShader:`uniform float uTime;uniform float uPixelRatio;attribute float aSeed;varying float vHeat;void main(){vec3 p=position;p.y=mod(p.y+uTime*(.16+aSeed*.42)+1.,12.)-1.;p.x+=sin(uTime*(.3+aSeed*.2)+aSeed*90.)*(.12+aSeed*.28);p.z+=cos(uTime*.17+aSeed*55.)*.16;vec4 view=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*view;gl_PointSize=clamp((1.1+aSeed*2.6)*uPixelRatio/max(.42,-view.z*.055),1.,4.8);vHeat=pow(.5+.5*sin(uTime*1.1+aSeed*120.),5.);}`,fragmentShader:`varying float vHeat;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;vec3 heat=mix(vec3(.38,.005,.002),vec3(1.,.19,.025),vHeat);gl_FragColor=vec4(heat,(1.-d*2.)*(.18+vHeat*.58));}`}));root.add(new THREE.Points(emberGeometry,emberMaterial));

 // The realm brain reuses the authored GLB cerebral surfaces, normalized into this world.
 const brain=new THREE.Group();brain.name='floating-voxel-glass-brain';brain.position.set(0,4.7,-43);root.add(brain);
 const brainMaterial=material(new THREE.MeshPhysicalMaterial({color:'#8d1820',transmission:.9,thickness:.85,ior:1.52,roughness:.08,clearcoat:1,clearcoatRoughness:.06,metalness:0,transparent:true,opacity:.94,emissive:'#4f0008',emissiveIntensity:.38}));
 const cerebral=new THREE.Group();cerebral.name='authored-glass-neural-core';brain.add(cerebral);let brainSurfaceVertices=0;
 for(const name of['BrainLeft','BrainRight']){const source=sourceModel?.getObjectByName(name);if(!source?.isMesh)continue;const geometry=own(source.geometry.clone());geometry.applyMatrix4(source.matrixWorld);brainSurfaceVertices+=geometry.attributes.position.count;const mesh=new THREE.Mesh(geometry,brainMaterial);cerebral.add(mesh);}
 if(cerebral.children.length){const bounds=new THREE.Box3().setFromObject(cerebral),center=bounds.getCenter(new THREE.Vector3()),size=bounds.getSize(new THREE.Vector3()),scale=4.8/Math.max(size.x,size.y,size.z);cerebral.children.forEach(mesh=>mesh.position.sub(center));cerebral.scale.setScalar(scale);}
 else{const fallback=own(new THREE.IcosahedronGeometry(2.15,economy?3:5)),mesh=new THREE.Mesh(fallback,brainMaterial);brainSurfaceVertices=fallback.attributes.position.count;cerebral.add(mesh);}
 const synapseMaterial=material(new THREE.MeshStandardMaterial({color:'#ff2e18',emissive:'#ff1600',emissiveIntensity:3.2,roughness:.24}));
 for(let i=0;i<(economy?14:30);i++){const side=i%2?-1:1,phase=i*.73,points=[];for(let step=0;step<9;step++){const t=step/8*Math.PI*1.8+phase;points.push(new THREE.Vector3(side*(.3+Math.cos(t)*(.65+(i%5)*.18)),Math.sin(t*.62)*1.55,Math.sin(t)*(.55+(i%4)*.12)));}const tube=own(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),32,.018+(i%3)*.006,5,false));brain.add(new THREE.Mesh(tube,synapseMaterial));}
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
  update(time,progress,camera,size,pixelRatio=1,enabled=true){const p=voxelRealmProgress(progress),active=p>0&&enabled;root.visible=active;
   if(active!==wasActive){inheritedVisibility.forEach((visible,child)=>{child.visible=active?false:visible;});wasActive=active;}
   if(!active){captured=false;report={active:false,progress:0,sequence:'anatomy'};return report;}if(!captured)capture(camera);
   let position,target;if(p<.34){const phase=smooth(p/.34);position=paths.entry.getPoint(phase);target=paths.entryTarget.getPoint(phase);}else if(p<.72){const phase=smooth((p-.34)/.38);position=paths.brain.getPoint(phase);target=paths.brainTarget.getPoint(phase);}else{const phase=smooth((p-.72)/.28);position=paths.terminal.getPoint(phase);target=paths.terminalTarget.getPoint(phase);}camera.position.copy(position);camera.lookAt(target);
   brain.rotation.y=time*.16;brain.rotation.z=Math.sin(time*.22)*.035;brain.position.y=4.7+THREE.MathUtils.smoothstep(p,.72,1)*3.5+Math.sin(time*.55)*.12;brainMaterial.emissiveIntensity=.28+.22*(.5+.5*Math.sin(time*1.3));pulseUniforms.uTime.value=time;pulseUniforms.uPixelRatio.value=pixelRatio;ashUniforms.uTime.value=time;ashUniforms.uPixelRatio.value=pixelRatio;emberUniforms.uTime.value=time;emberUniforms.uPixelRatio.value=pixelRatio;
   brain.visible=p<.86;moonMesh.visible=p<.82;vines.forEach(item=>{item.group.rotation.z=Math.sin(time*.42+item.phase)*.07;item.group.rotation.x=Math.cos(time*.3+item.phase)*.025;});lanterns.forEach(item=>{item.light.intensity=(item.soul?3.6:4.6)+(item.soul ? .6 : 1.4)*(.5+.5*Math.sin(time*2.1+item.phase));});portalParticles.forEach(item=>{item.portal.rotation.z=Math.sin(time*.34+item.phase)*.01;item.points.rotation.z=time*.08+item.phase;item.field.material.opacity=.36+.12*Math.sin(time*1.7+item.phase);});commandBlocks.forEach(item=>{item.group.rotation.y=time*.18+item.phase;item.group.position.y=item.baseY+Math.sin(time*.7+item.phase)*.18;});clouds.forEach(item=>{item.mesh.visible=p<.82;item.mesh.position.x=(item.origin??-10)+((time*item.speed+item.phase)%20);if(item.crimson){item.mesh.rotation.y=Math.sin(time*.08+item.phase)*.08;item.mesh.scale.y=.22+.08*(.5+.5*Math.sin(time*.21+item.phase));}});lava.forEach(item=>{const wave=.75+.25*Math.sin(time*1.45+item.phase);item.mesh.scale.y=.1+wave*.13;});
   dragon.position.y=8.5+Math.sin(time*.72)*.13;dragonBody.scale.y=1+Math.sin(time*.72)*.035;dragonTail.rotation.y=Math.sin(time*.42)*.24;dragonWings.rotation.x=Math.sin(time*.56)*.12;roamers.forEach(item=>{item.entity.position.z=-8-((time*.48+item.phase)%38);item.entity.position.x=item.lane*(4.05+Math.sin(time*.31+item.phase)*.18);const step=Math.sin(time*3.2+item.phase)*.42;item.leftLeg.rotation.x=step;item.rightLeg.rotation.x=-step;});
   circuitTiles.forEach(item=>{const pulse=.25+.75*THREE.MathUtils.smoothstep(Math.sin(time*2.4-item.phase),.55,1);item.mesh.material=redstone;item.mesh.scale.y=.025+pulse*.045;});redstone.emissiveIntensity=.8+1.6*(.5+.5*Math.sin(time*2.4));lavaMaterial.emissiveIntensity=2.2+.9*Math.sin(time*1.45);fire.intensity=28+8*Math.sin(time*1.45);
   terminals.forEach(item=>{item.material.opacity=.58+.42*THREE.MathUtils.smoothstep(Math.sin(time*1.8+item.phase),-.1,1);item.group.position.y=item.baseY+Math.sin(time*.55+item.phase)*.025;});
   const sequence=p<.34?'atmospheric-entry':p<.72?'voxel-brain':'code-terminals';report={active:true,progress:p,sequence,camera:camera.position.toArray(),assets:{archBlocks:53,canyonStructures:18,lanterns:lanterns.length,vines:vines.length,stormLayers:clouds.length,portals:portalParticles.length,commandBlocks:commandBlocks.length,roamingEntities:roamers.length,dragonVoxels,ashParticles:ashCount,emberParticles:emberCount,lavaTiles:lava.length,brainSurfaceVertices,neuralPulses:pulseCount,terminals:terminals.length,circuitTiles:circuitTiles.length},resolution:{viewport:[size.width,size.height],pixelRatio}};return report;
  },
  telemetry(){return report;},
  dispose(){inheritedVisibility.forEach((visible,child)=>{child.visible=visible;});materials.forEach(value=>value.dispose());resources.forEach(value=>value.dispose());scene.remove(root);}
 };
}
