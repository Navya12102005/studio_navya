import * as THREE from 'three';
import {CRYSTAL_OPTICS} from './crystal-optics';
import {cardiacPulse} from './spiral-camera';

// The anatomy comes exclusively from the authored, licensed GLB. This adapter
// only clones imported nodes, replaces materials and adds studio/chest lights.
export function createImportedAnatomy(scene, renderer, asset) {
  const model = asset.clone(true);
  model.name = 'imported-upper-body';
  const glass = new THREE.MeshPhysicalMaterial({
    name: 'imported-crystal-skeleton', color: 0xe6edf4,
    ...CRYSTAL_OPTICS,
    metalness: 0, transparent: true, opacity: 1,
    depthWrite: true, envMapIntensity: .8,
    emissive: 0x07111e, emissiveIntensity: .15
  });
  const gold = glass.clone(); gold.name='imported-amber-bone'; gold.emissive.set('#FFB703'); gold.emissiveIntensity=.18;
  const cardiac = glass.clone(); cardiac.name = 'imported-crystal-heart';
  cardiac.emissive.set('#FFB703'); cardiac.emissiveIntensity = .35;
  const cerebral = glass.clone(); cerebral.name = 'imported-crystal-brain';
  cerebral.emissive.set('#FF007F'); cerebral.emissiveIntensity = .15;
  const cerebralRight=cerebral.clone();cerebralRight.name='imported-crystal-brain-right';
  const materials=[glass,gold,cardiac,cerebral,cerebralRight];
  const hemisphereCyan=new THREE.Color('#00F0FF'),hemisphereViolet=new THREE.Color('#7B2CBF');
  const shaders=[];
  for (const material of materials) {
    material.onBeforeCompile = shader => {
      shader.uniforms.uSplit={value:0};shader.uniforms.uHemisphere={value:material===cerebralRight?1:0};shader.uniforms.uRealm={value:0};shader.uniforms.uTime={value:0};shader.uniforms.uBrain={value:material===cerebral||material===cerebralRight?1:0};shader.uniforms.uGold={value:material===gold?1:0};shaders.push(shader);
      shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nvarying float vCrystalWorldX; varying float vCrystalWorldY; uniform float uRealm; uniform float uTime; uniform float uBrain; uniform float uGold; uniform float uSplit; uniform float uHemisphere;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed += objectNormal * uBrain * sin(uTime * 2.5) * sin(position.y * 13.0 + position.x * 9.0) * 0.012;\nvCrystalWorldX = (modelMatrix * vec4(position, 1.0)).x; vCrystalWorldY = (modelMatrix * vec4(position, 1.0)).y;');
      shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vCrystalWorldX; varying float vCrystalWorldY; uniform float uRealm; uniform float uTime; uniform float uBrain; uniform float uGold; uniform float uSplit; uniform float uHemisphere;')
        .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
          float side = smoothstep(-0.7,0.7,vCrystalWorldX);
          vec3 techGlow = mix(vec3(0.0,0.94,1.0),vec3(0.482,0.172,0.75),side);
          vec3 creativeGlow = mix(vec3(1.0,0.0,0.498),vec3(1.0,0.718,0.012),side);
          float regionalWarmth = clamp(uRealm*0.75+(1.0-smoothstep(0.1,2.5,vCrystalWorldY))*0.25,0.0,1.0);
          vec3 crystalGlow = mix(techGlow,creativeGlow,regionalWarmth);
          crystalGlow = mix(crystalGlow,vec3(1.0,0.48,0.015),uGold * 0.88);
          float neuralWave = pow(0.5+0.5*sin(vCrystalWorldY*24.0-uTime*7.0+sin(vCrystalWorldX*17.0)),8.0);
          vec3 cerebralGlow = mix(vec3(1.0,0.0,0.498),mix(vec3(0.0,0.94,1.0),vec3(0.482,0.172,0.75),uHemisphere),uSplit);
          crystalGlow = mix(crystalGlow,cerebralGlow*(0.7+neuralWave*1.4),uBrain);
          float crystalRim = pow(1.0-abs(dot(normalize(normal),normalize(vViewPosition))),2.0);
          diffuseColor.rgb *= mix(vec3(1.0), crystalGlow, 0.15);
          totalEmissiveRadiance += crystalGlow * (0.035 + crystalRim * 0.45);`);
    };
    material.customProgramCacheKey = () => 'imported-crystal-physical-crystal-v2';
  }
  const geometries = new Set(), sourceMeshes = [];
  model.traverse(child => {
    if (!child.isMesh) return;
    // Cached useGLTF geometry stays untouched across pause/resume/remounts.
    child.geometry = child.geometry.clone(); geometries.add(child.geometry);
    child.material = child.name === 'Heart' ? cardiac : child.name === 'BrainRight' ? cerebralRight : child.name.startsWith('Brain') ? cerebral : /Cranium|Spine|Ribcage|Sternum|Cartilage/.test(child.name) ? gold : glass;
    child.castShadow = false; child.receiveShadow = false;
    child.userData.anatomicalSource = 'BodyParts3D';
    sourceMeshes.push(child.name);
  });
  scene.add(model); model.updateMatrixWorld(true);
  const heart = model.getObjectByName('Heart');
  const brain=model.getObjectByName('Brain');
  const halves=['BrainLeft','BrainRight'].map(name=>model.getObjectByName(name));
  const origins=halves.map(node=>node.position.clone());
  if (!heart?.isMesh || !model.getObjectByName('Cranium') || !model.getObjectByName('Ribcage')) {
    geometries.forEach(geometry => geometry.dispose());
    materials.forEach(material => material.dispose());scene.remove(model);
    throw new Error('The GLB must contain the authored Cranium, Ribcage and Heart meshes.');
  }
  function center(name) {
    return new THREE.Box3().setFromObject(model.getObjectByName(name)).getCenter(new THREE.Vector3()).toArray();
  }
  const anchors = { brain: center('Brain'), heart: center('Heart'), spine: center('CervicalSpine'), vascular: center('Ribcage') };
  const rig = new THREE.Group();rig.name = 'anatomical-gallery-lights';scene.add(rig);
  rig.add(new THREE.AmbientLight('#7B2CBF',.2));
  const cyan = new THREE.PointLight('#00F0FF',20,16,1.8);cyan.position.set(-2,3,2.4);rig.add(cyan);
  const pink = new THREE.PointLight('#FF007F',23,16,1.8);pink.position.set(-1.6,-.4,2);rig.add(pink);
  const violet = new THREE.PointLight('#7B2CBF',12,12,1.8);violet.position.set(1.6,2.8,-1.2);rig.add(violet);
  const amber=new THREE.PointLight('#FFB703',18,14,1.8);amber.position.set(2,-.7,2);rig.add(amber);
  // The cavity lights move with the imported model, inside the ribcage. They
  // are never attached to a screen overlay or substituted by CSS gradients.
  const cavity = new THREE.Group();cavity.name = 'internal-thoracic-lights';
  cavity.position.set(...anchors.heart);model.add(cavity);
  const internalCyan = new THREE.PointLight('#00F0FF',3.5,3.5,1.6);internalCyan.position.set(-.45,.18,.05);cavity.add(internalCyan);
  const internalPink = new THREE.PointLight('#FF007F',4,3.5,1.6);internalPink.position.set(.45,.12,.05);cavity.add(internalPink);
  const internalAmber = new THREE.PointLight('#FFB703',2,3.2,1.6);internalAmber.position.set(.16,-.25,.1);cavity.add(internalAmber);

  // A small image-based studio environment supplies real transmission and
  // clearcoat reflections without creating any anatomical geometry.
  const faces = ['#00bcd4','#ff207f','#7153bb','#061322','#2b1c53','#59361c'].map(color => {
    const image = document.createElement('canvas');image.width=128;image.height=128;
    const context=image.getContext('2d'),gradient=context.createLinearGradient(0,0,128,128);
    gradient.addColorStop(0,'#03070f');gradient.addColorStop(.4,color);gradient.addColorStop(.54,'#c1c9b9');gradient.addColorStop(.68,color);gradient.addColorStop(1,'#03070f');
    context.fillStyle=gradient;context.fillRect(0,0,128,128);return image;
  });
  const cube = new THREE.CubeTexture(faces);cube.colorSpace=THREE.SRGBColorSpace;cube.needsUpdate=true;
  const generator = new THREE.PMREMGenerator(renderer), environment=generator.fromCubemap(cube);
  generator.dispose();cube.dispose();scene.environment=environment.texture;
  return {
    model,heart,brain,anchors,sourceMeshes,
    applyNarrative(state,time){
      halves.forEach((node,i)=>{node.position.copy(origins[i]);node.position.x+=(i===0?1:-1)*state.separation*.45;node.position.y+=Math.sin(time*.8+i)*state.separation*.018;});
      shaders.forEach(shader=>{shader.uniforms.uSplit.value=state.separation;});
      cerebral.emissive.set('#FF007F').lerp(hemisphereCyan,state.separation);
      cerebralRight.emissive.set('#FF007F').lerp(hemisphereViolet,state.separation);
      heart.visible=state.burst<.995;cardiac.opacity=1-state.burst;cardiac.depthWrite=state.burst<.01;
    },
    telemetry(){return{heartScale:heart.scale.x,bpm:75,brainPhase:Math.sin(shaders[0]?.uniforms.uTime.value*2.5||0),brainNodes:['BrainLeft','BrainRight']};},
    update(time,energy,warmth=0) {
      shaders.forEach(shader=>{shader.uniforms.uRealm.value=warmth;shader.uniforms.uTime.value=time;});
      const pulse=cardiacPulse(time),beat=pulse.flash;
      heart.scale.setScalar(pulse.scale);cardiac.emissiveIntensity=.2+beat*.65;
      cerebral.emissiveIntensity=cerebralRight.emissiveIntensity=.18+.16*(.5+.5*Math.sin(time*2.5));
      internalAmber.intensity=(2+beat*2)*(.45+warmth*.9);internalPink.intensity=(4+beat)*(.45+warmth*.9);internalCyan.intensity=3.5*(1.15-warmth*.65);
      cyan.intensity=24*(1-warmth*.65);violet.intensity=20*(1-warmth*.65);pink.intensity=24*(.4+warmth*.8);amber.intensity=18*(.35+warmth*.9);
      violet.position.z=-1.2+Math.sin(time*.15)*.25;
    },
    lighting(){return{cyan:cyan.color.getHexString(),violet:violet.color.getHexString(),pink:pink.color.getHexString(),amber:amber.color.getHexString(),techIntensity:cyan.intensity,creativeIntensity:pink.intensity};},
    dispose() {
      geometries.forEach(geometry=>geometry.dispose());materials.forEach(material=>material.dispose());
      environment.dispose();scene.environment=null;scene.remove(model,rig);
    }
  };
}
