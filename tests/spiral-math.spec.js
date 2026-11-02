import {test,expect} from '@playwright/test';
import {cardiacPulse,spiralPose} from '../lib/spiral-camera';
test('75 BPM cardiac waveform repeats every 800 ms and preserves the four anatomical camera stops',()=>{
 for(const t of [.01,.08,.144,.288,.55]){
  expect(cardiacPulse(t+.8).scale).toBeCloseTo(cardiacPulse(t).scale,10);
  expect(cardiacPulse(t+.8).flash).toBeCloseTo(cardiacPulse(t).flash,10);
 }
 expect(cardiacPulse(.08*.8).scale).toBeLessThan(1);
 expect(cardiacPulse(.18*.8).scale).toBeGreaterThan(1.07);
 const anchors={brain:[0,3,0],spine:[0,1.9,0],heart:[0,.4,.3]};
 for(const [p,y] of [[0,2.75],[.25,3],[.375,1.9],[.5,.4],[.75,.4],[1,-1.7]]){
  const pose=spiralPose(p,anchors);expect(pose.target.y).toBeCloseTo(y,10);expect(pose.radius).toBeGreaterThan(0);
 }
 // Camera and focus stay continuous on either side of the organ boundaries.
 for(const p of [.1,.25,.375,.5,.75])expect(spiralPose(p-1e-5,anchors).position.distanceTo(spiralPose(p+1e-5,anchors).position)).toBeLessThan(.001);
});
