'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { vertebralLevels, ribPairs } from '../lib/anatomy';
import { createCosmicWarp } from '../lib/cosmic';

// A procedural art object, not a clinical anatomical model. Every curve is
// generated locally; no remote models, textures, fonts or WebGL services.
export default function AnatomyScene({ progress, velocity, active, onReady, onIntro, onPartHover, onPartSelect }) {
  const host = useRef(null);
  const activeRef = useRef(active);
  useEffect(() => { activeRef.current = active; }, [active]);
  useEffect(() => {
    const container = host.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    } catch { onReady(false); return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.25 : 1.7));
    renderer.setClearColor(0x030305, 0);
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, .1, 60);
    const anatomy = new THREE.Group(); scene.add(anatomy);
    const cranium = new THREE.Group(), cervical = new THREE.Group(), thorax = new THREE.Group();
    cranium.name = 'cranial-vault'; cervical.name = 'cervical-C1-C7'; thorax.name = 'thoracic-T1-T12';
    cranium.userData.part = 'brain'; cervical.userData.part = 'spine'; thorax.userData.part = 'heart';
    anatomy.add(cranium, cervical, thorax);
    let structure = cranium;
    const cool = 0x66dfff, violet = 0xa293ff, warm = 0xffaa74, pink = 0xff719c;
    const materials = [];
    const lineMaterials = new Map();
    const shaderMaterials = [];
    const surfaceVertex = `
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vView;
      varying vec3 vLocal;
      void main() {
        vLocal = position;
        vec3 displaced = position + normal * sin(position.y * 12.0 + uTime * 1.1) * 0.006;
        vec4 viewPosition = modelViewMatrix * vec4(displaced, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vView = -viewPosition.xyz;
        gl_Position = projectionMatrix * viewPosition;
      }`;
    const surfaceFragment = `
      uniform float uTime;
      uniform vec3 uTint;
      varying vec3 vNormal;
      varying vec3 vView;
      varying vec3 vLocal;
      void main() {
        vec3 normal = normalize(vNormal);
        vec3 view = normalize(vView);
        float fresnel = pow(1.0 - abs(dot(normal, view)), 2.6);
        // Thin glass refraction bands and a soft backlit scattering approximation.
        vec3 refracted = refract(-view, normal, 0.72);
        float caustic = pow(0.5 + 0.5 * sin(dot(refracted, vec3(17.0, 23.0, 9.0)) + uTime * 0.45), 8.0);
        float scatter = pow(max(0.0, dot(-normal, normalize(vec3(-0.4, 0.8, 1.0)))), 3.0);
        float vessels = pow(abs(sin(vLocal.y * 32.0 + sin(vLocal.x * 18.0) * 2.0 + uTime * 0.55)), 24.0);
        vec3 glow = uTint * (0.16 + fresnel * 1.4 + scatter * 0.45 + caustic * 0.35);
        glow += vec3(1.0, 0.78, 0.91) * vessels * 0.12;
        // View-dependent thin-film interference: offset spectral wavelengths
        // create a stained-glass edge while the base hemisphere tint remains.
        float thickness = (1.0 - abs(dot(normal, view))) * 2.4 + sin(vLocal.y * 6.0) * 0.08;
        vec3 film = 0.5 + 0.5 * cos(6.28318 * (vec3(1.0, 1.32, 1.68) * thickness + vec3(0.0, 0.33, 0.67)));
        glow += film * fresnel * 0.29;
        gl_FragColor = vec4(glow, 0.12 + fresnel * 0.48 + scatter * 0.12);
      }`;
    function glowSurface(geometry, tint, group) {
      const m = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uTint: { value: new THREE.Color(tint) } },
        vertexShader: surfaceVertex, fragmentShader: surfaceFragment,
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        side: THREE.FrontSide
      });
      materials.push(m); shaderMaterials.push(m);
      const mesh = new THREE.Mesh(geometry, m); group.add(mesh); return mesh;
    }
    function material(color, opacity = .65) {
      const key = `${color}:${opacity}`;
      if (lineMaterials.has(key)) return lineMaterials.get(key);
      const m = new THREE.LineBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false });
      materials.push(m); lineMaterials.set(key, m); return m;
    }
    const iceLine = material(cool, .5), warmLine = material(warm, .56), dim = material(0x9c9ebb, .2);
    const points = [];
    function curve(coords, mat = dim, group = structure, closed = false) {
      const spline = new THREE.CatmullRomCurve3(coords.map(p => new THREE.Vector3(...p)), closed);
      const geometry = new THREE.BufferGeometry().setFromPoints(spline.getPoints(72));
      const line = new THREE.Line(geometry, mat); group.add(line); return line;
    }
    function ellipse(x, y, z, rx, ry, mat, group = structure, tilt = 0) {
      const coords = Array.from({ length: 65 }, (_, i) => {
        const a = i / 64 * Math.PI * 2;
        return [x + Math.cos(a) * rx, y + Math.sin(a) * ry, z + Math.sin(a) * tilt];
      });
      return curve(coords, mat, group, true);
    }
    // Fine cranial meridians, with a left/right spectral split.
    for (let side of [-1, 1]) {
      const mat = side < 0 ? iceLine : warmLine;
      for (let j = 0; j < 15; j++) {
        const phi = j / 14 * Math.PI;
        const coords = [];
        for (let i = 0; i <= 48; i++) {
          const a = -.48 + i / 48 * Math.PI * 1.48;
          coords.push([side * Math.sin(phi) * Math.cos(a) * .72, 2.52 + Math.sin(a) * .88, Math.cos(phi) * Math.cos(a) * .62]);
        }
        curve(coords, material(side < 0 ? cool : warm, .12));
      }
      // Zygomatic / jaw contour and eyes distinguish skull from a plain globe.
      curve([[side * .65, 2.5, .32], [side * .62, 2.1, .42], [side * .48, 1.85, .49], [side * .28, 1.67, .47], [0, 1.61, .49]], mat);
      ellipse(side * .31, 2.16, .57, .22, .18, mat);
      curve([[side * .08, 2.14, .68], [side * .13, 1.97, .73], [side * .04, 1.94, .76]], mat);
      for (let j = 0; j < 6; j++) {
        const x = side * (.04 + j * .06);
        curve([[x, 1.88, .64], [x, 1.76, .66]], material(side < 0 ? cool : warm, .25));
      }
      // Distinct hemispheres with convoluted luminous gyri.
      const brain = new THREE.Group(); brain.position.set(side * .3, 2.83, .11); brain.name = side < 0 ? 'cerebral-left' : 'cerebral-right'; brain.userData.part = 'brain'; anatomy.add(brain);
      const cortex = glowSurface(new THREE.SphereGeometry(1, 32, 24), side < 0 ? cool : pink, brain);
      cortex.scale.set(.33, .35, .47);
      const brainMat = material(side < 0 ? violet : pink, .66);
      for (let j = 1; j < 22; j++) {
        const lat = j / 22 * Math.PI;
        const coords = [];
        for (let i = 0; i <= 100; i++) {
          const a = i / 100 * Math.PI * 2;
          const ripple = 1 + .09 * Math.sin(a * 9 + lat * 19) + .04 * Math.cos(a * 15 - lat * 8);
          coords.push([Math.sin(lat) * Math.cos(a) * .35 * ripple, Math.cos(lat) * .37, Math.sin(lat) * Math.sin(a) * .49 * ripple]);
        }
        curve(coords, brainMat, brain, true);
      }
    }
    // Seven cervical and twelve thoracic levels; gentle cervical lordosis and
    // thoracic kyphosis replace an undifferentiated straight stack of rings.
    for (const level of vertebralLevels) {
      const { y, width: radius, z, region } = level;
      const group = region === 'cervical' ? cervical : thorax;
      ellipse(0, y, z, radius, region === 'cervical' ? .032 : .06, material(region === 'cervical' ? cool : violet, .55), group);
      curve([[-radius, y, z], [-radius * 1.7, y + .025, z + .04], [0, y - .045, z - .15], [radius * 1.7, y + .025, z + .04], [radius, y, z]], dim, group);
    }
    structure = cervical;
    // C1 atlas ring and C2 odontoid process at the cranio-cervical junction.
    ellipse(0, 1.64, -.18, .12, .04, iceLine);
    curve([[0, 1.49, -.17], [0, 1.65, -.16]], iceLine);
    curve([[0, 1.67, -.2], [0, .6, -.27], [0, -.6, -.23], [0, -1.48, -.1]], material(violet, .7));
    structure = thorax;
    // Twelve rib pairs: 1–7 attach to the sternum, 8–10 reach the costal
    // margin, 11–12 end freely instead of closing into a false rib ring.
    for (let side of [-1, 1]) {
      const mat = side < 0 ? iceLine : warmLine;
      curve([[0, 1.35, .25], [side * .55, 1.48, .17], [side * 1.18, 1.25, -.04], [side * 1.48, 1.1, -.03]], mat);
      for (const rib of ribPairs) {
        const { y, width, type } = rib;
        for (let strand = 0; strand < 3; strand++) {
          const shift = strand * .025;
          const end = type === 'true' ? [side * .13, y - .2 + shift, .56] : type === 'false' ? [side * .24, -.5 + shift, .5] : [side * width * .65, y - .21 + shift, .19];
          const coords = [[side * .06, y, -.25], [side * width * .65, y + .05, -.52], [side * width, y - .08, -.02]];
          if (type !== 'floating') coords.push([side * width * .82, y - .26 + shift, .55]);
          coords.push(end);
          curve(coords, material(side < 0 ? cool : warm, strand === 1 ? .45 : .14));
        }
      }
      // Shoulder sockets and proximal arm bones; deliberately no lower body.
      ellipse(side * 1.48, 1.13, -.02, .19, .24, mat);
      for (let offset of [-.07, .07]) curve([[side * 1.49 + offset, 1.03, -.03], [side * 1.62 + offset, .1, .02], [side * 1.78 + offset, -1.3, .11]], mat);
      curve([[side * .32, 1.08, -.4], [side * 1.23, .87, -.48], [side * .84, .23, -.56], [side * .32, 1.08, -.4]], dim);
    }
    curve([[0, 1.18, .35], [0, .95, .48], [0, .6, .6], [0, -.34, .61], [0, -.52, .48]], material(0xd8b6d2, .6));
    // Anatomical metaphor: luminous heart volume and branching great vessels.
    const heart = new THREE.Group(); heart.position.set(.2, .04, .63); heart.rotation.z = .23; heart.name = 'cardiac-core'; heart.userData.part = 'heart'; anatomy.add(heart);
    const core = glowSurface(new THREE.SphereGeometry(1, 32, 24), pink, heart);
    core.scale.set(.31, .36, .25); core.position.y = -.04;
    const heartMat = material(pink, .8);
    for (let layer = 1; layer < 24; layer++) {
      const lat = layer / 24 * Math.PI;
      const radius = Math.sin(lat) * (.82 + .18 * Math.cos(lat));
      const coords = [];
      for (let i = 0; i <= 100; i++) {
        const a = i / 100 * Math.PI * 2;
        coords.push([Math.cos(a) * radius * .43, Math.cos(lat) * .52 - .04 + Math.cos(a) * .03, Math.sin(a) * radius * .31]);
      }
      curve(coords, layer % 3 ? heartMat : material(warm, .85), heart, true);
    }
    // Ventricular meridians, anterior coronary paths and the great vessels.
    for (let j = 0; j < 20; j++) {
      const a = j / 20 * Math.PI * 2;
      const coords = Array.from({ length: 32 }, (_, i) => {
        const t = i / 31 * Math.PI;
        const r = Math.sin(t) * (.82 + .18 * Math.cos(t));
        return [Math.cos(a) * r * .43, Math.cos(t) * .52 - .04, Math.sin(a) * r * .31];
      });
      curve(coords, material(pink, .42), heart);
    }
    curve([[.04, .28, .04], [.16, .68, .01], [-.12, .8, -.04], [-.35, .61, -.1], [-.36, .05, -.15]], material(warm, .8), heart);
    curve([[-.16, .31, .13], [-.24, .53, .17], [.03, .6, .16], [.4, .53, -.03]], material(pink, .7), heart);
    for (const x of [-.12, 0, .12]) curve([[x, .73, -.03], [x - .035, .98, -.09]], material(warm, .55), heart);
    curve([[-.18, .26, .26], [.07, .06, .31], [.13, -.2, .25], [.04, -.5, .06]], material(warm, .7), heart);
    const vascular = new THREE.Group(); vascular.name = 'vascular-tree'; vascular.userData.part = 'heart'; anatomy.add(vascular);
    for (const side of [-1, 1]) {
      const vessel = material(side < 0 ? cool : pink, .29);
      curve([[.12, .35, .65], [side * .12, 1.0, .37], [side * .14, 1.6, .14], [side * .23, 2.1, .17], [side * .29, 2.57, .16]], vessel, vascular);
      curve([[side * .12, 1.0, .37], [side * .65, 1.29, .19], [side * 1.37, 1.09, .14], [side * 1.53, .1, .16], [side * 1.7, -1.23, .18]], vessel, vascular);
      curve([[.14, .2, .55], [side * .25, -.35, .39], [side * .23, -.93, .17], [side * .3, -1.44, .07]], vessel, vascular);
    }
    // Merge static curves by material within each tagged structure. Hundreds of
    // small buffer geometries become a few line-segment draw calls per group.
    function batchCurves(group) {
      group.children.filter(child => child.isGroup).forEach(batchCurves);
      const array = [], colors = [], alpha = [];
      group.children.filter(child => child.isLine).forEach(line => {
        const positions = line.geometry.attributes.position.array, color = line.material.color;
        for (let i = 0; i < positions.length - 3; i += 3) {
          array.push(...positions.slice(i, i + 3), ...positions.slice(i + 3, i + 6));
          colors.push(color.r, color.g, color.b, color.r, color.g, color.b);
          alpha.push(line.material.opacity, line.material.opacity);
        }
        line.geometry.dispose(); group.remove(line);
      });
      if (array.length) {
        const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.Float32BufferAttribute(array, 3));
        geometry.setAttribute('aColor', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('aOpacity', new THREE.Float32BufferAttribute(alpha, 1));
        const mat = new THREE.ShaderMaterial({
          uniforms: { uTime: { value: 0 }, uPulse: { value: group === heart ? 1 : 0 } },
          transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
          vertexShader: `attribute vec3 aColor; attribute float aOpacity; varying vec3 vColor; varying float vAlpha;
            void main(){vColor=aColor;vAlpha=aOpacity;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
          fragmentShader: `uniform float uTime; uniform float uPulse; varying vec3 vColor; varying float vAlpha;
            void main(){float beat=pow(max(0.0,sin(uTime*5.8)),10.0);gl_FragColor=vec4(vColor,vAlpha*(1.0+uPulse*beat*0.35));}`
        });
        materials.push(mat); shaderMaterials.push(mat);
        group.add(new THREE.LineSegments(geometry, mat));
      }
    }
    batchCurves(anatomy);
    // Recursively forked neural canopy: one buffer and one draw call. Branch
    // depth is bounded, so scroll cannot recursively grow geometry or memory.
    const branchVertices = [], crystalTips = [];
    function branch(x, y, z, angle, length, depth) {
      if (!depth) return;
      const nx = x + Math.cos(angle) * length, ny = y + Math.sin(angle) * length;
      const nz = z + Math.sin(angle * 3 + depth) * .12;
      const fiber = new THREE.CatmullRomCurve3([
        new THREE.Vector3(x, y, z),
        new THREE.Vector3((x + nx) / 2 + Math.sin(angle) * length * .18, (y + ny) / 2 - Math.cos(angle) * length * .18, (z + nz) / 2 + .035),
        new THREE.Vector3(nx, ny, nz)
      ]).getPoints(5);
      for (let i = 0; i < fiber.length - 1; i++) branchVertices.push(...fiber[i].toArray(), ...fiber[i + 1].toArray());
      if (depth === 2) {
        crystalTips.push([nx, ny, nz]);
        // Three translucent petal loops around a distal neural/floral root.
        for (let petal = 0; petal < 3; petal++) {
          const a = angle + (petal - 1) * .8;
          const tip = new THREE.Vector3(nx + Math.cos(a) * .11, ny + Math.sin(a) * .11, nz + .035);
          branchVertices.push(nx, ny, nz, ...tip.toArray(), ...tip.toArray(), nx + Math.cos(a + .5) * .04, ny + Math.sin(a + .5) * .04, nz);
        }
      }
      branch(nx, ny, nz, angle + .4 + depth * .025, length * .68, depth - 1);
      branch(nx, ny, nz, angle - .48 + depth * .012, length * .73, depth - 1);
    }
    for (const [x, y, angle] of [[-.35, 2.7, 2.8], [-.25, 2.5, 3.6], [.35, 2.7, .3], [.25, 2.5, -.5]]) branch(x, y, -.9, angle, .55, 6);
    const canopyGeometry = new THREE.BufferGeometry(); canopyGeometry.setAttribute('position', new THREE.Float32BufferAttribute(branchVertices, 3));
    const canopyMaterial = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uScroll: { value: 0 }, uVelocity: { value: 0 } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `uniform float uTime; uniform float uScroll; uniform float uVelocity; varying vec3 vP;
        void main() {
          vec3 p = position; vec2 anchor = vec2(0.0, 2.6);
          float a = uVelocity * 0.08 + sin(uTime * 0.12) * 0.015;
          mat2 rotation = mat2(cos(a), -sin(a), sin(a), cos(a));
          p.xy = anchor + rotation * (p.xy - anchor) * (1.0 - uScroll * 0.14 + abs(uVelocity) * 0.04);
          vP = p; gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }`,
      fragmentShader: `uniform float uTime; varying vec3 vP;
        void main() {
          vec3 color = mix(vec3(0.35,0.77,1.0), vec3(1.0,0.45,0.66), smoothstep(-0.5,0.5,vP.x));
          float pulse = pow(0.5 + 0.5 * sin(length(vP.xy - vec2(0.0,2.6)) * 8.0 - uTime * 1.2), 10.0);
          gl_FragColor = vec4(color, 0.08 + pulse * 0.1);
        }`
    });
    shaderMaterials.push(canopyMaterial); materials.push(canopyMaterial);
    const canopy = new THREE.LineSegments(canopyGeometry, canopyMaterial); canopy.name = 'recursive-neural-canopy'; anatomy.add(canopy);
    const crystalGeometry = new THREE.OctahedronGeometry(.065, 0);
    for (const side of [-1, 1]) {
      const tips = crystalTips.filter(p => Math.sign(p[0]) === side);
      const crystalMaterial = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uTint: { value: new THREE.Color(side < 0 ? violet : pink) } },
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        vertexShader: `uniform float uTime; varying vec3 vNormal; varying vec3 vView; varying vec3 vLocal;
          void main(){vLocal=position;vec4 p=instanceMatrix*vec4(position,1.0);vec4 mv=modelViewMatrix*p;
            vNormal=normalize(normalMatrix*mat3(instanceMatrix)*normal);vView=-mv.xyz;gl_Position=projectionMatrix*mv;}`,
        fragmentShader: surfaceFragment
      });
      materials.push(crystalMaterial); shaderMaterials.push(crystalMaterial);
      const crystals = new THREE.InstancedMesh(crystalGeometry, crystalMaterial, tips.length);
      const transform = new THREE.Object3D();
      tips.forEach((p, i) => { transform.position.set(...p); transform.rotation.set(i * .7, i * 1.1, i * .4); transform.scale.set(.55, 1.7, .6); transform.updateMatrix(); crystals.setMatrixAt(i, transform.matrix); });
      crystals.name = side < 0 ? 'cool-quartz-roots' : 'warm-quartz-roots'; anatomy.add(crystals);
    }
    // A bilayer cell and a molecular ligand act as real raycastable 3D project
    // containers. Head/tail geometry is artistic, not a molecular-scale model.
    const cell = new THREE.Group(); cell.position.set(-1.08, 2.38, .15); cell.name = 'lipid-bilayer-node'; anatomy.add(cell);
    glowSurface(new THREE.SphereGeometry(.25, 16, 12), cool, cell);
    const lipidHeads = [], lipidTails = [];
    for (let i = 0; i < 100; i++) {
      const y = 1 - (i + .5) / 100 * 2, radius = Math.sqrt(1 - y * y), angle = i * 2.399963;
      const p = new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      for (const r of [.265, .225]) lipidHeads.push(p.x * r, p.y * r, p.z * r);
      lipidTails.push(p.x * .26, p.y * .26, p.z * .26, p.x * .23, p.y * .23, p.z * .23);
    }
    const headGeometry = new THREE.BufferGeometry(); headGeometry.setAttribute('position', new THREE.Float32BufferAttribute(lipidHeads, 3));
    const headMaterial = new THREE.PointsMaterial({ color: cool, size: .018, transparent: true, opacity: .7, blending: THREE.AdditiveBlending }); materials.push(headMaterial);
    cell.add(new THREE.Points(headGeometry, headMaterial));
    const tailGeometry = new THREE.BufferGeometry(); tailGeometry.setAttribute('position', new THREE.Float32BufferAttribute(lipidTails, 3));
    cell.add(new THREE.LineSegments(tailGeometry, material(violet, .35)));
    const ligand = new THREE.Group(); ligand.position.set(1.03, .81, .72); ligand.name = 'molecular-ligand-node'; anatomy.add(ligand);
    const atomMaterial = new THREE.MeshBasicMaterial({ color: violet, transparent: true, opacity: .63 }); materials.push(atomMaterial);
    const atoms = new THREE.InstancedMesh(new THREE.SphereGeometry(.04, 8, 6), atomMaterial, 9);
    const atomPositions = Array.from({ length: 6 }, (_, i) => new THREE.Vector3(Math.cos(i / 6 * Math.PI * 2) * .21, Math.sin(i / 6 * Math.PI * 2) * .21, Math.sin(i) * .035));
    atomPositions.push(new THREE.Vector3(.37, .08, .1), new THREE.Vector3(.47, .23, .13), new THREE.Vector3(-.33, -.17, -.08));
    const atomTransform = new THREE.Object3D(); atomPositions.forEach((p, i) => { atomTransform.position.copy(p); atomTransform.updateMatrix(); atoms.setMatrixAt(i, atomTransform.matrix); }); ligand.add(atoms);
    const bonds = [];
    for (let i = 0; i < 6; i++) bonds.push(...atomPositions[i].toArray(), ...atomPositions[(i + 1) % 6].toArray());
    for (const [a, b] of [[0, 6], [6, 7], [3, 8]]) bonds.push(...atomPositions[a].toArray(), ...atomPositions[b].toArray());
    const bondGeometry = new THREE.BufferGeometry(); bondGeometry.setAttribute('position', new THREE.Float32BufferAttribute(bonds, 3)); ligand.add(new THREE.LineSegments(bondGeometry, material(cool, .65)));
    // Neural points follow the silhouette rather than forming a generic cloud.
    let seed = 17;
    const random = () => { seed = seed * 16807 % 2147483647; return seed / 2147483647; };
    for (let i = 0; i < 380; i++) {
      const y = random() * 4.9 - 1.7;
      const width = y > 1.6 ? .65 : 1.25;
      points.push((random() - .5) * width * 2, y, (random() - .5) * .8);
    }
    const dustGeometry = new THREE.BufferGeometry(); dustGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    const dustMaterial = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uScroll: { value: 0 }, uVelocity: { value: 0 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `uniform float uTime; uniform float uScroll; uniform float uVelocity; varying float vWarm; varying float vLife; void main() {
        vec3 p = position;
        float life = fract((position.y + 1.7) / 4.9 + uTime * 0.035);
        p.y = mix(-1.7, 3.2, life);
        p.x += sin(uTime * 0.32 + p.y * 3.0) * 0.065;
        p.z += cos(uTime * 0.45 + p.y * 4.0) * 0.045;
        float a = uVelocity * (0.13 + length(p.xy) * 0.05);
        p.xy = mat2(cos(a),-sin(a),sin(a),cos(a)) * p.xy * (1.0 - uScroll * 0.08);
        vLife = smoothstep(0.0, 0.12, life) * (1.0 - smoothstep(0.8, 1.0, life));
        vWarm = smoothstep(-0.3, 0.3, p.x);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = clamp(15.0 / -mv.z, 1.0, 4.0);
        gl_Position = projectionMatrix * mv;
      }`,
      fragmentShader: `varying float vWarm; varying float vLife; void main() {
        float d = length(gl_PointCoord - vec2(0.5));
        float alpha = smoothstep(0.5, 0.04, d);
        vec3 color = mix(vec3(0.45,0.85,1.0), vec3(1.0,0.57,0.65), vWarm);
        gl_FragColor = vec4(color * 1.3, alpha * 0.7 * vLife);
      }`
    });
    shaderMaterials.push(dustMaterial);
    anatomy.add(new THREE.Points(dustGeometry, dustMaterial));
    let seen = true;
    try { seen = sessionStorage.getItem('navya-intro-seen') === '1'; } catch { /* The intro still auto-completes without storage. */ }
    let introRunning = !seen && scrollY < 80, introElapsed = 0, energyAt = 0;
    const cosmic = introRunning ? createCosmicWarp(anatomy, innerWidth < 700) : null;
    let cosmicDisposed = false;
    const finishIntro = () => {
      if (!introRunning) return;
      introRunning = false;
      try { sessionStorage.setItem('navya-intro-seen', '1'); } catch {}
      if (!cosmicDisposed) { cosmic?.dispose(); cosmicDisposed = true; }
      onIntro?.(false);
    };
    const accelerateIntro = () => { if (introRunning) introElapsed = Math.max(introElapsed, 2050); };
    const skipIntro = () => { if (introRunning) introElapsed = 2800; };
    addEventListener('wheel', accelerateIntro, { passive: true });
    addEventListener('portfolio:intro-accelerate', accelerateIntro);
    addEventListener('portfolio:intro-skip', skipIntro);
    onIntro?.(introRunning);
    // Semantic pick volumes are independent of luminous line thickness. This
    // makes precise part targeting possible without an expensive triangle scan.
    const pickMaterial = new THREE.MeshBasicMaterial({ visible: false }); materials.push(pickMaterial);
    const pickTargets = [];
    for (const [part, position, scale] of [
      ['brain', [0, 2.65, .05], [.76, .85, .66]],
      ['heart', [.2, .04, .63], [.55, .67, .48]],
      ['spine', [0, 1.05, -.2], [.17, .65, .3]],
      ['vascular', [.69, 1.1, .25], [.3, .25, .3]],
      ['cell', [-1.08, 2.38, .15], [.3, .3, .3]],
      ['ligand', [1.03, .81, .72], [.4, .35, .25]]
    ]) {
      const target = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), pickMaterial);
      target.position.set(...position); target.scale.set(...scale); target.userData.part = part;
      target.name = `pick-${part}`; anatomy.add(target); pickTargets.push(target);
    }
    const raycaster = new THREE.Raycaster(), ndc = new THREE.Vector2();
    let hoveredPart = null, pickAt = 0;
    const pointer = { x: 0, y: 0 };
    const move = event => {
      if (event.pointerType !== 'mouse' || introRunning) return;
      pointer.x = event.clientX / innerWidth - .5; pointer.y = event.clientY / innerHeight - .5;
      if (performance.now() - pickAt < 40) return;
      pickAt = performance.now();
      const r = container.getBoundingClientRect();
      let part = null;
      if (activeRef.current && event.clientY >= r.top && event.clientY <= r.bottom) {
        ndc.set((event.clientX - r.left) / r.width * 2 - 1, -(event.clientY - r.top) / r.height * 2 + 1);
        raycaster.setFromCamera(ndc, camera);
        part = raycaster.intersectObjects(pickTargets, false)[0]?.object.userData.part || null;
      }
      if (part !== hoveredPart) {
        hoveredPart = part; onPartHover?.(part);
        if (part) renderer.domElement.setAttribute('data-cursor', part); else renderer.domElement.removeAttribute('data-cursor');
      }
    };
    const select = event => {
      if (event.target === renderer.domElement && hoveredPart) onPartSelect?.(hoveredPart);
    };
    renderer.domElement.addEventListener('click', select);
    function resize() {
      const { width, height } = container.getBoundingClientRect();
      renderer.setSize(width, height); camera.aspect = width / Math.max(1, height); camera.updateProjectionMatrix();
    }
    let frame, last = 0, time = 0, inView = true, profileFrames = 0, profileStart = 0, scrollEnergy = 0, qualityFrames = 0, qualityElapsed = 0, prismAt = 0;
    const profile = new URLSearchParams(location.search).has('profile');
    const cardiacPosition = new THREE.Vector3();
    function render(now) {
      frame = requestAnimationFrame(render);
      const elapsed = now - last, dt = Math.min(elapsed / 1000, .05); last = now;
      if (!activeRef.current || !inView) { profileFrames = 0; profileStart = 0; return; }
      time += dt;
      if (now - prismAt > 100) {
        container.parentElement.style.setProperty('--orbit-angle', `${time * 2}deg`); prismAt = now;
      }
      scrollEnergy += ((velocity?.current || 0) - scrollEnergy) * .08;
      if (velocity) velocity.current *= .96;
      shaderMaterials.forEach(m => {
        m.uniforms.uTime.value = time;
        if (m.uniforms.uScroll) m.uniforms.uScroll.value = progress.current;
        if (m.uniforms.uVelocity) m.uniforms.uVelocity.value = scrollEnergy;
      });
      const p = progress.current;
      const mobile = container.clientWidth < 700;
      const lerp = THREE.MathUtils.lerp;
      // Establish the whole upper body, approach the brain, descend the spine,
      // then settle on the heart. Scroll reverses the same continuous camera.
      const phases = [
        { p: 0, y: .75, z: mobile ? 12.9 : 10.5, x: mobile ? 0 : -1.3 },
        { p: .33, y: 2.55, z: mobile ? 6.9 : 5.9, x: mobile ? 0 : -.8 },
        { p: .63, y: 1.13, z: mobile ? 7.4 : 5.8, x: mobile ? 0 : -.8 },
        { p: 1, y: .15, z: mobile ? 6.3 : 5.1, x: mobile ? 0 : -.8 }
      ];
      let i = phases.findIndex((v, index) => index < phases.length - 1 && p <= phases[index + 1].p);
      if (i < 0) i = 2;
      const a = phases[i], b = phases[i + 1], t = THREE.MathUtils.smoothstep(p, a.p, b.p);
      anatomy.rotation.y = -.19 + time * .035 + pointer.x * .12;
      anatomy.rotation.x = pointer.y * .025;
      cell.rotation.y = time * .18; cell.rotation.x = Math.sin(time * .1) * .15;
      ligand.rotation.y = time * .23; ligand.rotation.z = Math.sin(time * .12) * .2;
      anatomy.updateMatrixWorld(true); heart.getWorldPosition(cardiacPosition);
      camera.position.set(lerp(a.x, b.x, t), lerp(a.y, b.y, t), lerp(a.z, b.z, t));
      camera.lookAt(lerp(a.x, b.x, t), lerp(a.y, b.y, t), 0);
      const dive = THREE.MathUtils.smoothstep(p, .82, 1);
      if (dive > 0) {
        camera.position.x = lerp(camera.position.x, cardiacPosition.x - (mobile ? 0 : .06), dive);
        camera.position.y = lerp(camera.position.y, cardiacPosition.y, dive);
        camera.position.z = lerp(camera.position.z, cardiacPosition.z + (mobile ? 1.15 : .6), dive);
        camera.lookAt(lerp(camera.position.x, cardiacPosition.x, dive), lerp(camera.position.y, cardiacPosition.y, dive), lerp(0, cardiacPosition.z - .12, dive));
      }
      if (introRunning) {
        introElapsed += dt * 1000;
        const phase = Math.min(1, introElapsed / 2800);
        const morph = THREE.MathUtils.smoothstep(phase, .58, .98);
        cosmic.update(time, morph, Math.sin(phase * Math.PI) ** 2);
        camera.position.x *= morph;
        camera.lookAt(camera.position.x, camera.position.y, 0);
        renderer.render(cosmic.scene, camera);
        if (now - energyAt > 80) { dispatchEvent(new CustomEvent('portfolio:intro-energy', { detail: phase })); energyAt = now; }
        if (phase >= 1) finishIntro();
        else return;
      }
      const beat = Math.max(0, Math.sin(time * 5.8)) ** 10 + .36 * Math.max(0, Math.sin(time * 5.8 - .9)) ** 12;
      heart.scale.setScalar(1 + beat * .065);
      heartMat.opacity = .61 + beat * .35;
      renderer.render(scene, camera);
      // Adapt resolution when a software renderer or slow device cannot keep
      // pace. Geometry and content stay intact; no unbounded particle growth.
      qualityFrames++; qualityElapsed += Math.min(elapsed, 200);
      if (qualityFrames >= 30) {
        const average = qualityElapsed / qualityFrames;
        if (average > 24 && renderer.getPixelRatio() > .65) {
          renderer.setPixelRatio(Math.max(.65, renderer.getPixelRatio() * .8)); resize();
        }
        qualityFrames = 0; qualityElapsed = 0;
      }
      if (profile && ++profileFrames % 60 === 0) {
        const metrics = { fps: profileStart ? 60000 / (now - profileStart) : 0, drawCalls: renderer.info.render.calls, triangles: renderer.info.render.triangles, lines: renderer.info.render.lines, geometries: renderer.info.memory.geometries, pixelRatio: renderer.getPixelRatio() };
        profileStart = now;
        renderer.domElement.dataset.profile = JSON.stringify(metrics);
        dispatchEvent(new CustomEvent('anatomy:performance', { detail: metrics }));
      }
    }
    const observer = new ResizeObserver(resize); observer.observe(container);
    const visibility = new IntersectionObserver(entries => { inView = entries[0].isIntersecting; }); visibility.observe(container);
    renderer.domElement.addEventListener('webglcontextlost', () => onReady(false));
    addEventListener('pointermove', move, { passive: true });
    resize(); frame = requestAnimationFrame(render); onReady(true);
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); visibility.disconnect(); removeEventListener('pointermove', move);
      removeEventListener('wheel', accelerateIntro);
      removeEventListener('portfolio:intro-accelerate', accelerateIntro); removeEventListener('portfolio:intro-skip', skipIntro);
      if (!cosmicDisposed) cosmic?.dispose(); onIntro?.(false);
      scene.traverse(object => object.geometry?.dispose());
      new Set(materials).forEach(m => m.dispose()); dustMaterial.dispose();
      renderer.domElement.removeEventListener('click', select);
      renderer.dispose(); renderer.domElement.remove();
    };
  }, [progress, velocity, onReady, onIntro, onPartHover, onPartSelect]);
  return <div ref={host} className="anatomy-canvas" aria-hidden="true" />;
}
