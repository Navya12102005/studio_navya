import {test,expect} from '@playwright/test';
import {codeBrainMorph,CODE_TOKENS} from '../lib/code-brain';
test('code cloud morph completes before the surgical cut and is scroll-reversible',()=>{
 expect(codeBrainMorph(0)).toBe(0);expect(codeBrainMorph(.04)).toBeGreaterThan(0);expect(codeBrainMorph(.075)).toBe(1);expect(codeBrainMorph(.24)).toBe(1);expect(codeBrainMorph(0)).toBe(0);expect(CODE_TOKENS).toContain('def build():');expect(CODE_TOKENS).toContain('temp = 0.7');
});
test('master installation morphs actual neural surfaces and preserves Tech / Bio / Creative checkpoints',async({page})=>{
 test.setTimeout(300000);const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(/Shader Error|VALIDATE_STATUS/.test(m.text()))errors.push(m.text());});
 await page.goto('/?profile=1');const canvas=page.locator('.anatomy-canvas canvas');await expect(canvas).toHaveAttribute('data-code-brain',/.+/);const start=await canvas.evaluate(el=>JSON.parse(el.dataset.codeBrain));expect(start).toMatchObject({morph:0,cloudVisible:true,glyphs:16});expect(start.particles).toBeGreaterThanOrEqual(700);await page.screenshot({path:'/tmp/navya-task26-code-cloud.png'});
 const at=async p=>{await page.evaluate(p=>scrollTo({top:(document.getElementById('home').offsetHeight-innerHeight*.75)*p,behavior:'instant'}),p);await expect.poll(()=>canvas.evaluate((el,p)=>Math.abs(JSON.parse(el.dataset.narrative).progress-p),p)).toBeLessThan(.008);};
 await at(.09);await expect.poll(()=>canvas.evaluate(el=>JSON.parse(el.dataset.codeBrain).morph)).toBe(1);expect(await canvas.evaluate(el=>JSON.parse(el.dataset.codeBrain).cloudVisible)).toBe(false);
 await at(.24);await expect(page.locator('[data-narrative-label="1"]')).toContainText('PROMPT ENGINEER & VIBE CODER');await page.screenshot({path:'/tmp/navya-task26-tech-brain.png'});
 await at(.375);await expect(page.locator('[data-narrative-label="3"]')).toBeVisible();await expect(page.locator('[data-narrative-label="3"]')).toContainText('BIOENGINEERING & BIOMEDICAL INNOVATION');await expect(page.locator('[data-narrative-label="3"]')).toContainText('HEALTHCARE CONTRIBUTOR');await page.screenshot({path:'/tmp/navya-task26-bio-spine.png'});
 await at(.75);await expect.poll(()=>canvas.evaluate(el=>JSON.parse(el.dataset.narrative).heartVisible)).toBe(false);await expect(page.locator('[data-narrative-label="2"]')).toContainText('STUDIO NAVYA');await expect(page.getByRole('tab',{name:/Creative, PR & Strategy/})).toHaveAttribute('aria-selected','true');expect(await canvas.evaluate(el=>JSON.parse(el.dataset.gateway).visible)).toBe(true);await page.screenshot({path:'/tmp/navya-task26-creative-heart.png'});
 await at(0);await expect.poll(()=>canvas.evaluate(el=>JSON.parse(el.dataset.codeBrain).morph)).toBe(0);expect(await canvas.evaluate(el=>JSON.parse(el.dataset.codeBrain).cloudVisible)).toBe(true);
 await page.getByRole('button',{name:'Hide 3D'}).click();await expect(page.locator('.anatomy-canvas canvas')).toHaveCount(0);await expect(page.getByRole('button',{name:'Explore biomedical foundation',exact:true})).toBeVisible();expect(errors).toEqual([]);
});
