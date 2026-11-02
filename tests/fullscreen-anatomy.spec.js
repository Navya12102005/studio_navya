import {test,expect} from '@playwright/test';
async function load(page){await page.goto('/?profile=1');await page.waitForFunction(()=>document.querySelector('canvas[data-camera]'));}
async function at(page,p){await page.evaluate(p=>scrollTo({top:(document.getElementById('home').offsetHeight-innerHeight*.75)*p,behavior:'instant'}),p);await expect.poll(()=>page.locator('.anatomy-canvas canvas').evaluate((el,p)=>Math.abs(JSON.parse(el.dataset.camera).progress-p),p)).toBeLessThan(.02);}

test('fixed GLB canvas remains behind transparent, clickable HTML at desktop and mobile sizes',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(/Shader Error|VALIDATE_STATUS/.test(m.text()))errors.push(m.text());});await load(page);
 await expect(page.locator('canvas')).toHaveCount(1);await expect(page.locator('main')).toHaveCSS('z-index','10');await expect(page.locator('main')).toHaveCSS('pointer-events','auto');await expect(page.locator('main')).not.toHaveCSS('display','none');await expect(page.locator('.flight-scroll-rail,.flight-node-controls')).toHaveCount(0);
 for(const width of[1440,768,390]){await page.setViewportSize({width,height:950});const layout=await page.locator('.anatomy-art').evaluate(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return{parent:el.parentElement.tagName,x:r.x,y:r.y,w:r.width,h:r.height,fixed:s.position,events:s.pointerEvents};});expect(layout).toEqual({parent:'BODY',x:0,y:0,w:width,h:950,fixed:'fixed',events:'none'});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 for(const selector of['.clean-hero','.clean-chapter','.spatial-project','.spatial-project-copy','.micro-telemetry']){const s=await page.locator(selector).first().evaluate(el=>({background:getComputedStyle(el).backgroundColor,border:getComputedStyle(el).borderTopWidth}));expect(s).toEqual({background:'rgba(0, 0, 0, 0)',border:'0px'});}
 const label=await page.locator('[data-spatial-checkpoint="1"]').boundingBox();expect(label.x).toBeGreaterThanOrEqual(0);expect(label.x+label.width).toBeLessThanOrEqual(390);
 await page.screenshot({path:'/tmp/navya-clean-neon-mobile.png'});expect(errors).toEqual([]);
});

test('native scrolling completes a descending spiral and fades text without moving its layout',async({page})=>{
 await load(page);const canvas=page.locator('.anatomy-canvas canvas'),chapter=page.locator('#brain');const initial=await canvas.evaluate(el=>JSON.parse(el.dataset.camera));
 const before=await chapter.evaluate(el=>({top:el.offsetTop,height:el.offsetHeight}));await chapter.scrollIntoViewIfNeeded();await expect.poll(()=>chapter.evaluate(el=>parseFloat(getComputedStyle(el).opacity))).toBeGreaterThan(.8);
 expect(await chapter.evaluate(el=>({top:el.offsetTop,height:el.offsetHeight}))).toEqual(before);await expect(chapter).toHaveCSS('transform','none');await expect(chapter).toHaveCSS('overflow','visible');
 await at(page,.8);const later=await canvas.evaluate(el=>JSON.parse(el.dataset.camera));expect(later.angle-initial.angle).toBeGreaterThan(4.8);expect(later.angle-initial.angle).toBeLessThan(5.2);expect(later.target[1]).toBeLessThan(initial.target[1]-2);await expect(canvas).toHaveAttribute('data-model-position','[0,0,0]');
 await page.getByRole('link',{name:'Skip to portfolio',exact:true}).focus();await page.keyboard.press('Enter');await expect(page.locator('#work')).toBeInViewport();
});

test('realm selection interpolates real neon lights, glass and particle palettes; pause freezes the view',async({page})=>{
 await load(page);const canvas=page.locator('.anatomy-canvas canvas');const lights=await canvas.evaluate(el=>JSON.parse(el.dataset.lighting));expect(lights).toMatchObject({cyan:'00f0ff',violet:'7b2cbf',pink:'ff007f',amber:'ffb703'});
 await page.locator('#work').scrollIntoViewIfNeeded();await expect.poll(()=>canvas.evaluate(el=>JSON.parse(el.dataset.palette).warmth)).toBeLessThan(.1);const tech=await canvas.evaluate(el=>JSON.parse(el.dataset.palette));expect(tech.particles).toBeGreaterThan(100);
 await page.getByRole('tab',{name:/Creative, PR & Strategy/}).click();await expect.poll(()=>canvas.evaluate(el=>JSON.parse(el.dataset.palette).warmth)).toBeGreaterThan(.9);const warm=await canvas.evaluate(el=>JSON.parse(el.dataset.palette));expect(warm.primary).not.toBe(tech.primary);
 await page.screenshot({path:'/tmp/navya-clean-neon-creative.png'});
 await page.getByRole('button',{name:'Explore Startup Club · President'}).click();await expect(page.getByRole('dialog')).toBeVisible();await expect(page.getByRole('dialog')).toHaveCSS('background-color','rgba(0, 0, 0, 0)');await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Pause visual effects'}).click();const frozen=await canvas.getAttribute('data-camera');await page.evaluate(()=>scrollTo(0,1200));await expect(canvas).toHaveAttribute('data-camera',frozen);await expect(page.locator('canvas')).toHaveCount(1);
});

test('four spatial checkpoints complete one turn, with animated organs and working portal choices',async({page})=>{
 await load(page);const canvas=page.locator('.anatomy-canvas canvas');
 await expect(page.locator('[data-spatial-checkpoint]')).toHaveCount(4);
 const organs=await canvas.evaluate(el=>JSON.parse(el.dataset.organs));expect(organs.bpm).toBe(75);expect(organs.brainNodes).toEqual(['BrainLeft','BrainRight']);
 await expect.poll(()=>canvas.evaluate(el=>JSON.parse(el.dataset.organs).heartScale)).not.toBe(organs.heartScale);
 let previousHeight=Infinity;
 for(const [p,angle] of [[0,0],[1/3,Math.PI*2/3],[2/3,Math.PI*4/3],[1,Math.PI*2]]){
  await at(page,p);const pose=await canvas.evaluate(el=>JSON.parse(el.dataset.camera));expect(pose.angle).toBeCloseTo(angle,0);expect(pose.target[1]).toBeLessThanOrEqual(previousHeight);previousHeight=pose.target[1];
 }
 await page.screenshot({path:'/tmp/navya-spiral-portal.png'});
 await page.getByRole('button',{name:'Enter Creative Studio',exact:true}).click();await expect(page.getByRole('tab',{name:/Creative, PR & Strategy/})).toHaveAttribute('aria-selected','true');await expect(page.locator('#work')).toBeInViewport();
});
