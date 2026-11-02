import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { vertebralLevels, ribPairs } from './anatomy';

// Original upper-body mesh study: lofted glass surfaces, solid bone tubes and
// volumetric organs. No SVG, line material, wireframe material or remote model.
export function createVolumetricAnatomy(scene, renderer, { economy = false } = {}) {
  const model = new THREE.Group(); model.name = 'volumetric-upper-body'; scene.add(model);
  const materials = new Set(), extraGeometries = new Set(), shaders = [];
  function keep(material) { materials.add(material); return material; }
  function spectral(material, strength = .6) {
    material.onBeforeCompile = shader => {
      shader.uniforms.uAnatomyTime = { value: 0 }; shaders.push(shader);
      shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nvarying float vSpectrum; uniform float uAnatomyTime;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvSpectrum = (modelMatrix * vec4(position, 1.0)).x; transformed += normal * sin(position.y * 7.0 + uAnatomyTime * 0.4) * 0.002;');
      shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vSpectrum;')
        .replace('#include <color_fragment>', `#include <color_fragment>\nvec3 spectralTint = mix(vec3(0.015,0.35,1.0), vec3(1.0,0.025,0.13), smoothstep(-0.45,0.45,vSpectrum)); diffuseColor.rgb *= mix(vec3(1.0),spectralTint,${strength.toFixed(2)});`);
    };
    material.customProgramCacheKey = () => `anatomy-spectrum-${strength}`;
    return material;
  }
  const glass = keep(spectral(new THREE.MeshPhysicalMaterial({ color: 0x9eaedb, metalness: .08, roughness: .1,
    transmission: economy ? .25 : .78, thickness: .35, ior: 1.32, clearcoat: 1, clearcoatRoughness: .1,
    transparent: true, opacity: .32, depthWrite: false, envMapIntensity: .8, side: THREE.FrontSide }), .85));
  const bone = keep(spectral(new THREE.MeshPhysicalMaterial({ color: 0xa9b4e0, metalness: .16, roughness: .1,
    transmission: economy ? .15 : .55, thickness: .12, clearcoat: 1,
    transparent: true, opacity: .34, depthWrite: false, envMapIntensity: .65 }), 1));
  glass.name='frosted-glass-shell';bone.name='frosted-glass-skeleton';
  const fiber = keep(spectral(new THREE.MeshBasicMaterial({ color: new THREE.Color(.8,.8,.8), transparent: true,
    opacity: .85, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }), 1));
  const fineFiber = keep(spectral(new THREE.MeshBasicMaterial({ color: new THREE.Color(.7,.7,1), transparent: true,
    opacity: .38, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }), .9));
  const coolOrgan = keep(new THREE.MeshStandardMaterial({ color: 0x104d96, emissive: 0x0876dc, emissiveIntensity: .45,
    roughness: .3, metalness: .12, envMapIntensity: .4 }));
  const warmOrgan = keep(new THREE.MeshStandardMaterial({ color: 0x771e57, emissive: 0xd71780, emissiveIntensity: .45,
    roughness: .3, metalness: .12, envMapIntensity: .4 }));
  const cardiac = keep(new THREE.MeshStandardMaterial({ color: 0x7c1633, emissive: 0xff4622, emissiveIntensity: .75,
    roughness: .23, metalness: .12, envMapIntensity: .5 }));
  function mesh(geometry, material, group = model, name = '') {
    const object = new THREE.Mesh(geometry, material); object.name = name; group.add(object); return object;
  }
  function tube(points, radius, segments = 28) {
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p))), economy ? Math.min(segments,16) : segments, radius, economy ? 4 : 5, false);
  }
  function batch(geometries, material, group = model, name = '') {
    const combined = mergeGeometries(geometries, false);
    geometries.forEach(g => g.dispose()); return mesh(combined, material, group, name);
  }
  // Elliptical anatomical ring lofts give the outer silhouette real normals,
  // volume, refraction and parallax at every viewing angle.
  function loft(profile, segments = 48, subdivisions = 3, face = false) {
    if(economy){segments=Math.min(segments,32);subdivisions=Math.min(subdivisions,2);}
    const points = [], uv = [], indices = [];
    const rows = (profile.length - 1) * subdivisions + 1;
    for (let j = 0; j < rows; j++) {
      const q = j / (rows - 1) * (profile.length - 1), index = Math.min(profile.length - 2, Math.floor(q)), t = q - index;
      const [y, rx, rz] = profile[index].map((v, k) => THREE.MathUtils.lerp(v, profile[index + 1][k], t));
      for (let i = 0; i <= segments; i++) {
        const angle = i / segments * Math.PI * 2, x = Math.cos(angle) * rx;
        let z = Math.sin(angle) * rz;
        if (face && z > 0) {
          z += Math.exp(-((x / .12) ** 2 + ((y - 2.35) / .17) ** 2)) * .17;
          z -= Math.exp(-(((Math.abs(x) - .25) / .15) ** 2 + ((y - 2.52) / .11) ** 2)) * .075;
        }
        points.push(x, y, z); uv.push(i / segments, j / (rows - 1));
        if (j < rows - 1 && i < segments) {
          const a = j * (segments + 1) + i, b = a + segments + 1;
          indices.push(a, a + 1, b, a + 1, b + 1, b);
        }
      }
    }
    const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geometry.setIndex(indices); geometry.computeVertexNormals(); return geometry;
  }
  const shell = new THREE.Group(); shell.name = 'translucent-upper-body-shell'; model.add(shell);
  const body = mesh(loft([[1.92,.22,.22],[1.6,.26,.25],[1.4,.4,.29],[1.2,1.38,.4],[.94,1.4,.43],[.62,1.22,.52],[.05,1.12,.54],[-.65,1.01,.47],[-1.35,.8,.35],[-1.53,.72,.31]]), glass, shell, 'glass-torso');
  body.renderOrder = 5;
  const head = mesh(loft([[3.53,.04,.05],[3.44,.32,.32],[3.23,.56,.5],[2.92,.66,.59],[2.61,.63,.59],[2.36,.52,.54],[2.1,.42,.43],[1.88,.28,.32],[1.79,.12,.17]], 48, 3, true), glass, shell, 'glass-cranial-silhouette');
  head.renderOrder = 5;
  // Real bone geometry: clavicles, sternum, proximal humeri and rib tubes.
  const bones = [];
  for (const side of [-1, 1]) {
    bones.push(tube([[0,1.23,.3],[side*.52,1.35,.19],[side*1.18,1.2,.02],[side*1.42,1.08,0]], .035));
    bones.push(tube([[side*1.43,1.08,0],[side*1.57,.1,.02],[side*1.72,-1.25,.12]], .057));
    for (const rib of ribPairs) {
      const { y, width, type } = rib;
      const points = [[side*.065,y,-.27],[side*width*.65,y+.03,-.5],[side*width,y-.08,-.02]];
      if (type !== 'floating') points.push([side*width*.8,y-.25,.52]);
      points.push(type === 'true' ? [side*.12,y-.2,.54] : type === 'false' ? [side*.23,-.51,.47] : [side*width*.65,y-.2,.16]);
      bones.push(tube(points, .018 + (13 - rib.level) * .0007, 24));
    }
  }
  bones.push(tube([[0,1.24,.31],[0,.86,.51],[0,.25,.57],[0,-.52,.43]],.043));
  batch(bones,bone,model,'solid-thoracic-skeleton');
  const vertebraGeometry = new THREE.CylinderGeometry(.09,.115,.067,10);
  const vertebrae = new THREE.InstancedMesh(vertebraGeometry,bone,vertebralLevels.length); vertebrae.name='C1-C7-T1-T12';
  const transform = new THREE.Object3D();
  vertebralLevels.forEach((v,i)=>{transform.position.set(0,v.y,v.z);transform.rotation.set(Math.PI/2,0,0);transform.scale.setScalar(v.region==='cervical'?.82:1.12);transform.updateMatrix();vertebrae.setMatrixAt(i,transform.matrix);});model.add(vertebrae);
  batch([tube([[0,1.7,-.18],[0,.8,-.3],[0,-.3,-.34],[0,-1.49,-.18]],.025)],fiber,model,'spinal-neural-core');
  const hemispheres=[];
  for (const side of [-1,1]) {
    const group=new THREE.Group();group.position.set(side*.295,2.91,.04);group.name=side<0?'left-cerebral-mesh':'right-cerebral-mesh';model.add(group);hemispheres.push(group);
    const geometry=new THREE.SphereGeometry(1,economy?24:32,economy?16:24), p=geometry.attributes.position;
    for(let i=0;i<p.count;i++){
      const x=p.getX(i),y=p.getY(i),z=p.getZ(i),a=Math.atan2(z,x),b=Math.acos(Math.max(-1,Math.min(1,y)));
      const fold=1+.075*Math.sin(a*11+b*7)+.035*Math.sin(a*19-b*9);
      p.setXYZ(i,x*.31*fold,y*.36*fold,z*.44*fold);
    }
    geometry.computeVertexNormals();mesh(geometry,side<0?coolOrgan:warmOrgan,group,'folded-cerebral-surface');
    const gyri=[];
    for(let j=0;j<9;j++){
      const angle=j/9*Math.PI*2,coords=[];
      for(let k=0;k<=32;k++){
        const a=k/32*Math.PI, wav=angle+Math.sin(a*7+j)*.14;
        coords.push([Math.sin(a)*Math.cos(wav)*.335,Math.cos(a)*.375,Math.sin(a)*Math.sin(wav)*.466]);
      }
      gyri.push(tube(coords,.0065,32));
    }
    batch(gyri,fiber,group,'volumetric-neural-gyri');
  }
  const heart=new THREE.Group();heart.name='radiant-thoracic-core';heart.position.set(.2,.02,.54);heart.rotation.z=.23;model.add(heart);
  const cardiacGeometry=new THREE.SphereGeometry(1,economy?24:32,economy?16:24), cp=cardiacGeometry.attributes.position;
  for(let i=0;i<cp.count;i++){
    const x=cp.getX(i),y=cp.getY(i),z=cp.getZ(i),taper=.8+.2*y;
    cp.setXYZ(i,x*.4*taper,y*.52-.04,z*.31*taper);
  }
  cardiacGeometry.computeVertexNormals();mesh(cardiacGeometry,cardiac,heart,'ventricular-mesh');
  const interiorMaterial=keep(new THREE.ShaderMaterial({uniforms:{uTime:{value:0}},side:THREE.BackSide,depthWrite:false,
    vertexShader:`varying vec3 vP;void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`uniform float uTime;varying vec3 vP;void main(){
      float fold=pow(.5+.5*sin(vP.y*65.+sin(vP.x*41.)*2.+sin(vP.z*49.)),9.);
      float glow=.5+.5*sin(uTime*1.1+vP.y*7.);
      vec3 color=mix(vec3(.035,.008,.04),vec3(.22,.025,.065),fold);
      color+=vec3(.09,.025,.008)*glow;gl_FragColor=vec4(color,1.);}` }));
  const interior=mesh(new THREE.SphereGeometry(1,20,12),interiorMaterial,heart,'cardiac-interior-volume');
  interior.scale.set(.28,.4,.25);interior.position.y=-.04;
  const innerVessels=[];
  for(let i=0;i<8;i++){const x=-.14+i*.04;innerVessels.push(tube([[x,.25,-.12],[x+Math.sin(i)*.07,.07,.04],[x-.03,-.12,-.09],[x*.4,-.31,-.04]],.004,20));}
  batch(innerVessels,fiber,heart,'inner-vascular-chamber');
  for(const side of [-1,1]){const atrium=mesh(new THREE.SphereGeometry(.13,12,8),cardiac,heart,'atrial-lobe');atrium.position.set(side*.19,.33,-.02);atrium.scale.set(1,1,.8);}
  const coronary=[tube([[.03,.24,.12],[.17,.66,.01],[-.1,.79,-.05],[-.34,.57,-.12],[-.34,.04,-.18]],.045),
    tube([[-.13,.27,.16],[-.24,.5,.17],[.04,.57,.12],[.43,.47,-.06]],.032),
    tube([[-.17,.25,.27],[.07,.05,.32],[.13,-.2,.26],[.04,-.48,.08]],.013)];
  for(const x of [-.1,0,.1])coronary.push(tube([[x,.7,-.03],[x-.025,.95,-.06]],.018));
  batch(coronary,fiber,heart,'luminous-coronary-vessels');
  const vessels=[];
  for(const side of [-1,1]){
    vessels.push(tube([[.12,.3,.59],[side*.12,.98,.34],[side*.14,1.63,.14],[side*.24,2.15,.16],[side*.3,2.59,.13]],.014));
    vessels.push(tube([[side*.12,1.0,.34],[side*.64,1.27,.2],[side*1.35,1.08,.14],[side*1.51,.1,.16],[side*1.67,-1.24,.17]],.012));
    vessels.push(tube([[.13,.21,.5],[side*.25,-.35,.36],[side*.23,-.93,.16],[side*.3,-1.43,.08]],.012));
  }
  batch(vessels,fiber,model,'inner-upper-body-vascular-tree');
  // Bioluminescent floral roots occupy real depth behind the cranial vault.
  const roots=[], tips=[];
  function root(x,y,z,angle,length,depth){
    if(!depth)return;
    const end=[x+Math.cos(angle)*length,y+Math.sin(angle)*length,z+Math.sin(angle)*.08];
    roots.push(tube([[x,y,z],[(x+end[0])/2+Math.sin(angle)*.04,(y+end[1])/2,z-.04],end],.005,8));
    if(depth===1)tips.push(end);
    root(...end,angle+.45,length*.68,depth-1);root(...end,angle-.48,length*.7,depth-1);
  }
  root(-.4,2.7,-.58,2.6,.43,4);root(.4,2.7,-.58,.55,.43,4);
  batch(roots,fineFiber,model,'bioluminescent-floral-root-mesh');
  const petals=new THREE.InstancedMesh(new THREE.OctahedronGeometry(.04),fiber,tips.length*3);
  tips.forEach((tip,i)=>{for(let j=0;j<3;j++){transform.position.set(...tip);transform.rotation.set(.4,j*2.1,i*.6);transform.scale.set(.45,1.6,.65);transform.updateMatrix();petals.setMatrixAt(i*3+j,transform.matrix);}});petals.name='floral-crystal-petals';model.add(petals);
  // Botanical glass reference: flowers and winding roots live *inside* the
  // cranial/upper-body silhouette, rather than becoming an exterior wire halo.
  const flowerCenters=[[-.3,3.13,.28],[.23,3.17,-.13],[-.43,2.82,.3],[.34,2.61,.29],[-.1,2.33,.35],[.1,2.05,.13],
    [-1.04,1.12,.28],[.98,1.08,.3],[-.77,.75,.34],[.77,.67,.35],[-.74,.2,.38],[.78,.15,.36],[-.65,-.35,.34],[.7,-.45,.32],
    [-.53,-.93,.18],[.54,-.99,.21],[-1.45,.65,.08],[1.45,.53,.1],[-1.59,-.2,.12],[1.61,-.35,.16]];
  const floralMaterial=keep(new THREE.MeshPhysicalMaterial({color:0xffffff,metalness:.18,roughness:.1,clearcoat:1,
    transmission:economy?.15:.42,thickness:.035,emissive:0x33194d,emissiveIntensity:.5,transparent:true,opacity:.85}));
  const blossomGeometry=new THREE.SphereGeometry(1,8,6);
  const blossoms=new THREE.InstancedMesh(blossomGeometry,floralMaterial,flowerCenters.length*6);
  const flowerColors=[0x9449ff,0xff2bba,0x2bd9ff,0xffa727,0xcf42ff,0x74cda5];
  const stems=[];
  flowerCenters.forEach((center,i)=>{
    const size=i<6?.075:i<16?.105:.08;
    for(let j=0;j<6;j++){
      const angle=j/6*Math.PI*2;
      transform.position.set(center[0]+Math.cos(angle)*size*.65,center[1]+Math.sin(angle)*size*.65,center[2]+Math.sin(j)*.01);
      transform.rotation.set(.35,Math.sin(i)*.4,angle-Math.PI/2);transform.scale.set(size*.42,size,size*.24);transform.updateMatrix();
      blossoms.setMatrixAt(i*6+j,transform.matrix);blossoms.setColorAt(i*6+j,new THREE.Color(flowerColors[i%flowerColors.length]));
    }
    const rootX=center[0]*.38,rootY=center[1]>.9?center[1]-.48:center[1]-.35;
    stems.push(tube([[rootX,rootY,center[2]-.15],[(rootX+center[0])/2,center[1]-.18,center[2]-.07],center],.006,12));
  });
  blossoms.name='internal-jewel-flowers';model.add(blossoms);batch(stems,fiber,model,'floral-vascular-stems');
  const leaves=new THREE.InstancedMesh(new THREE.SphereGeometry(1,6,4),floralMaterial,flowerCenters.length*2);
  flowerCenters.forEach((p,i)=>{for(let j=0;j<2;j++){
    transform.position.set(p[0]+(j?-.06:.06),p[1]-.17,p[2]-.04);transform.rotation.set(.5,.3,j?.7:-.7);transform.scale.set(.025,.095,.018);transform.updateMatrix();
    leaves.setMatrixAt(i*2+j,transform.matrix);leaves.setColorAt(i*2+j,new THREE.Color(i%2?0x487a68:0x645c9e));
  }});leaves.name='translucent-floral-leaves';model.add(leaves);
  // Luminous cellular particles are distributed through two real lung volumes.
  // They supply the reference's rich inner-chest colour without flat textures.
  const lungMaterial=keep(spectral(new THREE.MeshPhysicalMaterial({color:0x67278c,roughness:.1,clearcoat:1,
    transmission:economy?.2:.62,thickness:.14,transparent:true,opacity:.2,emissive:0x3f0b5c,emissiveIntensity:.35}),.65));
  for(const side of [-1,1]){
    const lung=mesh(new THREE.SphereGeometry(1,economy?16:24,economy?12:16),lungMaterial,model,'glowing-lung-volume');
    lung.position.set(side*.49,.12,.06);lung.scale.set(.37,.75,.33);lung.rotation.z=side*-.1;
  }
  const cellularPositions=[],cellularColors=[];
  let randomSeed=91;const random=()=>{randomSeed=randomSeed*16807%2147483647;return randomSeed/2147483647;};
  const cellularCount=economy?800:1800;
  for(let i=0;i<cellularCount;i++){
    const side=i%2?-1:1,angle=random()*Math.PI*2,latitude=Math.acos(2*random()-1),radius=Math.cbrt(random());
    cellularPositions.push(side*.49+Math.cos(angle)*Math.sin(latitude)*radius*.35,.12+Math.cos(latitude)*radius*.72,.06+Math.sin(angle)*Math.sin(latitude)*radius*.31);
    const tint=new THREE.Color(flowerColors[(i+(side<0?2:1))%flowerColors.length]);cellularColors.push(tint.r,tint.g,tint.b);
  }
  const cellularGeometry=new THREE.BufferGeometry();cellularGeometry.setAttribute('position',new THREE.Float32BufferAttribute(cellularPositions,3));cellularGeometry.setAttribute('aTint',new THREE.Float32BufferAttribute(cellularColors,3));
  const cellularMaterial=keep(new THREE.ShaderMaterial({uniforms:{uTime:{value:0}},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
    vertexShader:`uniform float uTime;attribute vec3 aTint;varying vec3 vTint;void main(){vTint=aTint;vec3 p=position;p.z+=sin(uTime*.7+p.y*8.)*.015;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(20./-mv.z,1.,5.);}`,
    fragmentShader:`varying vec3 vTint;void main(){float d=length(gl_PointCoord-.5);float glow=exp(-d*8.);gl_FragColor=vec4(vTint*1.7,glow*.75);}`}));
  model.add(new THREE.Points(cellularGeometry,cellularMaterial));
  const cell=new THREE.Group();cell.position.set(-1.0,2.35,.18);model.add(cell);
  const membrane=mesh(new THREE.SphereGeometry(.22,16,12),glass,cell,'lipid-membrane');
  const ligand=new THREE.Group();ligand.position.set(1.0,.8,.65);model.add(ligand);
  const atomGeo=new THREE.SphereGeometry(.035,8,6),atoms=new THREE.InstancedMesh(atomGeo,coolOrgan,8),bond=[];
  const atomPositions=Array.from({length:8},(_,i)=>[Math.cos(i/6*Math.PI*2)*(.2+i*.003),Math.sin(i/6*Math.PI*2)*.2,Math.sin(i)*.04]);
  atomPositions.forEach((p,i)=>{transform.position.set(...p);transform.rotation.set(0,0,0);transform.scale.setScalar(1);transform.updateMatrix();atoms.setMatrixAt(i,transform.matrix);if(i<7)bond.push(tube([p,atomPositions[(i+1)%8]],.01,4));});ligand.add(atoms);batch(bond,fiber,ligand,'molecular-bonds');
  const lightRig=new THREE.Group();scene.add(lightRig);
  lightRig.add(new THREE.AmbientLight(0xa9b9d5,.4));
  const coolLight=new THREE.PointLight(0x3ccfff,24,15,1.8);coolLight.position.set(-3,2.5,3);lightRig.add(coolLight);
  const violetLight=new THREE.PointLight(0x835bff,14,12,1.8);violetLight.position.set(-2,-.4,-1.5);lightRig.add(violetLight);
  const warmLight=new THREE.PointLight(0xff197b,28,15,1.8);warmLight.position.set(3,1.8,2);lightRig.add(warmLight);
  const amberLight=new THREE.PointLight(0xffad47,18,12,1.8);amberLight.position.set(2,-1,2.5);lightRig.add(amberLight);
  const coreLight=new THREE.PointLight(0xff8e48,.35,4,1.6);heart.add(coreLight);coreLight.position.z=.55;
  // A local studio environment supplies real physical refraction/highlights.
  // Small local cubemap, prefiltered at 64px. This preserves genuine physical
  // glass reflections without rendering a large studio scene during startup.
  const faces=[];
  for(const color of ['#227fa8','#b34e88','#61738f','#080a16','#1e1931','#111729']){
    const image=document.createElement('canvas');image.width=64;image.height=64;
    const ctx=image.getContext('2d'),gradient=ctx.createLinearGradient(0,0,64,64);
    gradient.addColorStop(0,'#050713');gradient.addColorStop(.48,color);gradient.addColorStop(.58,'#b0bad0');gradient.addColorStop(.68,color);gradient.addColorStop(1,'#050713');
    ctx.fillStyle=gradient;ctx.fillRect(0,0,64,64);faces.push(image);
  }
  const cube=new THREE.CubeTexture(faces);cube.colorSpace=THREE.SRGBColorSpace;cube.needsUpdate=true;
  const pmrem=new THREE.PMREMGenerator(renderer),env=pmrem.fromCubemap(cube);scene.environment=env.texture;pmrem.dispose();cube.dispose();
  const particleGeometry=new THREE.BufferGeometry(),particlePositions=[];
  for(let i=0;i<180;i++)particlePositions.push(Math.sin(i*2.4)*(.12+i%9*.08),(i/180)*4.8-1.3,Math.cos(i*1.7)*.42);
  particleGeometry.setAttribute('position',new THREE.Float32BufferAttribute(particlePositions,3));
  const particleMaterial=keep(new THREE.ShaderMaterial({uniforms:{uTime:{value:0}},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
    vertexShader:`uniform float uTime;varying float vSide;void main(){vec3 p=position;p.y=mod(p.y+1.3+uTime*.13,4.8)-1.3;p.x+=sin(p.y*5.+uTime*.6)*.04;vSide=smoothstep(-.3,.3,p.x);vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(20./-mv.z,1.,5.);}`,
    fragmentShader:`varying float vSide;void main(){float a=smoothstep(.5,.02,length(gl_PointCoord-.5));gl_FragColor=vec4(mix(vec3(.4,.9,1.),vec3(1.,.5,.7),vSide),a*.65);}`}));
  model.add(new THREE.Points(particleGeometry,particleMaterial));
  return {model,heart,cell,ligand,shell,
    useEconomyGlass(){glass.transmission=.25;bone.transmission=.15;glass.needsUpdate=true;bone.needsUpdate=true;},
    update(time,energy){
      shaders.forEach(s=>{s.uniforms.uAnatomyTime.value=time;});particleMaterial.uniforms.uTime.value=time;interiorMaterial.uniforms.uTime.value=time;cellularMaterial.uniforms.uTime.value=time;
      const beat=Math.max(0,Math.sin(time*5.8))**10+.35*Math.max(0,Math.sin(time*5.8-.9))**12;
      heart.scale.setScalar(1+beat*.065);cardiac.emissiveIntensity=.7+beat*.5;coreLight.intensity=.3+beat*.2;
      coolLight.position.z=3+Math.sin(time*.17)*.4;warmLight.position.y=1.8+Math.sin(time*.13)*.3;
      coolLight.intensity=24+Math.abs(energy)*2;amberLight.intensity=18+beat*2;
      cell.rotation.y=time*.17;ligand.rotation.y=time*.22;
    },
    dispose(){model.traverse(o=>{if(o.geometry)extraGeometries.add(o.geometry);});extraGeometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());env.dispose();scene.environment=null;scene.remove(model,lightRig);}
  };
}
