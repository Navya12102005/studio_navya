import { test, expect, chromium } from '@playwright/test';

test('WebGL shaders render; anatomical navigation descends and reverses the camera', async ({ page }) => {
  const errors = [], shaderErrors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (/VALIDATE_STATUS|Shader Error|shader.*failed/i.test(message.text())) shaderErrors.push(message.text()); });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'full');
  await expect(page.locator('.canvas-ready .anatomy-canvas canvas')).toHaveCount(1);
  await expect(page.locator('canvas')).toHaveCount(2);
  await expect(page.locator('html')).toHaveClass(/lenis/);
  await expect(page.getByRole('region', { name: 'Cosmic introduction' })).toHaveCount(0);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: '/tmp/navya-next-hero.png' });
  for (const [node, phrase] of [['brain', 'Think in systems.'], ['spine', 'Connect the unexpected.'], ['heart', 'Create with intent.']]) {
    await page.getByRole('button', { name: `Explore ${node}`, exact: true }).click();
    await expect.poll(() => page.locator(`[data-chapter="${node}"]`).evaluate(el => Number(getComputedStyle(el).opacity))).toBeGreaterThan(.95);
    await expect(page.getByRole('heading', { name: phrase })).toBeVisible();
    await page.screenshot({ path: `/tmp/navya-next-${node}.png` });
  }
  await page.getByRole('button', { name: 'Explore brain', exact: true }).click();
  await expect.poll(() => page.locator('[data-chapter="brain"]').evaluate(el => Number(getComputedStyle(el).opacity))).toBeGreaterThan(.95);
  expect(shaderErrors).toEqual([]); expect(errors).toEqual([]);
});

test('domain transition, actual React Bits spotlight, tilt, cursor and project dialog', async ({ page }) => {
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  const skip = page.getByRole('button', { name: 'Skip intro' });
  if (await skip.isVisible()) await skip.click();
  await page.locator('#work').scrollIntoViewIfNeeded();
  await expect(page.locator('.spotlight-card')).toHaveCount(4);
  const card = page.locator('.project-shell').first();
  const box = await card.boundingBox();
  await page.mouse.move(box.x + box.width * .7, box.y + 45);
  await expect.poll(() => card.evaluate(el => getComputedStyle(el).transform)).not.toBe('none');
  await expect(page.locator('.custom-cursor')).toHaveCSS('opacity', '1');
  await page.getByRole('button', { name: 'Explore Oculomics · Research' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog')).toContainText('not a clinically validated');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Explore Oculomics · Research' })).toBeFocused();
  const creative = page.getByRole('tab', { name: /Creative, PR & Strategy/ });
  await creative.click();
  await expect(creative).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('.editorial-grid .project-shell')).toHaveCount(6);
  await expect(page.locator('.projects-grid')).toContainText('Startup Club · President');
  await expect(page.locator('.projects-grid')).toContainText('AWS Student Builder · Operational lead');
  await page.getByRole('button', { name: 'Explore Studio Navya · Design & strategy' }).click();
  await expect(page.getByRole('dialog')).toContainText('personal studio');
  await page.getByRole('button', { name: 'Close project' }).click();
  await creative.focus(); await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('tab', { name: /Tech & Bioengineering/ })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('.projects-grid')).toContainText('Molecular docking');
  expect(errors).toEqual([]);
});

test('pause/resume and changed system reduced-motion preference remove heavy tracking', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('canvas')).toHaveCount(2);
  await page.getByRole('button', { name: 'Pause visual effects' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'paused');
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.locator('.journey-static .static-chapters')).toBeVisible();
  await expect(page.locator('html')).not.toHaveClass(/lenis/);
  await page.getByRole('button', { name: 'Resume visual effects' }).click();
  await expect(page.locator('canvas')).toHaveCount(2);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'System reduced motion enabled' })).toBeDisabled();
  await page.locator('#work').scrollIntoViewIfNeeded();
  await page.getByRole('tab', { name: /Creative, PR & Strategy/ }).click();
  await expect(page.locator('.projects-grid')).toContainText('Studio Navya');
});

