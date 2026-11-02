import {test,expect} from '@playwright/test';
import * as THREE from 'three';
import {createLobeEngine} from '../lib/lobe-engine';

test('lobe engine releases effects while preserving the original model',()=>{
 const scene=new THREE.Scene(),model=new THREE.Group();scene.add(model);let originalDisposals=0;
 for(const name of ['BrainLeft','BrainRight']){const node=new THREE.Mesh(new THREE.BoxGeometry(.4,.6,.4),new THREE.MeshBasicMaterial());node.name=name;node.geometry.addEventListener('dispose',()=>originalDisposals++);node.material.addEventListener('dispose',()=>originalDisposals++);model.add(node);}
 const engine=createLobeEngine(scene,{model,anchors:{brain:[0,3,0]}},{economy:true});engine.update(1,1,1);expect(engine.telemetry()).toMatchObject({separation:1,sparkPaths:4,coreFibers:5});expect(model.getObjectByName('left-synaptic-pulse-paths')).toBeDefined();
 engine.dispose();expect(originalDisposals).toBe(0);expect(scene.children).toEqual([model]);for(const node of model.children){expect(node.children).toHaveLength(0);node.geometry.dispose();node.material.dispose();}
});

test('lobe optics, copper traces, tracked glass HUDs and mouse parallax respect the cranial phase',async({page})=>{
 test.setTimeout(180000);const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(/Shader Error|VALIDATE_STATUS/.test(m.text()))errors.push(m.text());});
 await page.goto('/?profile=1');const canvas=page.locator('.anatomy-canvas canvas');await expect(canvas).toHaveAttribute('data-lobes',/.+/);
 const materials=await canvas.evaluate(el=>JSON.parse(el.dataset.physicalMaterials));const brain=materials.filter(m=>m.name.includes('brain'));expect(brain).toHaveLength(2);for(const m of brain)expect(m).toMatchObject({transmission:.92,clearcoat:1});
 const initial=await canvas.evaluate(el=>JSON.parse(el.dataset.lobes));expect(initial).toMatchObject({sparkPaths:4,coreFibers:5,copperTraces:true,lights:['00f0ff','7b2cbf','ff007f']});expect(initial.sparkPoints).toBeGreaterThanOrEqual(128);
 await page.evaluate(()=>scrollTo({top:(document.getElementById('home').offsetHeight-innerHeight*.75)*.24,behavior:'instant'}));await expect.poll(()=>canvas.evaluate(el=>JSON.parse(el.dataset.lobes).separation)).toBeGreaterThan(.98);
 const left=page.locator('[data-narrative-label="0"]'),right=page.locator('[data-narrative-label="1"]');await expect(left).toBeVisible();await expect(right).toBeVisible();await expect(left).toContainText('COMPUTATIONAL BIOSENSORS');await expect(right).toContainText('JAVA, GENERATIVE AI WORKFLOWS');
 for(const el of[left,right]){await expect(el).toHaveCSS('background-color','rgba(0, 0, 0, 0)');await expect(el).toHaveCSS('overflow','visible');}
 await page.mouse.move(1100,200);await expect.poll(()=>left.evaluate(el=>JSON.parse(el.dataset.parallax)[0])).toBeGreaterThan(.4);const first=await left.getAttribute('data-anchor');await page.mouse.move(200,700);await expect.poll(()=>left.evaluate(el=>JSON.parse(el.dataset.parallax)[0])).toBeLessThan(-.5);expect(await left.getAttribute('data-anchor')).not.toBe(first);await page.screenshot({path:'/tmp/navya-lobe-huds-desktop.png'});
 await page.setViewportSize({width:390,height:950});await page.evaluate(()=>scrollTo({top:(document.getElementById('home').offsetHeight-innerHeight*.75)*.24,behavior:'instant'}));await expect(left).toBeVisible();await expect(right).toBeVisible();
 for(const label of[left,right]){await expect.poll(()=>label.evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight;})).toBe(true);}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:'/tmp/navya-lobe-huds-mobile.png'});
 await page.getByRole('button',{name:'Pause visual effects'}).click();const frozen=await canvas.getAttribute('data-lobes');await page.mouse.move(350,500);await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));await expect(canvas).toHaveAttribute('data-lobes',frozen);expect(errors).toEqual([]);
});
