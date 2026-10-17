import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

// The public choreography can be checked without a browser or extra dependencies.
const context = vm.createContext({window:{},document:{querySelector:()=>null},matchMedia:()=>({matches:false})});
vm.runInContext(readFileSync(new URL('../evening.js',import.meta.url),'utf8'),context);
const sample = context.window.StudioEvening.sample;
const first=sample(0),last=sample(1);
assert.ok(last.sunY>first.sunY+65 && last.sunOpacity===0,'Sun must descend and disappear.');
assert.ok(last.stars>.9 && last.skyNight>.85 && last.moon>.6,'Night follows sunset.');
assert.ok(last.lamp>first.lamp*5 && last.roomAmbient<first.roomAmbient,'Lamplight grows as daylight fades.');
assert.equal(first.wineLevel,1);assert.equal(last.wineLevel,0);
assert.equal(first.sleep,1);assert.equal(last.standing,1);
assert.ok(last.dogX<first.dogX-100 && last.dogY>first.dogY+90,'Dog changes both pose and place.');
assert.ok(last.pillowY>820 && last.pillowY<920,'Pillow lands on the floor.');
assert.ok(last.paperY>840 && last.paperY<920 && last.paperUnroll===1,'Paper lands and unrolls.');
assert.ok(last.paperX<sample(.61).paperX-180,'Paper rolls along the floor after landing.');

let previous=first;
for(let i=0;i<=1000;i++){
  const p=i/1000,f=sample(p);
  for(const value of Object.values(f))if(typeof value==='number')assert.ok(Number.isFinite(value));
  for(const key of ['sleep','awake','standing','sunOpacity','skyNight','upperNight','stars','moon','lamp','wineLevel','paperFloorOpacity'])assert.ok(f[key]>=0&&f[key]<=1,key);
  assert.ok(Math.abs(f.sleep+f.awake+f.standing-1)<1e-9,'Pose blends must not double the animal.');
  assert.ok(f.sunY>=previous.sunY && f.lamp>=previous.lamp && f.wineLevel<=previous.wineLevel,'Light, sun and wine must follow one direction.');
  assert.ok(Math.abs(f.dogX-previous.dogX)<3 && Math.abs(f.dogY-previous.dogY)<3,'Dog cannot jump between scroll frames.');
  assert.ok(Math.abs(f.paperX-previous.paperX)<3 && Math.abs(f.paperY-previous.paperY)<5,'Paper path cannot reset between phases.');
  assert.equal(JSON.stringify(sample(p)),JSON.stringify(f),'Revisiting a scroll position restores its exact frame.');
  previous=f;
}
for(const point of [.23,.39,.43,.44,.55,.57,.61,.68,.83,.89]){
  const a=sample(point-1e-7),b=sample(point+1e-7);
  for(const key of ['sunY','dogX','dogY','paperX','paperY','paperAngle','pillowY'])assert.ok(Math.abs(a[key]-b[key])<.01,'Phase continuity: '+key);
}
assert.equal(JSON.stringify(sample(-2)),JSON.stringify(first));
assert.equal(JSON.stringify(sample(2)),JSON.stringify(last));
assert.equal(JSON.stringify(sample(NaN)),JSON.stringify(first));
assert.equal(JSON.stringify(sample(.4,{reduced:true})),JSON.stringify(sample(.45,{reduced:true})),'Reduced motion must show settled states.');
const settled=sample(.65,{reduced:true});
assert.ok(Math.abs(settled.dogY-126)<1e-9 && settled.paperUnroll===1 && settled.pillowY===870,'Reduced-motion objects must rest on the floor.');
const preview=sample(.2,{night:true});
assert.equal(preview.wineLevel,sample(.2).wineLevel);assert.equal(preview.dogX,sample(.2).dogX);
assert.ok(preview.lamp>.99 && preview.sunOpacity===0,'Night preview changes lighting, not story action.');
console.log('Evening choreography passed: 1,001 scroll samples, reverse determinism, phase continuity, night preview and reduced motion.');
