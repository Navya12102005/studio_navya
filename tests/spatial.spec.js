import { test, expect } from '@playwright/test';
import { sampleHelix } from '../lib/spatial';

test.beforeEach(async ({page})=>{await page.addInitScript(()=>sessionStorage.setItem('navya-intro-seen','1'));});

test('helical path makes one full reversible turn, descends and tightens into the heart',()=>{
  const samples=Array.from({length:101},(_,i)=>sampleHelix(i/100));
  expect(samples[0].angle).toBe(0);expect(samples.at(-1).angle).toBeCloseTo(Math.PI*2,8);
  for(let i=26;i<samples.length;i++){
    expect(samples[i].angle).toBeGreaterThanOrEqual(samples[i-1].angle);
    expect(samples[i].elevation).toBeLessThanOrEqual(samples[i-1].elevation);
    expect(samples[i].radius).toBeLessThanOrEqual(samples[i-1].radius);
    expect(samples[i].position.every(Number.isFinite)).toBe(true);
  }
  expect(samples.at(-1).radius).toBeLessThan(.2);
  for(const p of [.2,.5,.8])expect(sampleHelix(p)).toEqual(samples[Math.round(p*100)]);
});

test('requested fonts are local and content stays box-free on desktop and mobile',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
  await page.evaluate(()=>document.fonts.ready);
  const fonts=await page.evaluate(()=>({body:getComputedStyle(document.body).fontFamily,title:getComputedStyle(document.querySelector('h1')).fontFamily,mono:getComputedStyle(document.querySelector('.micro-telemetry')).fontFamily,loaded:[...document.fonts].filter(f=>f.status==='loaded').length}));
  expect(fonts.body).not.toBe(fonts.title);expect(fonts.mono).not.toBe(fonts.body);expect(fonts.loaded).toBeGreaterThanOrEqual(3);
  for(const width of [390,768,1440]){
    await page.setViewportSize({width,height:950});
    for(const selector of ['.hero-editorial','.spatial-project','.spatial-project-copy','.micro-telemetry']){
      const styles=await page.locator(selector).first().evaluate(el=>{const s=getComputedStyle(el);return{background:s.backgroundColor,border:s.borderTopWidth,overflow:s.overflow};});
      expect(styles.background).toBe('rgba(0, 0, 0, 0)');expect(styles.border).toBe('0px');expect(styles.overflow).not.toBe('hidden');
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  await page.getByRole('tab',{name:/Creative, PR & Strategy/}).click();
  await expect(page.locator('.spatial-project')).toHaveCount(6);
  await expect(page.locator('.portfolio-card,.retro-window-bar')).toHaveCount(0);
  await page.screenshot({path:'/tmp/navya-spatial-reduced-mobile.png'});
});

test('live helix, world labels, gradient quotes and both WebGL realms react to real inputs',async({page})=>{
  test.setTimeout(180000);const errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(/Shader Error|VALIDATE_STATUS/.test(m.text()))errors.push(m.text());});
  await page.goto('/?profile=1');const canvas=page.locator('.anatomy-canvas canvas');
  await expect(canvas).toHaveAttribute('data-native-text',/NEURAL ORIGIN/);
  await page.waitForFunction(()=>document.querySelector('[data-world-anchor=brain]')?.dataset.worldPosition);
  const angles=[];
  for(const p of [.3,.6,.9]){
    await page.evaluate(p=>{const el=document.querySelector('#home');window.scrollTo({top:el.offsetTop+(el.offsetHeight-innerHeight)*p,behavior:'instant'});},p);
    await expect.poll(()=>canvas.evaluate(el=>JSON.parse(el.dataset.camera).progress)).toBeGreaterThan(p-.025);
    angles.push(await canvas.evaluate(el=>JSON.parse(el.dataset.camera).angle));
  }
  expect(angles[2]-angles[0]).toBeGreaterThan(4);
  const quote=page.locator('.manifesto .spatial-quote');await quote.scrollIntoViewIfNeeded();
  await expect.poll(()=>quote.evaluate(el=>parseFloat(getComputedStyle(el).getPropertyValue('--quote-warmth')))).toBeGreaterThan(.1);
  await page.locator('.spatial-project').first().scrollIntoViewIfNeeded();
  await expect(canvas).toHaveAttribute('data-scene','tech');
  await expect(page.locator('[data-project-index="0"]')).toHaveAttribute('data-world-position',/-1.9/);
  await page.mouse.move(720,500);await page.mouse.click(720,500);
  await expect.poll(()=>canvas.evaluate(el=>JSON.parse(el.dataset.realmEffects).burstCount)).toBeGreaterThan(0);
  await expect.poll(()=>canvas.evaluate(el=>JSON.parse(el.dataset.realmEffects).repulsion)).toBeGreaterThan(.1);
  await page.screenshot({path:'/tmp/navya-spatial-tech.png'});
  await page.getByRole('tab',{name:/Creative, PR & Strategy/}).click();
  await page.locator('.spatial-project').first().scrollIntoViewIfNeeded();
  await expect.poll(()=>canvas.evaluate(el=>Number(el.dataset.realmBlend))).toBeGreaterThan(.9);
  await expect.poll(()=>canvas.evaluate(el=>Number(el.dataset.warmth))).toBeGreaterThan(.85);
  const before=await canvas.evaluate(el=>JSON.parse(el.dataset.realmEffects).burstCount);
  await page.mouse.click(720,500);await expect.poll(()=>canvas.evaluate(el=>JSON.parse(el.dataset.realmEffects).burstCount)).toBeGreaterThan(before);
  await page.screenshot({path:'/tmp/navya-spatial-creative.png'});
  expect(errors).toEqual([]);
});
