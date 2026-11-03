import * as THREE from 'three';
export const CODE_TOKENS=['def build():','return ai()','for x in y:','prompt()','temp = 0.7','seed = 42','python','vibe = True','data.pipe()','model.run()','{}','</>','if ready:','yield x','import ai','while True:'];
export function codeBrainMorph(progress){return THREE.MathUtils.smoothstep(progress,.005,.075);}
export function createCodeBrain(sculpture,{economy=false}={}){
 const atlas=document.createElement('canvas');atlas.width=512;atlas.height=256;const context=atlas.getContext('2d');const family=getComputedStyle(document.body).getPropertyValue('--font-jetbrains').trim()||'monospace';context.font=`24px ${family}`;context.textAlign='center';context.textBaseline='middle';context.fillStyle='#fff';CODE_TOKENS.forEach((token,i)=>context.fillText(token,(i%4)*128+64,Math.floor(i/4)*64+32,120));
 const texture=new THREE.CanvasTexture(atlas);texture.minFilter=THREE.LinearFilter;texture.magFilter=THREE.LinearFilter;texture.generateMipmaps=false;
 const uniforms={uTime:{value:0},uMorph:{value:0},uPixelRatio:{value:1},uAtlas:{value:texture}};
 const material=new THREE.ShaderMaterial({uniforms,transparent:true,depthWrite:false,depthTest:false,blending:THREE.NormalBlending,
  vertexShader:`uniform float uTime;uniform float uMorph;uniform float uPixelRatio;attribute vec3 aScatter;attribute float aSeed;attribute float aHero;varying float vSeed;void main(){vSeed=aSeed;vec3 p=position+aScatter*(1.-uMorph);float angle=(1.-uMorph)*(uTime*.12+aSeed*.6);p.xz=mat2(cos(angle),-sin(angle),sin(angle),cos(angle))*p.xz;vec4 view=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*view;float size=clamp((76.+aSeed*30.)/max(.3,-view.z),8.,28.);gl_PointSize=mix(size,clamp(size*4.5,48.,128.),aHero)*uPixelRatio;}`,
  fragmentShader:`uniform sampler2D uAtlas;uniform float uMorph;varying float vSeed;void main(){float glyph=floor(vSeed*15.999);vec2 tile=vec2(mod(glyph,4.),3.-floor(glyph/4.));vec2 uv=(tile+vec2(gl_PointCoord.x,1.-gl_PointCoord.y))/vec2(4.);float ink=texture2D(uAtlas,uv).a;float alpha=ink*(1.-smoothstep(.5,1.,uMorph));if(alpha<.01)discard;vec3 color=mix(vec3(0.,.94,1.),vec3(.482,.172,.75),vSeed);gl_FragColor=vec4(color*1.5,alpha*.8);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`});
 const entries=[];
 for(const name of ['BrainLeft','BrainRight']){
  const mesh=sculpture.model.getObjectByName(name),attr=mesh.geometry.attributes.position,count=economy?350:800,positions=new Float32Array(count*3),scatter=new Float32Array(count*3),seeds=new Float32Array(count),heroes=new Float32Array(count);let heroCount=0;
  for(let i=0;i<count;i++){const n=Math.floor(i/count*attr.count),seed=(i*.61803398875)%1;positions.set([attr.getX(n),attr.getY(n),attr.getZ(n)],i*3);scatter.set([Math.sin(i*2.4)*.22,Math.cos(i*1.7)*.22,Math.sin(i*.9)*.18],i*3);seeds[i]=seed;heroes[i]=i%Math.ceil(count/4)===0?1:0;heroCount+=heroes[i];}
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setAttribute('aScatter',new THREE.BufferAttribute(scatter,3));geometry.setAttribute('aSeed',new THREE.BufferAttribute(seeds,1));geometry.setAttribute('aHero',new THREE.BufferAttribute(heroes,1));const points=new THREE.Points(geometry,material);points.name=`code-cloud-${name}`;points.frustumCulled=false;points.raycast=()=>{};mesh.add(points);entries.push({mesh,points,geometry,heroCount,opacity:mesh.material.opacity,depthWrite:mesh.material.depthWrite});
 }
 let morph=0,time=0;
 return{
  update(t,progress,pixelRatio){time=t;morph=codeBrainMorph(progress);uniforms.uTime.value=t;uniforms.uMorph.value=morph;uniforms.uPixelRatio.value=pixelRatio;entries.forEach(({mesh,points})=>{mesh.material.opacity=morph;mesh.material.depthWrite=morph>.99;points.visible=morph<.999;});return morph;},
  telemetry(){return{time,morph,heroGlyphs:entries.reduce((n,e)=>n+e.heroCount,0),glyphs:CODE_TOKENS.length,particles:entries.reduce((n,entry)=>n+entry.geometry.attributes.position.count,0),cloudVisible:morph<.999,target:'authored GLB neural surfaces'};},
  dispose(){entries.forEach(({mesh,points,geometry,opacity,depthWrite})=>{points.removeFromParent();geometry.dispose();mesh.material.opacity=opacity;mesh.material.depthWrite=depthWrite;});material.dispose();texture.dispose();}
 };
}
