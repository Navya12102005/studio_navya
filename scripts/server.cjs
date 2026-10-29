/* Serve the publishing output locally with the same policy headers. */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const policy = require('./site-policy.cjs');
function createStaticServer(directory) {
  const root = fs.realpathSync(directory);
  const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml' };
  return http.createServer((request, response) => {
    Object.entries(policy).forEach(([key, value]) => response.setHeader(key, value));
    response.setHeader('Cache-Control', 'no-store');
    if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405); response.end(); return; }
    let relative;
    try { relative = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
    catch { response.writeHead(400); response.end(); return; }
    let file = path.resolve(root, `.${relative.endsWith('/') ? `${relative}index.html` : relative}`);
    let exists = file.startsWith(`${root}${path.sep}`) && !relative.split('/').some(part => part.startsWith('.'));
    if (exists) {
      try { exists = fs.statSync(file).isFile() && fs.realpathSync(file).startsWith(`${root}${path.sep}`); }
      catch { exists = false; }
    }
    if (!exists) { response.statusCode = 404; file = path.join(root, '404.html'); }
    response.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    if (request.method === 'HEAD') { response.end(); return; }
    fs.createReadStream(file).on('error', () => response.destroy()).pipe(response);
  });
}
module.exports = { createStaticServer };
if (require.main === module) {
  const root = path.join(__dirname, '../dist');
  if (!fs.existsSync(root)) throw new Error('Build first: node scripts/build.cjs');
  const server = createStaticServer(root);
  const port = Number(process.env.PORT || 8000);
  server.listen(port, '0.0.0.0', () => console.log(`Serving publishing output on port ${port}`));
}
