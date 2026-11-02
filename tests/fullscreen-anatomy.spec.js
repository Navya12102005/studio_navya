import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('navya-intro-seen', '1'));
});

test('physical mesh is centred in a fixed body-level viewport canvas on desktop and mobile', async ({ page }) => {
  test.setTimeout(90000);
  const shaderErrors = [];
  page.on('console', message => { if (/Shader Error|VALIDATE_STATUS|shader.*failed/i.test(message.text())) shaderErrors.push(message.text()); });
  await page.goto('/?profile=1');
  const canvas = page.locator('.anatomy-canvas canvas');
  await expect(canvas).toHaveAttribute('data-renderer', 'physical-mesh');
  await expect(canvas).toHaveAttribute('data-engine', 'react-three-fiber');
  await expect(canvas).toHaveAttribute('data-wireframe-meshes', '0');
  await expect(page.locator('.anatomy-fullscreen img, .anatomy-fullscreen svg')).toHaveCount(0);
  const materials=await canvas.evaluate(el=>JSON.parse(el.dataset.physicalMaterials));
  for(const name of ['frosted-glass-shell','frosted-glass-skeleton']){
    const material=materials.find(m=>m.name===name);
    expect(material.roughness).toBe(.1);expect(material.clearcoat).toBe(1);expect(material.transmission).toBeGreaterThan(0);
  }
  await page.waitForFunction(() => document.querySelector('.anatomy-canvas canvas').dataset.parts);
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 950 });
    await expect.poll(() => page.locator('.anatomy-art').evaluate(el => {
      const r = el.getBoundingClientRect(), style = getComputedStyle(el);
      return { parent: el.parentElement.tagName, fixed: style.position, events: style.pointerEvents, x: r.x, y: r.y, width: Math.round(r.width), height: Math.round(r.height) };
    })).toEqual({ parent: 'BODY', fixed: 'fixed', events: 'none', x: 0, y: 0, width, height: 950 });
    await expect(page.locator('.anatomy-canvas')).toHaveCSS('transform', 'none');
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  const camera = await canvas.evaluate(el => JSON.parse(el.dataset.camera));
  expect(Math.abs(camera.target[0])).toBeLessThan(.08);
  expect(Math.abs(camera.position[0])).toBeLessThan(.6);
  await page.screenshot({ path: '/tmp/navya-fullscreen-physical-hero.png' });
  await expect(page.locator('main')).toHaveCSS('z-index','10');
  await expect(page.locator('.hero-editorial')).toHaveCSS('z-index','20');
  expect(shaderErrors).toEqual([]);
});

test('camera enters the thoracic volume and retreats into fully interactive project cards', async ({ page }) => {
  test.setTimeout(120000);
  await page.goto('/?profile=1');
  const canvas = page.locator('.anatomy-canvas canvas');
  await page.waitForFunction(() => document.querySelector('.anatomy-canvas canvas')?.dataset.camera);
  await page.getByRole('button', { name: 'Explore heart', exact: true }).click();
  await expect.poll(() => canvas.evaluate(el => JSON.parse(el.dataset.camera).progress), { timeout: 40000 }).toBeGreaterThan(.97);
  const core = await canvas.evaluate(el => JSON.parse(el.dataset.camera));
  expect(Math.hypot(...core.position.map((x, i) => x - core.target[i]))).toBeLessThan(.5);
  await page.screenshot({ path: '/tmp/navya-fullscreen-heart-interior.png' });
  await page.evaluate(() => window.scrollTo({ top: document.querySelector('#work').offsetTop + innerHeight * .2, behavior: 'instant' }));
  await expect.poll(() => canvas.evaluate(el => Number(el.dataset.cardsProgress))).toBeGreaterThan(.4);
  const exit = await canvas.evaluate(el => JSON.parse(el.dataset.camera));
  expect(exit.position[2]).toBeGreaterThan(core.position[2] + 2);
  await page.evaluate(() => window.scrollTo({ top: document.querySelector('#work').offsetTop + innerHeight * .7, behavior: 'instant' }));
  await expect(page.locator('.anatomy-art')).toHaveCSS('opacity', '0');
  await page.getByRole('button', { name: 'Explore Oculomics · Research' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Explore Oculomics · Research' })).toBeFocused();
});
