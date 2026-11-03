import * as THREE from 'three';
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass.js';
export function createComicInkPass(){return new ShaderPass({uniforms:{tDiffuse:{value:null},uResolution:{value:new THREE.Vector2(1,1)},uTime:{value:0},uCut:{value:0},uRealm:{value:0}},vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`
 uniform sampler2D tDiffuse;uniform vec2 uResolution;uniform float uTime;uniform float uCut;uniform float uRealm;varying vec2 vUv;
 float comicLuma(vec3 c){return dot(c,vec3(.2126,.7152,.0722));}
 void main(){
  vec4 base=texture2D(tDiffuse,vUv);vec2 px=1.25/uResolution;
  float edge=abs(comicLuma(texture2D(tDiffuse,vUv+vec2(px.x,0.)).rgb)-comicLuma(texture2D(tDiffuse,vUv-vec2(px.x,0.)).rgb))+abs(comicLuma(texture2D(tDiffuse,vUv+vec2(0.,px.y)).rgb)-comicLuma(texture2D(tDiffuse,vUv-vec2(0.,px.y)).rgb));
  vec3 cel=pow(floor(sqrt(max(base.rgb,vec3(0.)))*8.+.5)/8.,vec3(2.));float shade=1.-smoothstep(.04,.45,comicLuma(base.rgb));
  vec2 cell=fract((vUv*uResolution+vec2(sin(uTime*.15)*.8,0.))/7.)-.5;float dots=(1.-smoothstep(.11,.17,length(cell)))*shade*.10*smoothstep(.001,.015,comicLuma(base.rgb));
  float hatch=step(.9,fract((vUv.x+vUv.y)*uResolution.y*.12))*shade*.12*step(2.5,uRealm);
  vec3 color=mix(cel,vec3(.008,.011,.016),smoothstep(.055,.18,edge)*.85);color=mix(color,vec3(.06,.09,.105),dots+hatch);
  float slash=(step(.001,uCut)*(1.-step(.999,uCut)))*(1.-smoothstep(.025,.06,abs(vUv.x+vUv.y-uCut*2.)));
  color=mix(color,vec3(.008,.008,.012),slash*.95);gl_FragColor=vec4(color,base.a);
 }`});}
