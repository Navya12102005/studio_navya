import {test,expect} from '@playwright/test';

test('authored anatomy is rebuilt as interactive optical-glass voxel regions',async({page})=>{
 test.setTimeout(240000);const errors=[];page.on('pageerror',error=>errors.push(error.message));await page.goto('/?profile=1');const canvas=page.locator('.anatomy-canvas canvas');await expect(canvas).toBeVisible();const end=await page.locator('#home').evaluate(element=>element.offsetHeight-innerHeight*.75);
 await expect(canvas).toHaveAttribute('data-voxel-anatomy',/.+/);await page.evaluate(top=>scrollTo({top:top*.16,behavior:'instant'}),end);await expect.poll(()=>canvas.evaluate(element=>JSON.parse(element.dataset.voxelAnatomy).integrity),{timeout:60000}).toBeGreaterThan(.98);const anatomy=await canvas.evaluate(element=>JSON.parse(element.dataset.voxelAnatomy));expect(anatomy.blocks).toBeGreaterThan(1000);expect(anatomy.regions).toEqual(['head','spine','thorax','heart']);expect(anatomy.ior).toBe(1.52);
 const before=anatomy.orbit;await page.mouse.move(500,400);await page.mouse.down();await page.mouse.move(680,470,{steps:4});await page.mouse.up();await expect.poll(()=>canvas.evaluate((element,prior)=>Math.abs(JSON.parse(element.dataset.voxelAnatomy).orbit[1]-prior[1]),before)).toBeGreaterThan(.2);await page.screenshot({path:'/tmp/navya-voxel-anatomy-intro.png'});expect(errors).toEqual([]);
});

test('heart burst condenses three spatial voxel gateway anchors',async({page})=>{
 test.setTimeout(180000);await page.goto('/?profile=1');const canvas=page.locator('.anatomy-canvas canvas'),end=await page.locator('#home').evaluate(element=>element.offsetHeight-innerHeight*.75);await expect(canvas).toHaveAttribute('data-gateway',/.+/);await page.evaluate(top=>scrollTo({top:top*.755,behavior:'instant'}),end);await expect.poll(()=>canvas.evaluate(element=>JSON.parse(element.dataset.gateway).count),{timeout:60000}).toBe(3);const gateway=await canvas.evaluate(element=>JSON.parse(element.dataset.gateway));expect(gateway.anchors).toEqual(['01 TECH CORE','02 BIO SANCTUARY','03 CREATIVE STUDIO']);await page.screenshot({path:'/tmp/navya-voxel-anatomy-gateway.png'});
});
