import * as THREE from 'three';
import {COMIC_REALMS} from './comic-tools';

export function createComicWorld(scene,camera,sculpture,{economy=false,invalidate=()=>{}}={}){
 const hiddenRoots=[...scene.children].filter(node=>!node.isCamera),root=new THREE.Group();root.name='comic-multi-realm-installation';scene.add(root);
 const resources=new Set(),worlds=[],bubbles=[],workPanels=[],roses=[],pages=[],portalMarkers=[];
 const ambient=new THREE.AmbientLight('#b7c5d0',1.5),key=new THREE.DirectionalLight('#fff1dd',2);key.position.set(4,7,5);root.add(ambient,key);
 const color=[0x7ca3b7,0x79d1df,0xd1b5c5],origins=[new THREE.Vector3(0,0,-22),new THREE.Vector3(18,0,-25),new THREE.Vector3(36,0,-24)];
 const own=r=>{resources.add(r);return r;};
 function toon(value){return own(new THREE.MeshToonMaterial({color:value}));}
 function mesh(group,geometry,material,position=[0,0,0],edges=true){const obj=new THREE.Mesh(own(geometry),material);obj.position.set(...position);group.add(obj);if(edges){const line=new THREE.LineSegments(own(new THREE.EdgesGeometry(geometry,25)),own(new THREE.LineBasicMaterial({color:'#080b10',transparent:true,opacity:.85})));obj.add(line);}return obj;}
 function textSprite(text,tint='#b5edff',width=1.7){const canvas=document.createElement('canvas');canvas.width=512;canvas.height=96;const ctx=canvas.getContext('2d');ctx.font='26px monospace';ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,48,490);const texture=own(new THREE.CanvasTexture(canvas)),material=own(new THREE.SpriteMaterial({map:texture,color:tint,transparent:true,depthWrite:false})),sprite=new THREE.Sprite(material);sprite.scale.set(width,width*96/512,1);return sprite;}
 function speech(group,text,position){const shape=new THREE.Shape();shape.moveTo(-.95,-.23);shape.lineTo(-.3,-.23);shape.lineTo(-.45,-.47);shape.lineTo(.05,-.23);shape.lineTo(.95,-.23);shape.lineTo(.95,.23);shape.lineTo(-.95,.23);shape.closePath();const bubble=new THREE.Group();bubble.position.set(...position);mesh(bubble,new THREE.ShapeGeometry(shape),toon('#334756'));const sprite=textSprite(text,'#8feaff',1.75);sprite.position.z=.015;bubble.add(sprite);group.add(bubble);bubbles.push(bubble);}
 const panelGeo=new THREE.PlaneGeometry(1.55,.88);own(panelGeo);
 for(let i=0;i<3;i++){
  const group=new THREE.Group();group.name=`comic-realm-${i+1}`;group.position.copy(origins[i]);root.add(group);worlds.push(group);
  const floor=mesh(group,new THREE.PlaneGeometry(13,13),toon(i===1?'#102b38':'#11151e'),[0,-.55,0]);floor.rotation.x=-Math.PI/2;
  for(let j=0;j<3;j++){
   const panel=new THREE.Group();panel.position.set((j-1)*1.85,.35,2.3);const paper=new THREE.Mesh(panelGeo,toon(i===1?'#1c4652':'#20232c'));panel.add(paper);const outline=new THREE.LineSegments(own(new THREE.EdgesGeometry(panelGeo)),own(new THREE.LineBasicMaterial({color:color[i]})));paper.add(outline);group.add(panel);
   const title=textSprite(COMIC_REALMS[i].works[j][1],`#${color[i].toString(16)}`,1.35);title.position.set(0,0,.02);panel.add(title);workPanels.push({realm:i+1,id:COMIC_REALMS[i].works[j][0],group:panel});
  }
 }
 // Monochrome code city, with native speech/thought syntax bubbles.
 const cityMaterial=toon('#526879');for(let i=0;i<24;i++){const x=(i%8-3.5)*1.1,z=-Math.floor(i/8)*1.8-1,height=.9+((i*7)%9)*.32;mesh(worlds[0],new THREE.BoxGeometry(.65,height,.65),cityMaterial,[x,height*.5-.55,z]);}
 speech(worlds[0],'vibe_coding()',[0,3.9,0]);speech(worlds[0],'python.execute()',[-2.1,2.8,1]);
 // Exploded authored atlas plates, separate from an illustrative molecular study.
 const plates=[];for(const [j,name] of ['Cranium','CervicalSpine','Ribcage'].entries()){
  const source=sculpture.model.getObjectByName(name),copy=new THREE.Mesh(own(source.geometry.clone()),toon(j===1?'#d9a258':'#5db2c5'));const box=new THREE.Box3().setFromBufferAttribute(copy.geometry.attributes.position),center=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3());copy.geometry.translate(-center.x,-center.y,-center.z);copy.scale.setScalar(1.1/Math.max(size.x,size.y,size.z));worlds[1].add(copy);plates.push({mesh:copy,index:j});const caption=textSprite(name.toUpperCase(),'#8ddbe6',1.4);caption.position.set(-2.7+j*1.25,2.9,0);worlds[1].add(caption);
 }
 const molecule=new THREE.Group();molecule.position.set(1.45,1.6,0);worlds[1].add(molecule);const atomGeo=own(new THREE.IcosahedronGeometry(.095,0)),proteinMat=toon('#76cdd7'),ligandMat=toon('#e0a257');
 const backbone=[];for(let i=0;i<22;i++){const t=i/21*Math.PI*3.5,p=new THREE.Vector3(Math.cos(t)*.65,(i/21-.5)*1.8,Math.sin(t)*.4);backbone.push(p);const atom=new THREE.Mesh(atomGeo,proteinMat);atom.position.copy(p);molecule.add(atom);}mesh(molecule,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(backbone),64,.035,5,false),proteinMat);
 const ligand=new THREE.Group();ligand.position.x=.8;molecule.add(ligand);for(let i=0;i<6;i++){const a=i/6*Math.PI*2,b=(i+1)/6*Math.PI*2,p=new THREE.Vector3(Math.cos(a)*.28,Math.sin(a)*.28,0),q=new THREE.Vector3(Math.cos(b)*.28,Math.sin(b)*.28,0);const atom=new THREE.Mesh(atomGeo,ligandMat);atom.position.copy(p);ligand.add(atom);mesh(ligand,new THREE.TubeGeometry(new THREE.LineCurve3(p,q),1,.025,4,false),ligandMat);}
 speech(worlds[1],'ILLUSTRATIVE / NOT A DOCKING RESULT',[.5,3.5,0]);
 // Glass rose gallery and silver botanical filigree.
 const petal=new THREE.BufferGeometry(),positions=[],indices=[];for(let r=0;r<=6;r++)for(let c=0;c<=4;c++){const v=r/6,u=c/4*2-1;positions.push(Math.sin(Math.PI*v)*u*.14,v*.34,v*v*.18-.09*Math.sin(Math.PI*v)+u*u*.05);if(r<6&&c<4){const a=r*5+c;indices.push(a,a+5,a+1,a+1,a+5,a+6);}}petal.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));petal.setIndex(indices);petal.computeVertexNormals();own(petal);
 const silver=own(new THREE.MeshStandardMaterial({color:'#c5c9d1',metalness:.9,roughness:.18}));
 for(let i=0;i<3;i++){
  const rose=new THREE.Group();rose.position.set((i-1)*1.8,1.55,0);worlds[2].add(rose);const material=own(new THREE.MeshPhysicalMaterial({color:i===1?'#ffcf94':'#f3b1ce',emissive:i===1?'#FFB703':'#FF007F',emissiveIntensity:.18,transmission:.75,roughness:.1,clearcoat:1,side:THREE.DoubleSide}));
  const petals=new THREE.InstancedMesh(petal,material,21),dummy=new THREE.Object3D();let n=0;for(let layer=0;layer<3;layer++)for(let j=0;j<5+layer*2;j++){dummy.position.set(0,0,.12-layer*.035);dummy.rotation.set(0,0,j/(5+layer*2)*Math.PI*2+layer*.45);dummy.scale.setScalar(1.2+layer*.5);dummy.updateMatrix();petals.setMatrixAt(n++,dummy.matrix);}rose.add(petals);resources.add(petals);
  const pos=new Float32Array(70*3),seed=new Float32Array(70);for(let j=0;j<70;j++){pos.set([Math.cos(j*2.4),Math.sin(j*2.4),Math.sin(j*.8)],j*3);seed[j]=(j*.618)%1;}const geometry=own(new THREE.BufferGeometry());geometry.setAttribute('position',new THREE.BufferAttribute(pos,3));geometry.setAttribute('aSeed',new THREE.BufferAttribute(seed,1));const burstUniform={value:10};const ink=own(new THREE.ShaderMaterial({uniforms:{uAge:burstUniform},transparent:true,depthWrite:false,vertexShader:`uniform float uAge;attribute float aSeed;varying float vAlpha;void main(){vec3 p=position*min(uAge,1.)*(.25+aSeed*.65);p.y-=uAge*uAge*.12;vec4 view=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*view;gl_PointSize=clamp(26./max(.3,-view.z),2.,10.);vAlpha=max(0.,1.-uAge);}`,fragmentShader:`varying float vAlpha;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(vec3(1.,.05,.35),vAlpha*(1.-d*2.));}`}));const splash=new THREE.Points(geometry,ink);splash.position.z=.2;rose.add(splash);roses.push({group:rose,id:COMIC_REALMS[2].works[i][0],burstUniform,lastBurst:-10,scale:1});
  const curl=Array.from({length:30},(_,j)=>{const t=j/29,a=t*Math.PI*3;return new THREE.Vector3((i-1)*1.8+Math.sin(a)*(.18+t*.1),-.4+t*1.9,Math.cos(a)*.15);});mesh(worlds[2],new THREE.TubeGeometry(new THREE.CatmullRomCurve3(curl),48,.016,5,false),silver);
 }
 // Physical pages with left-edge hinges fold back during the finale.
 const pageGroup=new THREE.Group();pageGroup.name='comic-page-flip-finale';root.add(pageGroup);
 for(let i=0;i<3;i++){const pivot=new THREE.Group(),paper=mesh(pivot,new THREE.PlaneGeometry(2.4,3.4),own(new THREE.MeshToonMaterial({color:'#b9c2c5',side:THREE.DoubleSide,transparent:true,opacity:1})),[1.2,0,0]);const title=textSprite(`${i+1} // ${COMIC_REALMS[i].title}`,'#111820',2.1);title.position.set(1.2,.8,.015);pivot.add(title);pivot.position.z=i*.035;pageGroup.add(pivot);pages.push({pivot,paper,title});}
 const portals=new THREE.Group();portals.name='three-comic-realm-portals';root.add(portals);
 for(let i=0;i<3;i++){const group=new THREE.Group(),geometry=own(new THREE.TorusGeometry(1,.025,5,48)),material=own(new THREE.MeshBasicMaterial({color:color[i]}));group.add(new THREE.Mesh(geometry,material));portals.add(group);portalMarkers.push(group);}
 let mode='anatomy',realm=0,age=0,lastTime=0,visited=false,paused=false,holding=false,pending=null,hover=null,selectedWork=null,previousHover=null,fromRealm=0,path=null,from=new THREE.Vector3(),fromTarget=new THREE.Vector3(),report={},explode=.7,dockX=0,dockY=0,ligandOffset=.8,returnedAt=0,returnedReady=false;
 const listeners=[];const listen=(name,fn)=>{addEventListener(name,fn);listeners.push([name,fn]);};
 listen('portfolio:comic-select',event=>{const id=Number(event.detail);if(id>=1&&id<=3){pending=id;invalidate();}});
 listen('portfolio:comic-next',()=>{pending=mode==='menu'?1:realm<3?realm+1:'finale';invalidate();});
 listen('portfolio:comic-pause',()=>{paused=!paused;invalidate();});
 listen('portfolio:comic-interaction',event=>{holding=!!event.detail;invalidate();});
 listen('portfolio:comic-hover',event=>{hover=event.detail||null;invalidate();});
 listen('portfolio:comic-work',event=>{selectedWork=event.detail||null;invalidate();});
 listen('portfolio:comic-return',()=>{pending='finale';invalidate();});
 listen('portfolio:comic-exit',()=>{pending='exit';invalidate();});
 listen('portfolio:comic-model',event=>{const d=event.detail||{};if(Number.isFinite(d.explode))explode=d.explode;if(Number.isFinite(d.x))dockX=d.x;if(Number.isFinite(d.y))dockY=d.y;if(Number.isFinite(d.offset))ligandOffset=d.offset;invalidate();});
 function begin(next){from.copy(camera.position);fromTarget.copy(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(4).add(camera.position));fromRealm=realm;age=0;visited=true;if(next==='exit'){mode='returned';realm=0;returnedAt=lastTime;returnedReady=false;dispatchEvent(new CustomEvent('portfolio:comic-rebuilt'));return;}mode=next==='finale'?'finale':'realm';realm=next==='finale'?3:next;const end=next==='finale'?new THREE.Vector3(0,1,9.3):origins[realm-1].clone().add(new THREE.Vector3(2.8,2.9,Math.max(9,3.2/(Math.tan(THREE.MathUtils.degToRad(19))*camera.aspect))));path=new THREE.CatmullRomCurve3([from.clone(),from.clone().lerp(end,.3).add(new THREE.Vector3(0,1.8,0)),from.clone().lerp(end,.72).add(new THREE.Vector3(0,.8,-2)),end]);}
 function project(point,size){const p=point.clone().project(camera);return{screen:[(p.x*.5+.5)*size.width,(-p.y*.5+.5)*size.height],visible:p.z>-1&&p.z<1&&Math.abs(p.x)<.98&&Math.abs(p.y)<.98};}
 return{
  update(time,progress,size,active){const dt=Math.max(0,time-lastTime);lastTime=time;if(active&&!holding&&!hover&&(!paused||(mode==='realm'&&age<2.3)||mode==='finale'))age+=dt;
   if(pending!==null){const next=pending;pending=null;begin(next);}
   if(mode==='anatomy'&&progress>.735&&!visited){mode='menu';age=0;visited=true;}
   if(mode==='menu'&&age>=3)begin(1);
   if(mode==='realm'&&age>=16)begin(realm<3?realm+1:'finale');
   if(mode==='returned'&&progress<.01)returnedReady=true;if(mode==='returned'&&returnedReady&&progress>.05){mode='anatomy';}
   const flight=THREE.MathUtils.smoothstep(age,0,2.3),isStory=mode==='realm'||mode==='finale';
   ambient.visible=key.visible=isStory;ambient.intensity=flight*1.5;key.intensity=flight*2;
   worlds.forEach((group,index)=>group.visible=isStory&&(index===realm-1||(flight<1&&index===fromRealm-1)));
   if(isStory){camera.position.copy(path.getPointAt(Math.min(1,flight)));const target=mode==='finale'?new THREE.Vector3(0,1,0):origins[realm-1].clone().add(new THREE.Vector3(0,1.45,0));camera.lookAt(fromTarget.clone().lerp(target,flight));}
   if(mode==='returned'){const radius=Math.max(9.3,3/(2*Math.tan(THREE.MathUtils.degToRad(19))*size.width/size.height)),angle=(time-returnedAt)*.12;camera.position.set(Math.sin(angle)*radius,1,Math.cos(angle)*radius);camera.lookAt(0,1,0);}
   if(mode==='finale'&&age>3.4){mode='returned';realm=0;returnedAt=time;returnedReady=false;dispatchEvent(new CustomEvent('portfolio:comic-rebuilt'));}
   const showingAnatomy=mode==='anatomy'||mode==='menu'||mode==='returned'||(mode==='finale'&&flight>.7)||(mode==='realm'&&flight<.25);
   hiddenRoots.forEach(node=>node.visible=showingAnatomy&&node.name!=='dual-domain-gateway'&&(mode!=='returned'||['imported-upper-body','anatomical-gallery-lights','thoracic-glass-botanicals'].includes(node.name)));const labels=scene.getObjectByName('spatial-anatomy-labels');if(labels)labels.visible=mode==='anatomy';if(mode==='returned'||mode==='finale'){sculpture.applyNarrative({separation:0,burst:0},time);sculpture.model.getObjectByName('BrainLeft').material.opacity=1;sculpture.model.getObjectByName('BrainRight').material.opacity=1;}
   portals.visible=mode==='menu';pageGroup.visible=mode==='finale';
   camera.updateMatrixWorld();const toward=camera.position.clone().sub(new THREE.Vector3(...sculpture.anchors.heart)).normalize(),right=new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,0),up=new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,1),center=new THREE.Vector3(...sculpture.anchors.heart).addScaledVector(toward,.7),depth=camera.position.distanceTo(center),pixel=2*depth*Math.tan(THREE.MathUtils.degToRad(19))/size.height;
   portalMarkers.forEach((group,index)=>{group.position.copy(center).addScaledVector(size.width<700?up:right,(index-1)*(size.width<700?-110:300)*pixel);group.quaternion.copy(camera.quaternion);group.scale.setScalar((size.width<700?32:64)*pixel);});
   bubbles.forEach(group=>group.quaternion.copy(camera.quaternion));plates.forEach(({mesh,index})=>mesh.position.set(-2.7+index*(.45+explode*.8),1.4+index*.08,0));molecule.rotation.set(dockX,dockY,0);ligand.position.x=ligandOffset;
   for(const item of roses){const hovered=hover===item.id;if(hovered&&previousHover!==hover)item.lastBurst=time;item.scale=THREE.MathUtils.damp(item.scale,hovered?1.18:1,6,Math.min(dt,.1));item.group.scale.setScalar(item.scale);item.burstUniform.value=time-item.lastBurst;}previousHover=hover;
   for(const panel of workPanels)panel.group.scale.setScalar(selectedWork===panel.id?1.28:hover===panel.id?1.08:1);
   if(pageGroup.visible){const forward=camera.getWorldDirection(new THREE.Vector3());pageGroup.position.copy(camera.position).addScaledVector(forward,2.6).addScaledVector(right,-1.2);pageGroup.quaternion.copy(camera.quaternion);pages.forEach((page,index)=>{const fold=THREE.MathUtils.smoothstep(age,.2+index*.25,2.4+index*.2);page.pivot.rotation.y=-Math.PI*fold;page.paper.material.opacity=1-THREE.MathUtils.smoothstep(age,2.3,3.2);page.title.material.opacity=page.paper.material.opacity;});}
   const anchors=mode==='menu'?portalMarkers.map((group,index)=>({id:index+1,...project(group.position,size)})):mode==='realm'&&flight>.999?workPanels.filter(panel=>panel.realm===realm).map(panel=>({id:panel.id,...project(panel.group.getWorldPosition(new THREE.Vector3()),size)})):[];
   const cut=isStory&&age<2.3?Math.min(.999,Math.max(.001,age/2.3)):0;
   report={mode,realm,age,flight,paused,selectedWork,holding:holding||!!hover,remaining:mode==='menu'?Math.max(0,3-age):Math.max(0,16-age),anchors,cut,restored:mode==='returned',comicActive:mode==='menu'||isStory,anatomyVisible:showingAnatomy,model:{explode,x:dockX,y:dockY,offset:ligandOffset},assets:{cityTowers:24,realmPanels:9,anatomicalPlates:3,illustrativeProteinResidues:22,ligandAtoms:6,glassRoses:3,pageMeshes:3}};
   document.documentElement.dataset.comicActive=report.comicActive?'true':'false';dispatchEvent(new CustomEvent('portfolio:comic-frame',{detail:report}));return report;
  },
  telemetry(){return report;},
  dispose(){listeners.forEach(([name,fn])=>removeEventListener(name,fn));hiddenRoots.forEach(node=>node.visible=true);resources.forEach(resource=>resource.dispose());scene.remove(root);delete document.documentElement.dataset.comicActive;}
 };
}
