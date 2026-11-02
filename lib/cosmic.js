import * as THREE from 'three';

export function createCosmicWarp(anatomy, mobile) {
  anatomy.updateMatrixWorld(true);
  const targets = [], vector = new THREE.Vector3();
  anatomy.traverse(object => {
    if (!object.isLine) return;
    const positions = object.geometry.attributes.position;
    for (let i = 0; i < positions.count; i += 3) {
      vector.fromBufferAttribute(positions, i).applyMatrix4(object.matrixWorld); targets.push(vector.clone());
    }
  });
  const count = mobile ? 900 : 1800;
  const positions = [], mapped = [], tints = [], streakPositions = [], streakTargets = [], tails = [];
  let seed = 311;
  const random = () => { seed = seed * 16807 % 2147483647; return seed / 2147483647; };
  for (let i = 0; i < count; i++) {
    const angle = random() * Math.PI * 2, radius = .25 + random() ** .55 * 16;
    const p = [Math.cos(angle) * radius, Math.sin(angle) * radius + .7, random() * 60];
    const target = targets[Math.floor(random() * targets.length)] || new THREE.Vector3();
    positions.push(...p); mapped.push(target.x, target.y, target.z); tints.push(random());
    for (let j = 0; j < 2; j++) { streakPositions.push(...p); streakTargets.push(target.x, target.y, target.z); tails.push(j); }
  }
  const uniforms = { uTime: { value: 0 }, uMorph: { value: 0 }, uSpeed: { value: 0 } };
  const vertex = `
    uniform float uTime; uniform float uMorph; uniform float uSpeed;
    attribute vec3 aTarget; attribute float aTint; varying float vTint; varying float vDepth;
    void main() {
      vec3 p = position;
      p.z = mod(p.z + uTime * (4.0 + uSpeed * 19.0), 60.0) - 49.0;
      float telescope = 1.0 - uMorph * 0.8;
      p.xy *= telescope;
      p = mix(p, aTarget, uMorph);
      vec4 mv = modelViewMatrix * vec4(p, 1.0);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = clamp((28.0 + uMorph * 4.0) / max(1.0,-mv.z), 1.0, 3.0);
      vTint = aTint; vDepth = smoothstep(55.0, 3.0, -mv.z);
    }`;
  const fragment = `varying float vTint; varying float vDepth; uniform float uMorph;
    void main() {
      float light = smoothstep(0.5,0.03,length(gl_PointCoord-vec2(0.5)));
      vec3 hue = mix(vec3(0.58,0.83,1.0),vec3(1.0,0.56,0.77),vTint);
      gl_FragColor=vec4(hue*1.25,light*(0.25+vDepth*0.65));
    }`;
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('aTarget', new THREE.Float32BufferAttribute(mapped, 3));
  geometry.setAttribute('aTint', new THREE.Float32BufferAttribute(tints, 1));
  const material = new THREE.ShaderMaterial({ uniforms, vertexShader: vertex, fragmentShader: fragment, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const scene = new THREE.Scene(); scene.add(new THREE.Points(geometry, material));
  const streakGeometry = new THREE.BufferGeometry();
  streakGeometry.setAttribute('position', new THREE.Float32BufferAttribute(streakPositions, 3));
  streakGeometry.setAttribute('aTarget', new THREE.Float32BufferAttribute(streakTargets, 3));
  streakGeometry.setAttribute('aTail', new THREE.Float32BufferAttribute(tails, 1));
  const streakMaterial = new THREE.ShaderMaterial({ uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `uniform float uTime; uniform float uMorph; uniform float uSpeed; attribute vec3 aTarget; attribute float aTail; varying float vFade;
      void main() { vec3 p=position; p.z=mod(p.z+uTime*(4.0+uSpeed*19.0),60.0)-49.0;
        p.z-=aTail*(0.08+uSpeed*1.5)*(1.0-uMorph); p.xy*=1.0-uMorph*0.8; p=mix(p,aTarget,uMorph);
        vec4 mv=modelViewMatrix*vec4(p,1.0); gl_Position=projectionMatrix*mv;
        vFade=(1.0-aTail*0.85)*smoothstep(55.0,3.0,-mv.z)*(1.0-uMorph);
      }`,
    fragmentShader: `varying float vFade; void main(){gl_FragColor=vec4(0.65,0.65,1.0,vFade*0.4);}`
  });
  scene.add(new THREE.LineSegments(streakGeometry, streakMaterial));
  const nebulaMaterial = new THREE.ShaderMaterial({ uniforms, transparent: true, depthWrite: false, depthTest: false,
    vertexShader: `varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.999,1.0);}`,
    fragmentShader: `uniform float uTime; uniform float uMorph; uniform float uSpeed; varying vec2 vUv;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
      float fbm(vec2 p){float f=0.;float a=.5;for(int i=0;i<4;i++){f+=a*noise(p);p=p*2.1+vec2(2.,5.);a*=.5;}return f;}
      void main(){vec2 p=vUv-.5;float r=length(p);float a=atan(p.y,p.x);float cloud=fbm(vec2(a*1.5,r*8.-uTime*.3));
        float mist=cloud*smoothstep(.02,.45,r)*(1.-smoothstep(.4,.8,r));
        vec3 color=mix(vec3(.03,.04,.15),vec3(.23,.07,.25),cloud);
        color+=vec3(.02,.12,.18)*pow(cloud,3.)*uSpeed;
        gl_FragColor=vec4(color*mist*1.4,(1.-uMorph)*.82);
      }`
  });
  const nebula = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), nebulaMaterial); nebula.renderOrder = -10; scene.add(nebula);
  return {
    scene,
    update(time, morph, speed) { uniforms.uTime.value = time; uniforms.uMorph.value = morph; uniforms.uSpeed.value = speed; },
    dispose() { geometry.dispose(); streakGeometry.dispose(); nebula.geometry.dispose(); material.dispose(); streakMaterial.dispose(); nebulaMaterial.dispose(); }
  };
}
