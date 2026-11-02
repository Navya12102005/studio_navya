import {test,expect} from '@playwright/test';

test.beforeEach(async({page})=>{await page.addInitScript(()=>sessionStorage.setItem('navya-intro-seen','1'));});
async function ready(page){await page.goto('/?profile=1');await page.waitForFunction(()=>Number(document.querySelector('canvas[data-camera]')?.dataset.nativeTextReadyCount)>60);}
async function at(page,p){await page.evaluate(p=>scrollTo({top:(document.querySelector('.flight-scroll-rail').offsetHeight-innerHeight)*p,behavior:'instant'}),p);await expect.poll(()=>page.locator('.anatomy-canvas canvas').evaluate((el,p)=>Math.abs(JSON.parse(el.dataset.camera).progress-p),p)).toBeLessThan(.0015);}

test('one fixed GLB canvas uses depth-tested native text and preserves browser scroll controls',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(/Shader Error|VALIDATE_STATUS/.test(m.text()))errors.push(m.text());});
 await ready(page);const canvas=page.locator('.anatomy-canvas canvas');
 await expect(page.locator('canvas')).toHaveCount(1);await expect(canvas).toHaveAttribute('data-flight-engine','CatmullRomCurve3');await expect(canvas).toHaveAttribute('data-model-source','/models/skeleton.glb');
 await expect(page.locator('main')).toHaveCSS('display','none');
 const text=await canvas.evaluate(el=>({total:Number(el.dataset.nativeTextCount),ready:Number(el.dataset.nativeTextReadyCount),depth:Number(el.dataset.depthTestedTextCount)}));expect(text.ready).toBeGreaterThan(60);expect(text.depth).toBe(text.total);
 for(const width of[1440,768,390]){await page.setViewportSize({width,height:950});const layout=await page.locator('.anatomy-art').evaluate(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return{parent:el.parentElement.tagName,x:r.x,y:r.y,w:r.width,h:r.height,fixed:s.position,events:s.pointerEvents};});expect(layout).toEqual({parent:'BODY',x:0,y:0,w:width,h:950,fixed:'fixed',events:'none'});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 await page.setViewportSize({width:1440,height:1000});await page.mouse.move(600,450);await page.mouse.wheel(0,650);await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(500);
 const before=await page.evaluate(()=>scrollY);const timeline=page.getByRole('slider',{name:'3D flight timeline'});await timeline.focus();await timeline.press('End');await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(before+1000);
 expect(errors).toEqual([]);
 await page.getByRole('link',{name:'Skip to portfolio',exact:true}).focus();await page.keyboard.press('Enter');await expect(page.locator('main')).not.toHaveCSS('display','none');await expect(page.locator('canvas')).toHaveCount(0);
});

test('spline orbits real anatomy, enters its heart, crosses a portal and reverses between spatial worlds',async({page})=>{
 test.setTimeout(180000);await ready(page);const canvas=page.locator('.anatomy-canvas canvas');
 const pose=()=>canvas.evaluate(el=>JSON.parse(el.dataset.camera));
 await at(page,.08);expect((await pose()).position[0]).toBeGreaterThan(2);
 await at(page,.16);expect((await pose()).position[2]).toBeLessThan(-3);
 await at(page,.24);expect((await pose()).position[0]).toBeLessThan(-2);
 await at(page,.30);let core=await pose();expect(Math.hypot(...core.position.map((v,i)=>v-core.target[i]))).toBeLessThan(.65);
 await at(page,.39);expect((await pose()).zone).toBe('bio-tech');const bio=(await pose()).position;await page.screenshot({path:'/tmp/navya-flight-bio.png'});
 await at(page,.60);await expect(canvas).toHaveAttribute('data-zone','portal');
 const fx=await canvas.evaluate(el=>JSON.parse(el.dataset.postprocessing));expect(fx.enabled).toBe(true);expect(fx.bloom).toBeGreaterThan(.25);expect(fx.chromaticOffset).toBeGreaterThan(.00035);
 await at(page,.67);expect((await pose()).zone).toBe('creative-studio');const studio=(await pose()).position;expect(studio[0]-bio[0]).toBeGreaterThan(10);expect(studio[2]).toBeLessThan(bio[2]-20);
 const worlds=await canvas.evaluate(el=>JSON.parse(el.dataset.worldCoordinates));expect(worlds.anatomy).toEqual([0,0,0]);expect(worlds.creative[2]).toBeLessThan(worlds.bioTech[2]-20);await page.screenshot({path:'/tmp/navya-flight-studio.png'});
 await at(page,.39);const reversed=(await pose()).position;expect(Math.hypot(...reversed.map((v,i)=>v-bio[i]))).toBeLessThan(.15);
});

test('spatial project actions open working dialogs with focus return; contact opens the readable form',async({page})=>{
 await ready(page);await page.getByRole('button',{name:'Fly to Creative Studio world'}).click();
 const opener=page.getByRole('button',{name:'Explore Startup Club · President'});await expect(opener).toBeVisible();await opener.click();await expect(page.getByRole('dialog')).toContainText('Startup Club President');
 await page.keyboard.press('Escape');await expect(opener).toBeFocused();
 await page.getByRole('button',{name:'Fly to contact',exact:true}).click();await page.getByRole('button',{name:'Open contact form',exact:true}).click();
 await expect(page.getByLabel('Your name',{exact:true})).toBeVisible();await expect(page.locator('canvas')).toHaveCount(0);await expect(page.locator('main')).not.toHaveCSS('display','none');
 await page.screenshot({path:'/tmp/navya-readable-contact.png'});
});
