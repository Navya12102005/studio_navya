/* Regenerate the checked-in social image after visual identity changes. */
const { chromium } = require('playwright');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
(async () => {
  const resources = {
    '/scripts/social-preview.html': ['social-preview.html', 'text/html'],
    '/assets/upper-body.webp': ['../assets/upper-body.webp', 'image/webp']
  };
  const server = http.createServer((request, response) => {
    const entry = resources[request.url];
    if (!entry) { response.writeHead(404); response.end(); return; }
    response.setHeader('Content-Type', entry[1]);
    response.end(fs.readFileSync(path.join(__dirname, entry[0])));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    await page.goto(`http://127.0.0.1:${server.address().port}/scripts/social-preview.html`);
    await page.locator('img').evaluate(el => el.decode());
    await page.screenshot({ path: path.join(__dirname, '../assets/social-preview.png') });
    console.log('Generated assets/social-preview.png (1200 × 630).');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
