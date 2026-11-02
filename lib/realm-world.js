import * as THREE from 'three';
import { techProjects, creativeProjects } from './projects';

const COLORS = { cyan: new THREE.Color('#00F0FF'), violet: new THREE.Color('#7B2CBF'), pink: new THREE.Color('#FF007F'), amber: new THREE.Color('#FFB703') };

export function createSpatialLabel(text, { font = '--font-jetbrains', color = '#a6efff', width = 2.4 } = {}) {
  const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 128;
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, depthTest: false, toneMapped: false });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, width / 8), material); mesh.name = `spatial-text:${text}`;
  let disposed = false, currentText = text;
  const draw = () => {
    if (disposed) return;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, 1024, 128);
    const family = getComputedStyle(document.body).getPropertyValue(font).trim() || 'monospace';
    ctx.font = `500 48px ${family}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.shadowColor = color; ctx.shadowBlur = 12; ctx.fillStyle = color;
    ctx.fillText(currentText, 512, 64, 960); texture.needsUpdate = true;
  };
  draw(); document.fonts.ready.then(draw);
  return { mesh, setText(value) { if (value !== currentText) { currentText = value; draw(); } }, dispose() { disposed = true; mesh.geometry.dispose(); material.dispose(); texture.dispose(); } };
}

export function createRealmWorld(scene, { economy = false } = {}) {
  const root = new THREE.Group(); root.name = 'dual-realm-world'; root.visible = false; scene.add(root);
  const tech = new THREE.Group(), creative = new THREE.Group(); root.add(tech, creative);
  const materials = new Set(), geometries = new Set(), textures = new Set(), labels = [];
  const keep = material => { materials.add(material); return material; };
  const geo = geometry => { geometries.add(geometry); return geometry; };
  const transform = new THREE.Object3D();
  let seed = 39; const random = () => { seed = seed * 16807 % 2147483647; return seed / 2147483647; };

  // Instanced voxel double helix: both strands and rungs occupy true 3D space.
  const voxelMaterial = keep(new THREE.ShaderMaterial({ transparent: true, depthWrite: true,
    uniforms: { uTime: { value: 0 }, uOpacity: { value: 1 } },
    vertexShader: `uniform float uTime;varying vec3 vP;varying vec3 vN;void main(){vec3 p=position;vec4 world=instanceMatrix*vec4(p,1.);world.xyz+=normalize(world.xyz+.001)*sin(world.y*7.+uTime)*.035;vP=world.xyz;vN=normalMatrix*normal;gl_Position=projectionMatrix*modelViewMatrix*world;}`,
    fragmentShader: `uniform float uOpacity;varying vec3 vP;varying vec3 vN;void main(){vec3 c=mix(vec3(0.,.94,1.),vec3(.48,.17,.75),smoothstep(-.4,.5,vP.x));float edge=.4+.6*abs(dot(normalize(vN),vec3(.2,.5,1.)));gl_FragColor=vec4(c*(.55+edge),uOpacity);}`
  }));
  const steps = economy ? 36 : 58, count = steps * 4;
  const helix = new THREE.InstancedMesh(geo(new THREE.BoxGeometry(.105,.105,.105)), voxelMaterial, count); helix.name = 'voxel-dna-double-helix';
  for (let i = 0; i < steps; i++) {
    const y = i / (steps - 1) * 3.7 - 1.85, angle = i / steps * Math.PI * 5;
    for (let strand = 0; strand < 2; strand++) {
      const a = angle + strand * Math.PI;
      transform.position.set(Math.cos(a) * .73, y, Math.sin(a) * .73); transform.rotation.set(0, a, Math.PI / 4); transform.scale.setScalar(1);
      transform.updateMatrix(); helix.setMatrixAt(i * 4 + strand, transform.matrix);
      transform.position.set(Math.cos(a) * .27, y, Math.sin(a) * .27); transform.scale.set(.7,.4,4.6); transform.rotation.set(0, -a + Math.PI / 2, 0);
      transform.updateMatrix(); helix.setMatrixAt(i * 4 + 2 + strand, transform.matrix);
    }
  }
  tech.add(helix);
  const cellMaterial = keep(new THREE.MeshBasicMaterial({ color: '#00F0FF', wireframe: true, transparent: true, opacity: .16 }));
  const bioCell = new THREE.Mesh(geo(new THREE.IcosahedronGeometry(.52,1)), cellMaterial); bioCell.position.set(1.2,.65,-.7); bioCell.name='voxel-bio-cell'; tech.add(bioCell);

  // Matrix rain uses square WebGL point sprites. Persistent world-space velocity
  // and a spring back to the stream provide genuine pointer repulsion.
  const rainCount = economy ? 300 : 850, rainPositions = new Float32Array(rainCount * 3), rainRest = new Float32Array(rainCount * 3), rainVelocity = new Float32Array(rainCount * 2), rainSeeds = new Float32Array(rainCount);
  for (let i=0;i<rainCount;i++) { rainPositions.set([(random()-.5)*12,(random()-.5)*8,-1.5-random()*4],i*3); rainRest.set(rainPositions.subarray(i*3,i*3+3),i*3);rainSeeds[i]=random(); }
  const rainGeometry=geo(new THREE.BufferGeometry());rainGeometry.setAttribute('position',new THREE.BufferAttribute(rainPositions,3));rainGeometry.setAttribute('aSeed',new THREE.BufferAttribute(rainSeeds,1));
  const rainMaterial=keep(new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
    uniforms:{uTime:{value:0},uOpacity:{value:1},uPixelRatio:{value:1}},
    vertexShader:`attribute float aSeed;uniform float uTime;uniform float uPixelRatio;varying float vSeed;void main(){vSeed=aSeed;vec3 p=position;p.y=mod(p.y-uTime*(.3+aSeed*.5)+4.,8.)-4.;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp((15.+aSeed*12.)/-mv.z,1.,6.)*uPixelRatio;}`,
    fragmentShader:`uniform float uOpacity;varying float vSeed;void main(){vec2 q=floor(gl_PointCoord*3.);float cut=step(.15,fract(vSeed*11.+q.x*.34+q.y*.51));vec3 c=mix(vec3(0.,.94,1.),vec3(.48,.17,.75),vSeed);gl_FragColor=vec4(c,cut*(.12+vSeed*.45)*uOpacity);}`
  }));const rain=new THREE.Points(rainGeometry,rainMaterial);rain.name='matrix-pixel-stream';tech.add(rain);

  // Liquid-glass vinyl: refraction is procedural and the three color channels
  // sample different displaced normals, producing actual RGB separation.
  const orbMaterial=keep(new THREE.ShaderMaterial({transparent:true,depthWrite:true,
    uniforms:{uTime:{value:0},uOpacity:{value:0},uPointer:{value:new THREE.Vector2()}},
    vertexShader:`uniform float uTime;varying vec3 vNormal;varying vec3 vWorld;void main(){vec3 p=position;float n=sin(p.x*5.+uTime*.6)*sin(p.y*6.-uTime*.5)*sin(p.z*5.+uTime*.3);p+=normal*n*.09;vNormal=normalize(normalMatrix*normal);vWorld=p;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
    fragmentShader:`uniform float uTime;uniform float uOpacity;uniform vec2 uPointer;varying vec3 vNormal;varying vec3 vWorld;float band(vec3 p,float shift){return .5+.5*sin(p.y*15.+p.x*6.+p.z*5.+uTime*.7+shift);}void main(){vec3 n=normalize(vNormal);float f=pow(1.-abs(n.z),2.);vec3 rgb=vec3(band(vWorld+n*.08,0.),band(vWorld+n*.13,1.6),band(vWorld+n*.19,3.2));vec3 prism=mix(vec3(1.,0.,.498),vec3(1.,.718,.012),rgb.r);prism=mix(prism,rgb,.4);float highlight=pow(max(0.,dot(n,normalize(vec3(uPointer*.3+.5,1.)))),14.);gl_FragColor=vec4(prism*(.3+f*1.5)+highlight*.8,(.3+f*.6)*uOpacity);}`
  }));
  const orb=new THREE.Mesh(geo(new THREE.IcosahedronGeometry(1.04,economy?3:4)),orbMaterial);orb.name='chromatic-liquid-glass-orb';creative.add(orb);
  const vinylMaterial=keep(new THREE.MeshBasicMaterial({color:'#FF007F',transparent:true,opacity:0,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false}));
  const vinyl=new THREE.Group(); vinyl.rotation.set(.8,.3,.15);vinyl.name='neon-vinyl-grooves';creative.add(vinyl);
  for(let i=0;i<9;i++) {const ring=new THREE.Mesh(geo(new THREE.TorusGeometry(1.19+i*.055,.006,3,96)),vinylMaterial);vinyl.add(ring);}
  const stickerTexture=(() => {
    const c=document.createElement('canvas');c.width=64;c.height=64;const ctx=c.getContext('2d');
    ctx.fillStyle='#FFB703';const pixels=[[3,0],[2,1],[3,1],[4,1],[1,2],[2,2],[3,2],[4,2],[5,2],[2,3],[3,3],[4,3],[3,4],[2,5],[4,5]];
    pixels.forEach(([x,y])=>ctx.fillRect(x*8+4,y*8+8,7,7));const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;t.colorSpace=THREE.SRGBColorSpace;textures.add(t);return t;
  })();
  const stickerMaterial=keep(new THREE.MeshBasicMaterial({map:stickerTexture,transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide,toneMapped:false}));
  const stickers=[];
  for(let i=0;i<7;i++) {const sticker=new THREE.Mesh(geo(new THREE.PlaneGeometry(.33,.33)),stickerMaterial);sticker.position.set(Math.cos(i*2.4)*(1.6+i*.08),Math.sin(i*2.4)*1.5,-.8+i%3*.6);sticker.userData.phase=i*1.4;sticker.name='pixel-depth-sticker';creative.add(sticker);stickers.push(sticker);}

  // Bounded pooled click VFX: no new geometry, light or material per click.
  const burstCapacity=192, burstPositions=new Float32Array(burstCapacity*3),burstColors=new Float32Array(burstCapacity*3),burstLife=new Float32Array(burstCapacity),burstVelocity=new Float32Array(burstCapacity*3);
  burstPositions.fill(999);
  const burstGeometry=geo(new THREE.BufferGeometry());burstGeometry.setAttribute('position',new THREE.BufferAttribute(burstPositions,3));burstGeometry.setAttribute('color',new THREE.BufferAttribute(burstColors,3));burstGeometry.setAttribute('aLife',new THREE.BufferAttribute(burstLife,1));
  const burstMaterial=keep(new THREE.ShaderMaterial({transparent:true,depthWrite:false,vertexColors:true,blending:THREE.AdditiveBlending,
    vertexShader:`attribute float aLife;varying vec3 vColor;varying float vLife;void main(){vColor=color;vLife=aLife;vec4 p=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*p;gl_PointSize=clamp(30./-p.z,2.,9.)*step(.001,aLife);}`,
    fragmentShader:`varying vec3 vColor;varying float vLife;void main(){gl_FragColor=vec4(vColor*1.5,min(1.,vLife*2.));}`}));
  const bursts=new THREE.Points(burstGeometry,burstMaterial);bursts.name='pooled-electric-spray-bursts';root.add(bursts);
  const flash=new THREE.PointLight('#00F0FF',0,5,2);root.add(flash);let cursor=0,burstCount=0,repulsion=0;

  const projectLabels={tech:[],creative:[]};
  for(const [realm,projects] of [['tech',techProjects],['creative',creativeProjects]]) {
    for(const [i,project] of projects.entries()) {
      const label=createSpatialLabel(`${project.number} / ${project.category.toUpperCase()}`,{font:realm==='tech'?'--font-jetbrains':'--font-syne',color:realm==='tech'?'#87f5ff':'#ffc29d',width:3.6});
      label.mesh.position.set(0,2.05,-.4);label.mesh.visible=false;root.add(label.mesh);labels.push(label);projectLabels[realm].push(label);
    }
  }
  const telemetry=createSpatialLabel('[STATUS: ACTIVE] / X 0.500 / Y 0.500',{width:2.5,color:'#8ecbd9'});
  telemetry.mesh.position.set(0,-2.2,.2);root.add(telemetry.mesh);labels.push(telemetry);let telemetryAt=0;
  const crtMaterial=keep(new THREE.MeshBasicMaterial({color:'#00F0FF',transparent:true,opacity:.12,depthWrite:false}));
  const crt=[];
  // Open CRT calibration arcs, not rectangular UI frames.
  for(let i=0;i<3;i++){const arc=new THREE.Mesh(geo(new THREE.TorusGeometry(1.55+i*.2,.003,3,64,Math.PI*.63)),crtMaterial);arc.rotation.set(.4+i*.5,i*.5,i*2);tech.add(arc);crt.push(arc);}

  return {
    root, tech, creative,
    burst(ndc,camera,warm) {
      const origin=new THREE.Vector3(ndc.x,ndc.y,.45).unproject(camera),direction=origin.sub(camera.position).normalize();origin.copy(camera.position).addScaledVector(direction,6);
      root.worldToLocal(origin);const count=warm?64:40;
      for(let i=0;i<count;i++){const k=cursor++%burstCapacity,a=random()*Math.PI*2,speed=(warm?.7:1.5)+random()*2.2;
        burstPositions.set(origin.toArray(),k*3);burstVelocity.set([Math.cos(a)*speed,Math.sin(a)*speed,(random()-.5)*2],k*3);burstLife[k]=.65+random()*.65;
        const color=warm?(i%2?COLORS.pink:COLORS.amber):(i%2?COLORS.cyan:COLORS.violet);burstColors.set([color.r,color.g,color.b],k*3);
      }
      flash.position.copy(origin);flash.color.copy(warm?COLORS.pink:COLORS.cyan);flash.intensity=8;burstCount++;
    },
    update(time,delta,{blend,opacity,pointer,project=0,pixelRatio=1},camera) {
      root.visible=opacity>.002;if(!root.visible)return;
      telemetry.mesh.quaternion.copy(camera.quaternion);telemetry.mesh.material.opacity=opacity*.55;
      if(time-telemetryAt>.12){telemetry.setText(`[STATUS: ACTIVE] / X ${(pointer.x+.5).toFixed(3)} / Y ${(.5-pointer.y).toFixed(3)}`);telemetryAt=time;}
      const dt=Math.min(delta,.05),cool=opacity*(1-blend),warm=opacity*blend;
      tech.visible=cool>.002;creative.visible=warm>.002;
      voxelMaterial.uniforms.uTime.value=time;voxelMaterial.uniforms.uOpacity.value=cool;
      helix.rotation.y=time*.13;helix.rotation.z=Math.sin(time*.17)*.04;bioCell.rotation.set(time*.08,time*.18,0);cellMaterial.opacity=cool*.16;
      rainMaterial.uniforms.uTime.value=time;rainMaterial.uniforms.uOpacity.value=cool;rainMaterial.uniforms.uPixelRatio.value=pixelRatio;
      const mouseX=pointer.x*8,mouseY=pointer.y*5;
      repulsion=0;
      for(let i=0;i<rainCount;i++){
        const k=i*3,v=i*2,y=((rainRest[k+1]-time*(.3+rainSeeds[i]*.5)+4)%8+8)%8-4;
        const dx=rainPositions[k]-mouseX,dy=y-mouseY,distance=Math.hypot(dx,dy),force=Math.max(0,1-distance/1.4);
        rainVelocity[v]+=(dx/(distance+.05)*force*8-(rainPositions[k]-rainRest[k])*3)*dt;rainVelocity[v]*=Math.exp(-dt*5);rainPositions[k]+=rainVelocity[v]*dt;
        rainVelocity[v+1]+=(dy/(distance+.05)*force*4-(rainPositions[k+2]-rainRest[k+2])*3)*dt;rainVelocity[v+1]*=Math.exp(-dt*5);rainPositions[k+2]+=rainVelocity[v+1]*dt;
        repulsion=Math.max(repulsion,force);
      }
      rainGeometry.attributes.position.needsUpdate=true;
      orbMaterial.uniforms.uTime.value=time;orbMaterial.uniforms.uOpacity.value=warm;orbMaterial.uniforms.uPointer.value.set(pointer.x,pointer.y);
      orb.rotation.set(time*.08,time*.19,Math.sin(time*.2)*.1);vinyl.rotation.z=time*.23;vinylMaterial.opacity=warm*.3;stickerMaterial.opacity=warm*.75;
      stickers.forEach(s=>{s.rotation.set(Math.sin(time*.3+s.userData.phase)*.3,time*.14+s.userData.phase,Math.sin(time*.4+s.userData.phase)*.14);s.position.y+=Math.sin(time*.7+s.userData.phase)*dt*.045;});
      for(const realm of ['tech','creative'])projectLabels[realm].forEach((label,i)=>{label.mesh.visible=i===project&&(realm==='tech'?cool:warm)>.05;label.mesh.material.opacity=realm==='tech'?cool:warm;label.mesh.quaternion.copy(camera.quaternion);});
      crtMaterial.opacity=cool*.13;crt.forEach((arc,i)=>arc.rotation.z+=dt*.025*(i+1));
      for(let i=0;i<burstCapacity;i++)if(burstLife[i]>0){burstLife[i]=Math.max(0,burstLife[i]-dt);for(let axis=0;axis<3;axis++)burstPositions[i*3+axis]+=burstVelocity[i*3+axis]*dt;burstVelocity[i*3+1]-=blend*dt*.9;}
      burstGeometry.attributes.position.needsUpdate=true;burstGeometry.attributes.color.needsUpdate=true;burstGeometry.attributes.aLife.needsUpdate=true;flash.intensity*=Math.exp(-delta*8);
    },
    diagnostics(){return{burstCount,repulsion,pooledParticles:burstCapacity,rainParticles:rainCount,labels:labels.length};},
    dispose(){labels.forEach(label=>label.dispose());geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());scene.remove(root);}
  };
}

