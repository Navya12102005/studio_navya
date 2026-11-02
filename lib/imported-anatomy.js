import * as THREE from 'three';

// The anatomy comes exclusively from the authored, licensed GLB. This adapter
// only clones imported nodes, replaces materials and adds studio/chest lights.
export function createImportedAnatomy(scene, renderer, asset) {
  const model = asset.clone(true);
  model.name = 'imported-upper-body';
  const glass = new THREE.MeshPhysicalMaterial({
    name: 'imported-crystal-skeleton', color: 0xc9dbef,
    transmission: .9, roughness: .1, clearcoat: 1, ior: 1.5,
    thickness: .14, metalness: 0, transparent: true, opacity: .78,
    depthWrite: true, envMapIntensity: .8,
    emissive: 0x07111e, emissiveIntensity: .15
  });
  const cardiac = glass.clone(); cardiac.name = 'imported-crystal-heart';
  cardiac.emissive.set('#88725e'); cardiac.emissiveIntensity = .35;
  const cerebral = glass.clone(); cerebral.name = 'imported-crystal-brain';
  cerebral.emissive.set('#28382f'); cerebral.emissiveIntensity = .15;
  for (const material of [glass,cardiac,cerebral]) {
    material.onBeforeCompile = shader => {
      shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nvarying float vCrystalWorldX;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvCrystalWorldX = (modelMatrix * vec4(position, 1.0)).x;');
      shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vCrystalWorldX;')
        .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
          vec3 crystalGlow = mix(vec3(0.08,0.13,0.14), vec3(0.16,0.12,0.08), smoothstep(-0.7,0.7,vCrystalWorldX));
          float crystalRim = pow(1.0-abs(dot(normalize(normal),normalize(vViewPosition))),2.0);
          totalEmissiveRadiance += crystalGlow * (0.06 + crystalRim * 0.16);`);
    };
    material.customProgramCacheKey = () => 'imported-crystal-spectrum-v1';
  }
  const geometries = new Set(), sourceMeshes = [];
  model.traverse(child => {
    if (!child.isMesh) return;
    // Cached useGLTF geometry stays untouched across pause/resume/remounts.
    child.geometry = child.geometry.clone(); geometries.add(child.geometry);
    child.material = child.name === 'Heart' ? cardiac : child.name === 'Brain' ? cerebral : glass;
    child.castShadow = false; child.receiveShadow = false;
    child.userData.anatomicalSource = 'BodyParts3D';
    sourceMeshes.push(child.name);
  });
  scene.add(model); model.updateMatrixWorld(true);
  const heart = model.getObjectByName('Heart');
  if (!heart?.isMesh || !model.getObjectByName('Cranium') || !model.getObjectByName('Ribcage')) {
    geometries.forEach(geometry => geometry.dispose());
    [glass,cardiac,cerebral].forEach(material => material.dispose());scene.remove(model);
    throw new Error('The GLB must contain the authored Cranium, Ribcage and Heart meshes.');
  }
  function center(name) {
    return new THREE.Box3().setFromObject(model.getObjectByName(name)).getCenter(new THREE.Vector3()).toArray();
  }
  const anchors = { brain: center('Brain'), heart: center('Heart'), spine: center('CervicalSpine'), vascular: center('Ribcage') };
  const rig = new THREE.Group();rig.name = 'anatomical-gallery-lights';scene.add(rig);
  rig.add(new THREE.AmbientLight(0x7385a3,.55));
  const cyan = new THREE.PointLight('#8da9aa',20,16,1.8);cyan.position.set(-3,2.2,3);rig.add(cyan);
  const pink = new THREE.PointLight('#b99880',23,16,1.8);pink.position.set(3,1.8,2.6);rig.add(pink);
  const violet = new THREE.PointLight('#7e9694',12,12,1.8);violet.position.set(-1.6,.4,-2.2);rig.add(violet);
  // The cavity lights move with the imported model, inside the ribcage. They
  // are never attached to a screen overlay or substituted by CSS gradients.
  const cavity = new THREE.Group();cavity.name = 'internal-thoracic-lights';
  cavity.position.set(...anchors.heart);model.add(cavity);
  const internalCyan = new THREE.PointLight('#8da9aa',3.5,3.5,1.6);internalCyan.position.set(-.45,.18,.05);cavity.add(internalCyan);
  const internalPink = new THREE.PointLight('#b99880',4,3.5,1.6);internalPink.position.set(.45,.12,.05);cavity.add(internalPink);
  const internalAmber = new THREE.PointLight('#bba487',2,3.2,1.6);internalAmber.position.set(.16,-.25,.1);cavity.add(internalAmber);

  // A small image-based studio environment supplies real transmission and
  // clearcoat reflections without creating any anatomical geometry.
  const faces = ['#788e89','#998b79','#a2ab9e','#202823','#797d6d','#3e4d43'].map(color => {
    const image = document.createElement('canvas');image.width=32;image.height=32;
    const context=image.getContext('2d'),gradient=context.createLinearGradient(0,0,32,32);
    gradient.addColorStop(0,'#171e1a');gradient.addColorStop(.4,color);gradient.addColorStop(.54,'#c1c9b9');gradient.addColorStop(.68,color);gradient.addColorStop(1,'#171e1a');
    context.fillStyle=gradient;context.fillRect(0,0,32,32);return image;
  });
  const cube = new THREE.CubeTexture(faces);cube.colorSpace=THREE.SRGBColorSpace;cube.needsUpdate=true;
  const generator = new THREE.PMREMGenerator(renderer), environment=generator.fromCubemap(cube);
  generator.dispose();cube.dispose();scene.environment=environment.texture;
  return {
    model,heart,anchors,sourceMeshes,
    update(time,energy,warmth=0) {
      const beat=Math.max(0,Math.sin(time*5.8))**10+.35*Math.max(0,Math.sin(time*5.8-.9))**12;
      heart.scale.setScalar(1+beat*.045);cardiac.emissiveIntensity=.65+beat*.7;
      internalAmber.intensity=2+beat*2;internalPink.intensity=4+beat;
      cyan.intensity=20+Math.abs(energy)*2;pink.intensity=23+warmth*2;
      violet.position.z=-2.2+Math.sin(time*.15)*.3;
    },
    dispose() {
      geometries.forEach(geometry=>geometry.dispose());[glass,cardiac,cerebral].forEach(material=>material.dispose());
      environment.dispose();scene.environment=null;scene.remove(model,rig);
    }
  };
}
