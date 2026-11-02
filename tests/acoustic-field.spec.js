import {test,expect} from '@playwright/test';
import * as THREE from 'three';
import {acousticResponse,createAcousticField} from '../lib/acoustic-field';

test('acoustic response is bidirectional, bounded and releases owned GPU resources',()=>{
 const idle=acousticResponse(0),fast=acousticResponse(3000);
 expect(fast.frequency).toBeGreaterThan(idle.frequency);expect(fast.speed).toBeGreaterThan(idle.speed);expect(fast.intensity).toBeGreaterThan(idle.intensity);
 expect(acousticResponse(-3000)).toEqual(fast);expect(acousticResponse(1e9)).toEqual(fast);expect(acousticResponse(NaN)).toEqual(idle);
 const scene=new THREE.Scene(),field=createAcousticField(scene,{brain:[0,3,0],spine:[0,1.9,0],heart:[0,.4,.3]},{economy:true});
 const resources=new Set();scene.traverse(node=>{if(node.geometry)resources.add(node.geometry);if(node.material)resources.add(node.material);});
 const disposed=new Set();resources.forEach(resource=>resource.addEventListener('dispose',()=>disposed.add(resource)));
 field.update(1,.016,2400,1);const initial=field.telemetry();
 for(let i=0;i<120;i++)field.update(1+i/60,1/60,0,1);
 expect(field.telemetry().drive).toBeLessThan(initial.drive*.01);expect(field.telemetry().phase).toBeGreaterThan(initial.phase);
 field.dispose();expect(disposed.size).toBe(resources.size);expect(scene.children).toHaveLength(0);
});

test('acoustic shaders render, respond to real scrolling, settle and freeze on pause',async({page})=>{
 const errors=[];page.on('pageerror',error=>errors.push(error.message));page.on('console',message=>{if(/Shader Error|VALIDATE_STATUS/.test(message.text()))errors.push(message.text());});
 await page.goto('/?profile=1');const canvas=page.locator('.anatomy-canvas canvas');await expect(canvas).toHaveAttribute('data-acoustics',/.+/);
 const initial=await canvas.evaluate(el=>JSON.parse(el.dataset.acoustics));expect(initial).toMatchObject({shells:4,vortices:2});expect(initial.anchors[0].position[1]).toBeGreaterThan(initial.anchors[1].position[1]);expect(initial.particlesPerVortex).toBeGreaterThanOrEqual(100);
 await page.screenshot({path:'/tmp/navya-acoustic-brain.png'});
 await canvas.evaluate(el=>{window.__acousticPeak=12;window.__acousticObserver=new MutationObserver(()=>{window.__acousticPeak=Math.max(window.__acousticPeak,JSON.parse(el.dataset.acoustics).frequency);});window.__acousticObserver.observe(el,{attributes:true,attributeFilter:['data-acoustics']});});
 await page.mouse.move(1100,700);await page.mouse.wheel(0,1100);await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(0);await expect.poll(()=>page.evaluate(()=>window.__acousticPeak)).toBeGreaterThan(12.5);
 await page.evaluate(()=>window.__acousticObserver.disconnect());
 await expect.poll(()=>canvas.evaluate(el=>JSON.parse(el.dataset.acoustics).drive)).toBeLessThan(.03);
 await page.evaluate(()=>scrollTo({top:(document.getElementById('home').offsetHeight-innerHeight*.75)*2/3,behavior:'instant'}));
 await expect.poll(()=>canvas.evaluate(el=>JSON.parse(el.dataset.camera).progress)).toBeGreaterThan(.64);
 await page.screenshot({path:'/tmp/navya-acoustic-heart.png'});
 await page.getByRole('button',{name:'Pause visual effects'}).click();const frozen=await canvas.getAttribute('data-acoustics');await page.mouse.wheel(0,500);
 await page.evaluate(()=>new Promise(resolve=>{let frames=0;function frame(){if(++frames===10)resolve();else requestAnimationFrame(frame);}requestAnimationFrame(frame);}));
 await expect(canvas).toHaveAttribute('data-acoustics',frozen);expect(errors).toEqual([]);
});
