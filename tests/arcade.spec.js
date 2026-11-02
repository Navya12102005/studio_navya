import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('navya-intro-seen', '1'));
});

async function atProgress(page, progress) {
  await page.evaluate(p => {
    const stage = document.querySelector('#arcade');
    window.scrollTo({ top: stage.offsetTop + (stage.offsetHeight - innerHeight) * p, behavior: 'instant' });
  }, progress);
}

test('reduced-motion arcade has keyboard controls, terminal commands, collectible badges and a real project/contact reward', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto('/');
  const stage = page.locator('#arcade'); await stage.scrollIntoViewIfNeeded();
  await stage.getByRole('button', { name: /02 Creative Studio/ }).click();
  await expect(page.locator('#arcade')).toHaveClass(/arcade-warm/);
  await expect(page.locator('canvas')).toHaveCount(0);
  for (const label of ['Curiosity', 'Systems thinker', 'Story builder', 'Connector']) await stage.getByRole('button', { name: `Collect ${label} badge`, exact: true }).click();
  await expect(stage.locator('#discovery-energy')).toHaveJSProperty('value', 4);
  await stage.getByRole('button', { name: 'Terminal', exact: true }).click();
  const input = page.getByLabel('navya@possibility:~$');
  await expect(input).toBeFocused(); await input.fill('help'); await page.getByRole('button', { name: 'Run terminal command' }).click();
  await expect(page.locator('.terminal-output')).toContainText('achievements');
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  await expect(stage.getByRole('status')).toContainText('Start with observation');
  for (const step of ['Observe', 'Connect', 'Create']) await page.getByRole('button', { name: step, exact: true }).click();
  await expect(page.getByRole('link', { name: 'Open contact portal' })).toHaveAttribute('href', '#contact');
  await input.fill('achievements'); await page.getByRole('button', { name: 'Run terminal command' }).click();
  await expect(page.locator('.terminal-output')).toContainText('Secret connector');
  await page.getByRole('button', { name: 'Close arcade terminal' }).click();
  await stage.getByRole('button', { name: /Launch Studio Navya/ }).click();
  await expect(page.getByRole('dialog')).toContainText('personal studio');
  await page.keyboard.press('Escape');
  await expect(page.locator('#arcade-project-terminal')).toBeFocused();
  await page.getByRole('link', { name: 'Open contact portal' }).click();
  await expect(page.getByLabel('Your name', { exact: true })).toBeVisible();
  await stage.getByRole('button', { name: 'Reset arcade discoveries' }).click();
  await expect(stage.locator('#discovery-energy')).toHaveJSProperty('value', 0);
  await expect(page.locator('.arcade-achievement')).toHaveCount(0);
});

test('mobile arcade and both realm layouts fit; reduced motion suppresses bursts', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto('/');
  await page.locator('#arcade').scrollIntoViewIfNeeded();
  await expect(page.locator('.arcade-static-art')).toBeVisible();
  await page.getByRole('button', { name: /02 Creative Studio/ }).click();
  for (const width of [360, 390, 600, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow at ${width}`).toBe(true);
  }
  await expect(page.locator('.pixel-burst-layer i')).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: '/tmp/navya-arcade-mobile.png' });
});