test('reduced-motion, touch and seven viewport widths retain readable content and usable controls', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce', isMobile: true, hasTouch: true, viewport: { width: 390, height: 844 } });
  const page = await context.newPage(); await page.goto('http://127.0.0.1:3100');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
  await expect(page.locator('canvas')).toHaveCount(0);
  for (const width of [360, 390, 600, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow at ${width}px`).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: '/tmp/navya-next-reduced-mobile.png' });
  await page.locator('#work').scrollIntoViewIfNeeded();
  await page.getByRole('tab', { name: /Creative, PR & Strategy/ }).click();
  await expect(page.locator('.projects-grid')).toContainText('Startup Club');
  await context.close();
  const touch = await browser.newContext({ isMobile: true, hasTouch: true, viewport: { width: 390, height: 844 } });
  const mobile = await touch.newPage(); await mobile.goto('http://127.0.0.1:3100');
  await expect(mobile.locator('html')).toHaveAttribute('data-motion', 'full');
  await expect(mobile.locator('html')).not.toHaveClass(/lenis/);
  await expect(mobile.locator('.canvas-ready')).toHaveCount(1);
  await mobile.screenshot({ path: '/tmp/navya-next-mobile.png' });
  await touch.close();
});

test('contact prepares a reviewed draft and clipboard rejection keeps a manual fallback', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByLabel('Your name', { exact: true }).fill('Test Visitor');
  await page.getByLabel('Your email', { exact: true }).fill('visitor@example.com');
  await page.getByLabel('A little context', { exact: true }).fill('An exploratory collaboration with a clear brief and a thoughtful direction.');
  await page.getByRole('button', { name: 'Prepare an email' }).click();
  await expect(page.locator('.email-preview')).toContainText('NOT SENT');
  await expect(page.locator('.email-preview')).toContainText('Test Visitor');
  const href = await page.getByRole('link', { name: 'Open email app' }).getAttribute('href');
  expect(href).toMatch(/^mailto:hello@studionavya.com\?subject=/);
  expect(decodeURIComponent(href)).toContain('visitor@example.com');
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new Error('Unavailable')) } }));
  await page.getByRole('button', { name: 'Copy message' }).click();
  await expect(page.locator('.email-preview').getByRole('status')).toContainText('Select the message');
});

test('WebGL failure preserves portfolio without a flat anatomy fallback; server content works without JavaScript', async ({ browser }) => {
  const fallback = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-webgl'] });
  try {
    const page = await fallback.newPage(); await page.goto('http://127.0.0.1:3100');
    await expect(page.locator('.anatomy-unavailable')).toHaveCount(1);
    await expect(page.locator('.anatomy-fullscreen img, .anatomy-fullscreen svg')).toHaveCount(0);
    await page.locator('#work').scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Explore Oculomics · Research' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
  } finally { await fallback.close(); }
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage(); const response = await page.goto('http://127.0.0.1:3100');
  expect(response.status()).toBe(200);
  expect(response.headers()['x-content-type-options']).toBe('nosniff');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('.project-inner')).toHaveCount(4);
  await expect(page.getByRole('link', { name: 'hello@studionavya.com' })).toBeVisible();
  const missing = await page.goto('http://127.0.0.1:3100/not-a-real-page'); expect(missing.status()).toBe(404);
  await context.close();
});

test('anatomical tagging provides raycast and keyboard readouts with domain handoff', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.canvas-ready')).toHaveCount(1);
  await expect(page.getByRole('region', { name: 'Cosmic introduction' })).toHaveCount(0);
  await page.waitForTimeout(200);
  const brainPoint = await page.locator('.anatomy-canvas canvas').evaluate(el => JSON.parse(el.dataset.parts).brain);
  await page.mouse.move(brainPoint.x, brainPoint.y);
  await expect(page.locator('#anatomy-readout')).toContainText('Paired cerebral hemispheres');
  await page.getByRole('button', { name: 'Explore heart', exact: true }).focus();
  await expect(page.locator('#anatomy-readout')).toContainText('7 TRUE · 3 FALSE · 2 FLOATING');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Explore Creative, PR & Strategy', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('tab', { name: /Creative, PR & Strategy/ })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('.projects-grid')).toContainText('Startup Club');
});

test('cosmic opening converges on input, sound is opt-in, and reduced motion bypasses it', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage(); await page.goto('http://127.0.0.1:3100');
  await expect(page.getByRole('region', { name: 'Cosmic introduction' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Enable ambient sound' })).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: 'Enable ambient sound' }).click();
  await expect(page.getByRole('button', { name: 'Sound on', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.mouse.wheel(0, 150);
  await expect(page.getByRole('region', { name: 'Cosmic introduction' })).toHaveCount(0);
  await expect(page.locator('html')).not.toHaveClass(/cinematic-open/);
  await page.reload();
  await expect(page.locator('.canvas-ready')).toHaveCount(1);
  await expect(page.getByRole('region', { name: 'Cosmic introduction' })).toHaveCount(0);
  await context.close();
  const reduced = await browser.newContext({ reducedMotion: 'reduce' });
  const simple = await reduced.newPage(); await simple.goto('http://127.0.0.1:3100');
  await expect(simple.locator('html')).toHaveAttribute('data-motion', 'reduced');
  await expect(simple.getByRole('region', { name: 'Cosmic introduction' })).toHaveCount(0);
  await expect(simple.locator('canvas')).toHaveCount(0);
  await reduced.close();
});

test('diagnostic HUD tracks scroll rather than fabricated results; batched renderer stays within its geometry budget', async ({ page }) => {
  await page.addInitScript(() => {
    window.renderProfiles = [];
    addEventListener('anatomy:performance', event => window.renderProfiles.push(event.detail));
  });
  await page.goto('/?profile=1');
  await expect(page.locator('.canvas-ready')).toHaveCount(1);
  await page.waitForFunction(() => window.renderProfiles.some(sample => sample.fps > 0));
  const samples = await page.evaluate(() => window.renderProfiles.filter(sample => sample.fps > 0));
  expect(samples[0].drawCalls).toBeLessThan(100);
  expect(samples[0].geometries).toBeLessThan(60);
  // Transmission renders an additional physical pass; budget total submitted
  // triangles rather than reusing the former line-only scene's budget.
  expect(samples[0].triangles).toBeLessThan(80000);
  expect(samples[0].lines).toBe(0);
  expect(samples[0].physicalMeshes).toBe(true);
  console.log('Renderer sample (software Chromium; not a physical-device guarantee):', samples[0]);
  await page.getByRole('button', { name: 'Explore heart', exact: true }).click();
  await expect.poll(() => page.locator('[data-scan-progress]').textContent().then(value => parseInt(value, 10))).toBeGreaterThanOrEqual(97);
  await expect(page.locator('.diagnostic-hud')).toHaveAttribute('data-region', 'thoracic');
  await page.locator('#work').scrollIntoViewIfNeeded();
  const card = page.locator('.project-inner').first(); const bounds = await card.boundingBox();
  await page.mouse.move(bounds.x + bounds.width * .7, bounds.y + 40);
  await expect.poll(() => card.locator('[data-card-progress]').textContent()).not.toBe('00');
  await expect(card.locator('.card-telemetry')).toContainText('SCAN');
});

test('molecular project nodes and vascular operations map to scoped portfolio highlights', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto('/');
  await page.getByRole('button', { name: 'Open cell project highlight' }).click();
  await expect(page.getByRole('dialog')).toContainText('molecular docking');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open cell project highlight' })).toBeFocused();
  await page.getByRole('button', { name: 'Explore vascular', exact: true }).focus();
  await page.getByRole('button', { name: 'View operational leadership', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('AWS Student Builder operational lead');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Explore vascular', exact: true })).toBeFocused();
  await page.locator('#work').scrollIntoViewIfNeeded();
  await expect(page.locator('.projects-grid')).toContainText('Sound Check');
  await expect(page.locator('.projects-grid')).toContainText('Campus summits');
  await page.getByRole('tab', { name: /Tech & Bioengineering/ }).click();
  await page.getByRole('button', { name: 'Explore Python data analysis · Systems' }).click();
  const source = page.getByRole('link', { name: 'Download the working Python study' });
  await expect(source).toHaveAttribute('href', '/studies/analysis_pipeline.py');
  const response = await page.request.get('/studies/analysis_pipeline.py');
  expect(response.status()).toBe(200); expect(await response.text()).toContain('SYNTHETIC DEMONSTRATION');
});
