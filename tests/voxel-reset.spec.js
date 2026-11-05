import {test,expect} from '@playwright/test';
import {existsSync} from 'node:fs';
import {resolve} from 'node:path';

test('former comic realm implementation is absent from the active source tree',()=>{
 const removed=['app/comic.css','components/ComicNarrative.jsx','lib/comic-world.js','lib/comic-ink.js','lib/comic-tools.js','lib/comic-navigation.js'];
 for(const file of removed)expect(existsSync(resolve(file)),`${file} should remain purged`).toBe(false);
});

test('voxel anatomy, CAD telemetry and heart split remain before three active portal routes',async({page})=>{
 test.setTimeout(240000);const errors=[];page.on('pageerror',error=>errors.push(error.message));page.on('console',message=>{if(/Shader Error|VALIDATE_STATUS/.test(message.text()))errors.push(message.text());});
 await page.goto('/?profile=1');const canvas=page.locator('.anatomy-canvas canvas');await expect(canvas).toHaveAttribute('data-model-source','/models/skeleton.glb');await expect(canvas).toHaveAttribute('data-inspection',/.+/);expect(await canvas.getAttribute('data-comic')).toBeNull();
 const endpoint=(await page.locator('#home').evaluate(element=>element.offsetHeight))-await page.evaluate(()=>innerHeight*.75);await page.evaluate(top=>scrollTo({top,behavior:'instant'}),endpoint*.75);await expect.poll(()=>canvas.evaluate(element=>JSON.parse(element.dataset.gateway).visible),{timeout:60000}).toBe(true);await expect.poll(()=>canvas.evaluate(element=>JSON.parse(element.dataset.gateway).count)).toBe(3);await expect.poll(()=>canvas.evaluate(element=>JSON.parse(element.dataset.narrative).heartVisible)).toBe(false);
 const gateway=page.locator('[data-gateway-state="tech-core-online"]');await expect(gateway).toBeVisible();await expect(gateway).toContainText('Tech Core, Bio Sanctuary or Creative Studio');await expect(gateway.getByRole('button')).toHaveCount(0);await expect(page.getByRole('navigation',{name:/realm/i})).toHaveCount(0);expect(errors).toEqual([]);
});
