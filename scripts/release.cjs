/* Test the exact publishing output, with deployment headers and no live email. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { chromium } = require('playwright');
const { createStaticServer } = require('./server.cjs');
const policy = require('./site-policy.cjs');
const root = path.resolve(__dirname, '..');
function run(script, environment = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(__dirname, script)], { cwd: root, env: { ...process.env, ...environment }, stdio: 'inherit' });
    child.on('error', reject);
    child.on('exit', code => code === 0 ? resolve() : reject(new Error(`${script} exited ${code}`)));
  });
}
(async () => {
  await run('build.cjs');
  const dist = path.join(root, 'dist');
  const excluded = ['README.md', 'CONTACT_SETUP.md', 'case.html', 'brain-scene.js', 'assets/heart.svg', 'assets/anime-crystal-anatomy.png'];
  for (const file of excluded) assert.equal(fs.existsSync(path.join(dist, file)), false, `Excluded asset: ${file}`);
  const vercel = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
  for (const [key, value] of Object.entries(policy)) assert.equal(vercel.headers[0].headers.find(header => header.key === key).value, value);
  const server = createStaticServer(dist);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    const response = await fetch(base);
    for (const [key, value] of Object.entries(policy)) assert.equal(response.headers.get(key), value);
    const missing = await fetch(`${base}/a-page-that-does-not-exist`);
    assert.equal(missing.status, 404);
    assert.match(await missing.text(), /A SMALL DETOUR/);
    browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(base);
    assert.equal(await page.locator('.project').count(), 7, 'All work must be pre-rendered');
    await page.locator('.project summary').first().click();
    assert.equal(await page.locator('.project-content').first().isVisible(), true);
    assert.equal(await page.locator('[data-share]').first().isVisible(), false);
    assert.equal(await page.locator('.menu-toggle').isVisible(), false);
    assert.equal(await page.locator('.contact-options a').first().getAttribute('href').then(href => href.startsWith('mailto:')), true);
    await browser.close(); browser = null;
    await run('experience.cjs', { PORTFOLIO_TEST_URL: base });
    await run('smoke.cjs', { PORTFOLIO_TEST_URL: base });
    await run('contact.cjs', { PORTFOLIO_TEST_URL: base });
  } finally { if (browser) await browser.close(); await new Promise(resolve => server.close(resolve)); }
  // Exercise automatic canonical/social/sitemap generation without leaving a fake URL in dist.
  const deploymentVariables = ['SITE_URL', 'URL', 'VERCEL_PROJECT_PRODUCTION_URL', 'VERCEL_URL'];
  const emptyURLs = Object.fromEntries(deploymentVariables.map(name => [name, '']));
  try {
    await run('build.cjs', { ...emptyURLs, SITE_URL: 'https://portfolio.example' });
    const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
    assert.match(html, /rel="canonical" href="https:\/\/portfolio.example\/"/);
    assert.match(html, /content="https:\/\/portfolio.example\/assets\/social-preview.png"/);
    assert.match(fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8'), /https:\/\/portfolio.example\//);
  } finally { await run('build.cjs'); }
  console.log('PASS: publishing output, shared security policy, 404 response, no-JS project stories, metadata generation and full browser suites. No live emails sent.');
})().catch(error => { console.error(error); process.exitCode = 1; });
