import {test,expect} from '@playwright/test';
import {surgicalState} from '../lib/surgical-narrative';
import {spiralPose} from '../lib/spiral-camera';

test('surgical phases are reversible and camera holds the heart through impact',()=>{
 const initial=surgicalState(0),cut=surgicalState(.1),split=surgicalState(.24),impact=surgicalState(.61),creative=surgicalState(.75);
 expect(initial.separation).toBe(0);expect(cut.laser).toBeGreaterThan(.5);expect(split.separation).toBe(1);expect(split.burst).toBe(0);expect(impact.blade).toBe(1);expect(impact.burst).toBeGreaterThan(0);expect(creative).toMatchObject({burst:1,creativeMix:1});
 expect(surgicalState(0)).toEqual(initial);
 const anchors={brain:[0,3,0],spine:[0,1.9,0],heart:[0,.4,.3]};
 expect(spiralPose(.55,anchors).position.toArray()).toEqual(spiralPose(.7,anchors).position.toArray());
 expect(spiralPose(.12,anchors).target.y).toBe(3);expect(spiralPose(1,anchors).angle).toBeCloseTo(Math.PI*2);
});

test('scroll splits real brain nodes, pierces the heart, bursts into Creative and restores on reverse',async({page})=>{
 test.setTimeout(180000);const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(/Shader Error|VALIDATE_STATUS/.test(m.text()))errors.push(m.text());});
 await page.goto('/?profile=1');const canvas=page.locator('.anatomy-canvas canvas');await expect(canvas).toHaveAttribute('data-narrative',/.+/);
 const initial=await canvas.evaluate(el=>JSON.parse(el.dataset.narrative));
 const at=async p=>{await page.evaluate(p=>scrollTo({top:(document.getElementById('home').offsetHeight-innerHeight*.75)*p,behavior:'instant'}),p);await expect.poll(()=>canvas.evaluate((el,p)=>Math.abs(JSON.parse(el.dataset.narrative).progress-p),p)).toBeLessThan(.006);};
 await at(.1);expect((await canvas.evaluate(el=>JSON.parse(el.dataset.narrative))).laser).toBeGreaterThan(.7);
 await at(.24);await expect.poll(()=>canvas.evaluate(el=>JSON.parse(el.dataset.palette).warmth)).toBeLessThan(.1);const split=await canvas.evaluate(el=>JSON.parse(el.dataset.narrative));expect(split.hemispherePositions[0][0]).toBeGreaterThan(initial.hemispherePositions[0][0]+.4);expect(split.hemispherePositions[1][0]).toBeLessThan(initial.hemispherePositions[1][0]-.4);
 await expect(page.locator('[data-narrative-label="0"]')).toBeVisible();await expect(page.locator('[data-narrative-label="1"]')).toBeVisible();await expect(page.locator('[data-narrative-label="0"]')).toContainText('BIOMEDICAL INNOVATION');await expect(page.locator('[data-narrative-label="1"]')).toContainText('PYTHON ARCHITECT');await page.screenshot({path:'/tmp/navya-surgical-brain-split.png'});
 await at(.375);expect(await canvas.evaluate(el=>JSON.parse(el.dataset.acoustics))).toMatchObject({spinalRings:4,corridorVisible:true});
 await at(.59);const blade=await canvas.evaluate(el=>JSON.parse(el.dataset.narrative));expect(blade.blade).toBeGreaterThan(.98);expect(blade.burst).toBe(0);
 await at(.665);await page.screenshot({path:'/tmp/navya-surgical-heart-impact.png'});
 await at(.75);await expect.poll(()=>canvas.evaluate(el=>JSON.parse(el.dataset.palette).warmth)).toBeGreaterThan(.9);await expect.poll(()=>canvas.evaluate(el=>JSON.parse(el.dataset.narrative).heartVisible)).toBe(false);await expect(page.getByRole('tab',{name:/Creative, PR & Strategy/})).toHaveAttribute('aria-selected','true');
 await expect(page.locator('[data-narrative-label="2"]')).toBeVisible();expect((await canvas.evaluate(el=>JSON.parse(el.dataset.narrative))).fragmentCount).toBeGreaterThanOrEqual(400);await page.screenshot({path:'/tmp/navya-surgical-heart-burst.png'});
 await at(0);const restored=await canvas.evaluate(el=>JSON.parse(el.dataset.narrative));expect(restored.heartVisible).toBe(true);expect(restored.burst).toBe(0);expect(restored.hemispherePositions[0][0]).toBeCloseTo(initial.hemispherePositions[0][0],3);await expect(page.getByRole('tab',{name:/Tech & Bioengineering/})).toHaveAttribute('aria-selected','true');expect(errors).toEqual([]);
});
