import {test,expect} from '@playwright/test';
import * as THREE from 'three';
import {createCrystalArt} from '../lib/crystal-art';

test('crystal art follows the source mesh transforms and disposes all owned resources',()=>{
 const scene=new THREE.Scene(),model=new THREE.Group();scene.add(model);
 for(const name of ['CervicalSpine','ThoracicSpine','BrainLeft','BrainRight','VascularNodes']){const node=new THREE.Mesh(new THREE.BoxGeometry(.1,.1,.1),new THREE.MeshBasicMaterial());node.name=name;model.add(node);}
 const art=createCrystalArt(scene,{model,anchors:{heart:[0,.4,.3]}},{economy:true});
 const dust=model.getObjectByName('diamond-dust-BrainLeft');expect(dust.parent.name).toBe('BrainLeft');expect(dust.geometry.attributes.position.count).toBe(140);
 const originals=new Set();model.traverse(n=>{if(n.isMesh){originals.add(n.geometry);originals.add(n.material);}});
 const resources=new Set();scene.traverse(n=>{if(n.geometry&&!originals.has(n.geometry))resources.add(n.geometry);if(n.material&&!originals.has(n.material))resources.add(n.material);});
 const disposed=new Set();resources.forEach(r=>r.addEventListener('dispose',()=>disposed.add(r)));
 art.update(1,1,0);expect(art.telemetry()).toMatchObject({roses:3,petals:63,filigreeWires:9,botanicalsVisible:true});art.update(2,1,1);expect(art.telemetry().botanicalsVisible).toBe(false);
 art.dispose();expect(disposed.size).toBe(resources.size);expect(model.getObjectByName('diamond-dust-BrainLeft')).toBeUndefined();expect(model.children).toHaveLength(5);
 originals.forEach(r=>r.dispose());
});

test('exact crystal optics, diamond particles and roses render through the existing surgical phases',async({page})=>{
 test.setTimeout(180000);const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(/Shader Error|VALIDATE_STATUS/.test(m.text()))errors.push(m.text());});
 await page.goto('/?profile=1');const canvas=page.locator('.anatomy-canvas canvas');await expect(canvas).toHaveAttribute('data-crystal-art',/.+/);
 const materials=await canvas.evaluate(el=>JSON.parse(el.dataset.physicalMaterials));for(const m of materials)expect(m).toMatchObject({transmission:m.name.includes('brain')?.92:.95,roughness:.08,clearcoat:1,clearcoatRoughness:.1,ior:1.52,thickness:1.2});
 const art=await canvas.evaluate(el=>JSON.parse(el.dataset.crystalArt));expect(art).toMatchObject({roses:3,petals:63,filigreeWires:9});expect(art.dustPoints).toBeGreaterThanOrEqual(500);expect(art.dustRegions).toContain('ThoracicSpine');await page.screenshot({path:'/tmp/navya-crystal-cranium.png'});
 const at=async p=>{await page.evaluate(p=>scrollTo({top:(document.getElementById('home').offsetHeight-innerHeight*.75)*p,behavior:'instant'}),p);await expect.poll(()=>canvas.evaluate((el,p)=>Math.abs(JSON.parse(el.dataset.narrative).progress-p),p)).toBeLessThan(.008);};
 await at(.55);await page.screenshot({path:'/tmp/navya-crystal-botanical-heart.png'});expect(await canvas.evaluate(el=>JSON.parse(el.dataset.crystalArt).botanicalsVisible)).toBe(true);
 await at(.75);await expect.poll(()=>canvas.evaluate(el=>JSON.parse(el.dataset.crystalArt).botanicalsVisible)).toBe(false);expect(await canvas.evaluate(el=>JSON.parse(el.dataset.gateway).visible)).toBe(true);await expect(page.getByRole('tab',{name:/Creative, PR & Strategy/})).toHaveAttribute('aria-selected','true');
 await at(0);expect(await canvas.evaluate(el=>JSON.parse(el.dataset.crystalArt).botanicalsVisible)).toBe(true);
 await page.getByRole('button',{name:'Pause visual effects'}).click();const frozen=await canvas.getAttribute('data-crystal-art');await page.mouse.move(1100,700);await page.mouse.wheel(0,500);await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));await expect(canvas).toHaveAttribute('data-crystal-art',frozen);expect(errors).toEqual([]);
});
