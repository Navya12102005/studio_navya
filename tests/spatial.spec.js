import { test, expect } from '@playwright/test';
import { sampleHelix } from '../lib/spatial';

test.beforeEach(async ({page})=>{await page.addInitScript(()=>sessionStorage.setItem('navya-intro-seen','1'));});

test('requested fonts are local and content stays box-free on desktop and mobile',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/?reading=1');
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