export function createAmbientField() {
  const scene=new THREE.Scene(),camera=new THREE.Camera();
  const material=new THREE.ShaderMaterial({depthWrite:false,depthTest:false,uniforms:{uTime:{value:0},uWarmth:{value:0},uPointer:{value:new THREE.Vector2()},uAspect:{value:1}},
    vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,
    fragmentShader:`varying vec2 vUv;uniform float uTime;uniform float uWarmth;uniform vec2 uPointer;uniform float uAspect;void main(){vec2 p=vUv-.5;p.x*=uAspect;vec2 drift=uPointer*.1;float a=exp(-length((p-drift-vec2(-.23,.16))*vec2(1.5,1.))*4.);float b=exp(-length(p+drift-vec2(.33,-.2))*4.5);float beam=pow(max(0.,1.-abs(sin(p.x*1.8+p.y*.8+uTime*.035))),16.);vec3 cool=vec3(0.,.18,.28)*a+vec3(.09,.018,.19)*b;vec3 warm=vec3(.28,0.,.09)*a+vec3(.25,.1,.005)*b;vec3 c=vec3(.0118,.0118,.0196)+mix(cool,warm,uWarmth)*(.65+beam*.18);gl_FragColor=vec4(c,1.);}`});
  const geometry=new THREE.PlaneGeometry(2,2);scene.add(new THREE.Mesh(geometry,material));
  return {scene,camera,update(time,warmth,pointer,aspect){material.uniforms.uTime.value=time;material.uniforms.uWarmth.value=warmth;material.uniforms.uPointer.value.set(pointer.x,pointer.y);material.uniforms.uAspect.value=aspect;},dispose(){geometry.dispose();material.dispose();}};
}
