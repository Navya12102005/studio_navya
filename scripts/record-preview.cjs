/* Actual Chromium walkthrough, encoded by the system ffmpeg; no publishing. */
const path = require('node:path');
const { spawn } = require('node:child_process');
const { chromium } = require('playwright');
const { createStaticServer } = require('./server.cjs');
(async () => {
  const server = createStaticServer(path.join(__dirname, '../dist'));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser, timer, encoder;
  try {
    browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    await page.locator('#crystalAnatomy').evaluate(image => image.decode());
    const session = await page.context().newCDPSession(page);
    let latest;
    session.on('Page.screencastFrame', event => {
      latest = Buffer.from(event.data, 'base64');
      session.send('Page.screencastFrameAck', { sessionId: event.sessionId }).catch(() => {});
    });
    encoder = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', '20', '-vcodec', 'mjpeg', '-i', 'pipe:0', '-an', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '22', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '/tmp/navya-visual-journey.mp4'], { stdio: ['pipe', 'inherit', 'inherit'] });
    const encoded = new Promise((resolve, reject) => {
      encoder.on('error', reject);
      encoder.on('exit', code => code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`)));
    });
    await session.send('Page.startScreencast', { format: 'jpeg', quality: 85, maxWidth: 1280, maxHeight: 800, everyNthFrame: 1 });
    timer = setInterval(() => { if (latest && !encoder.stdin.destroyed) encoder.stdin.write(latest); }, 50);
    await page.waitForTimeout(2500);
    for (const [id, scene, hold] of [['mind', 'brain', 2000], ['spark', 'neuron', 5500], ['intent', 'heart', 4500]]) {
      await page.evaluate(id => document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' }), id);
      await page.waitForFunction(scene => document.querySelector('#anatomyStage').dataset.scene === scene, scene);
      await page.waitForTimeout(hold);
    }
    clearInterval(timer); timer = null;
    await session.send('Page.stopScreencast');
    encoder.stdin.end();
    await encoded;
    console.log('Saved /tmp/navya-visual-journey.mp4');
  } finally {
    if (timer) clearInterval(timer);
    if (encoder && !encoder.stdin.destroyed) encoder.stdin.end();
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
