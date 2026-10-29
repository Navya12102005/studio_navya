// All delivery requests are intercepted. This suite never sends an email.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
let browser;
(async () => {
  browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  await page.goto(process.env.PORTFOLIO_TEST_URL || 'http://127.0.0.1:8000');
  await page.evaluate(() => { window.SITE.web3formsKey = 'test-public-access-key'; });
  await page.locator('#enquiryName').fill('Test Visitor');
  await page.locator('#enquiryEmail').fill('visitor@example.com');
  await page.locator('#enquiryMessage').fill('A test enquiry that must never be delivered to a real inbox.');
  let requests = 0, payload, release;
  await page.route('https://api.web3forms.com/submit', async route => {
    requests++; payload = route.request().postDataJSON();
    await new Promise(resolve => { release = resolve; });
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
  });
  await page.locator('.prepare-enquiry').click();
  await page.waitForFunction(() => document.querySelector('#enquiryForm').getAttribute('aria-busy') === 'true');
  assert.equal(await page.locator('.prepare-enquiry').isDisabled(), true);
  await page.locator('#enquiryForm').dispatchEvent('submit');
  assert.equal(requests, 1, 'Duplicate submits must not send a second request');
  assert.equal(payload.email, 'visitor@example.com');
  assert.equal(payload.replyto, 'visitor@example.com');
  assert.equal(payload.access_key, 'test-public-access-key');
  release();
  await page.waitForFunction(() => document.querySelector('#deliveryStatus').dataset.state === 'success');
  assert.equal(await page.locator('#enquiryMessage').inputValue(), '');
  assert.equal(await page.locator('#emailDraft').isVisible(), false);
  assert.equal(await page.locator('.prepare-enquiry').isEnabled(), true);
  await page.unroute('https://api.web3forms.com/submit');

  for (const failure of ['rejected', 'server', 'malformed', 'network']) {
    await page.locator('#enquiryName').fill('Test Visitor');
    await page.locator('#enquiryEmail').fill('visitor@example.com');
    await page.locator('#enquiryMessage').fill(`Keep this message after ${failure}.`);
    await page.route('https://api.web3forms.com/submit', route => {
      if (failure === 'network') return route.abort('failed');
      return route.fulfill({ status: failure === 'server' ? 500 : 200, contentType: 'application/json', body: failure === 'malformed' ? 'not json' : JSON.stringify({ success: false }) });
    });
    await page.locator('.prepare-enquiry').click();
    await page.waitForFunction(() => document.querySelector('#deliveryStatus').dataset.state === 'error');
    assert.equal(await page.locator('#enquiryMessage').inputValue(), `Keep this message after ${failure}.`);
    assert.equal(await page.locator('#emailDraft').isVisible(), true);
    assert.match(await page.locator('#openEmailDraft').getAttribute('href'), /visitor%40example.com/);
    assert.equal(await page.locator('.prepare-enquiry').isEnabled(), true);
    await page.unroute('https://api.web3forms.com/submit');
  }
  let honeypotRequests = 0;
  await page.route('https://api.web3forms.com/submit', route => { honeypotRequests++; return route.abort(); });
  await page.evaluate(() => document.querySelector('[name=botcheck]').checked = true);
  await page.locator('.prepare-enquiry').click();
  assert.equal(honeypotRequests, 0);
  await browser.close(); browser = null;
  console.log('PASS: mocked direct delivery, payload/reply address, duplicate protection, success reset, rejection/server/malformed/network failures, retained message, email fallback, honeypot. No live emails sent.');
})().catch(async error => { console.error(error); if (browser) await browser.close(); process.exitCode = 1; });
