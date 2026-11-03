import {test,expect} from '@playwright/test';
import * as THREE from 'three';
import {voxelRealmProgress} from '../lib/voxel-tech-core';

test('Tech Core progress begins only after the preserved heart-split checkpoint',()=>{
 expect(voxelRealmProgress(.75)).toBe(0);expect(voxelRealmProgress(.76)).toBe(0);expect(voxelRealmProgress(.88)).toBeCloseTo(.5,5);expect(voxelRealmProgress(1)).toBe(1);
});

test('continuous camera flight visits atmosphere, voxel brain and code terminals with live scene animation',async({page})=>{
 test.setTimeout(300000);const errors=[];page.on('pageerror',error=>errors.push(error.message));page.on('console',message=>{if(/Shader Error|VALIDATE_STATUS/.test(message.text()))errors.push(message.text());});
 await page.goto('/?profile=1');const canvas=page.locator('.anatomy-canvas canvas');await expect(canvas).toHaveAttribute('data-tech-core',/.+/);const end=await page.locator('#home').evaluate(element=>element.offsetHeight-innerHeight*.75);
 const at=async progress=>{await page.evaluate(({top,progress})=>scrollTo({top:top*progress,behavior:'instant'}),{top:end,progress});await expect.poll(()=>canvas.evaluate((element,expected)=>Math.abs(JSON.parse(element.dataset.camera).progress-expected),progress),{timeout:60000}).toBeLessThan(.01);};
 await at(.75);expect(await canvas.evaluate(element=>JSON.parse(element.dataset.gateway).visible)).toBe(true);expect(await canvas.evaluate(element=>JSON.parse(element.dataset.techCore).active)).toBe(false);
 const captures=[];for(const [progress,sequence,file] of [[.80,'atmospheric-entry','entry'],[.90,'voxel-brain','brain'],[.985,'code-terminals','terminals']]){await at(progress);await expect.poll(()=>canvas.evaluate(element=>JSON.parse(element.dataset.techCore).sequence)).toBe(sequence);captures.push(await canvas.evaluate(element=>JSON.parse(element.dataset.techCore).camera));await page.screenshot({path:`/tmp/navya-voxel-tech-${file}.png`});}
 const data=await canvas.evaluate(element=>JSON.parse(element.dataset.techCore));expect(data.assets).toMatchObject({archBlocks:53,vines:14,terminals:6});expect(data.assets.brainVoxels).toBeGreaterThanOrEqual(500);expect(data.assets.ashParticles).toBeGreaterThanOrEqual(350);expect(data.assets.circuitTiles).toBeGreaterThan(100);expect(new THREE.Vector3(...captures[0]).distanceTo(new THREE.Vector3(...captures[2]))).toBeGreaterThan(20);await expect(page.getByRole('complementary',{name:'Tech Core telemetry'})).toBeVisible();await expect(page.getByText('03 / ACTIVE CODE TERMINALS')).toBeVisible();
 await page.getByRole('button',{name:'Pause realm',exact:true}).click();const frozen=await canvas.getAttribute('data-tech-core');await page.waitForTimeout(300);await expect(canvas).toHaveAttribute('data-tech-core',frozen);await page.getByRole('button',{name:'Resume realm',exact:true}).click();await page.getByRole('button',{name:'Return to anatomy',exact:true}).click();await expect.poll(()=>canvas.evaluate(element=>JSON.parse(element.dataset.techCore).active)).toBe(false);expect(errors).toEqual([]);
});

test('reduced motion keeps the readable gateway and does not start WebGL realm flight',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await expect(page.locator('.anatomy-canvas canvas')).toHaveCount(0);await expect(page.locator('[data-gateway-state="tech-core-online"]')).toContainText('Continue scrolling');await expect(page.getByRole('complementary',{name:'Tech Core telemetry'})).toHaveCount(0);
});
