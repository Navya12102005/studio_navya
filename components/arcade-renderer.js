import { AVATAR, PALETTE, POWERUPS, WORLD_WIDTH, VIEW_WIDTH, VIEW_HEIGHT as H, FLOOR_Y, gameState } from '../lib/arcade';

// Original deterministic low-resolution sprites and tile art. No sprite service,
// video, image downloads, physics dependency or separate WebGL context.
export function drawArcade(ctx, progress, collected, time = 0, viewWidth = VIEW_WIDTH) {
  const W = viewWidth, state = gameState(progress, W), cam = state.camera, warm = state.level === 'studio';
  const ink = warm ? '#f0a089' : '#77cce8', dim = warm ? '#513047' : '#1c4255';
  ctx.imageSmoothingEnabled = false; ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#080c18'; ctx.fillRect(0, 0, W, H);
  // Slow parallax architecture, pixel windows and a deliberately quiet star grid.
  for (let i = 0; i < 42; i++) {
    const x = (i * 97 - cam * .15 + W * 2) % (W + 70);
    ctx.fillStyle = i % 3 ? '#33425d' : '#897099'; ctx.fillRect(Math.round(x), 20 + i * 43 % 160, 2, 2);
  }
  ctx.fillStyle = warm ? '#1f1129' : '#101e30';
  for (let i = 0; i < 12; i++) {
    const x = Math.round(i * 134 - cam * .3);
    ctx.fillRect(x, 116 + i % 3 * 19, 83, 140);
    ctx.fillStyle = dim; ctx.fillRect(x + 10, 133 + i % 3 * 19, 15, 3); ctx.fillStyle = warm ? '#1f1129' : '#101e30';
  }
  function rect(x, y, width, height, color) { ctx.fillStyle = color; ctx.fillRect(Math.round(x - cam), y, width, height); }
  function text(value, x, y, color = ink, size = 8) { ctx.fillStyle = color; ctx.font = `${size}px monospace`; ctx.fillText(value, Math.round(x - cam), y); }
  // The transport rail ties both levels together instead of separating the site.
  rect(0, FLOOR_Y, WORLD_WIDTH, 5, '#45617a'); rect(0, FLOOR_Y + 5, WORLD_WIDTH, H - FLOOR_Y, '#0b1120');
  for (let x = 0; x < WORLD_WIDTH; x += 24) { rect(x, FLOOR_Y + 13, 18, 4, x < 1024 ? '#1c3d4c' : '#422536'); rect(x + 7, FLOOR_Y + 30, 9, 2, '#1a2238'); }
  for (const x of [285, 670, 1240, 1660]) { rect(x, FLOOR_Y - 28, 90, 6, x < 1024 ? '#63b6ce' : '#c989a5'); rect(x + 4, FLOOR_Y - 22, 82, 7, '#1c2d42'); }
  // Level 1: cyan server racks, workstation and a double-helix light sculpture.
  for (const x of [130, 190, 500]) {
    rect(x, 184, 38, 107, '#18283c'); rect(x + 2, 186, 34, 3, '#5d9db8');
    for (let y = 198; y < 280; y += 18) { rect(x + 5, y, 28, 12, '#0b1526'); rect(x + 9, y + 4, 3, 3, '#71daec'); rect(x + 17, y + 4, 11, 2, '#31576b'); }
  }
  for (let y = 124; y < 260; y += 6) {
    const a = (y - 124) / 17 + time * .35;
    const x1 = 405 + Math.sin(a) * 17, x2 = 405 - Math.sin(a) * 17;
    rect(Math.min(x1, x2), y + 1, Math.max(2, Math.abs(x2 - x1)), 1, '#263e5c');
    rect(x1, y, 3, 3, '#8ad9e8'); rect(x2, y, 3, 3, '#b29cdd');
  }
  rect(805, 209, 105, 9, '#385373'); rect(818, 218, 6, 74, '#23354f'); rect(889, 218, 6, 74, '#23354f');
  rect(827, 166, 62, 40, '#37516c'); rect(831, 170, 54, 30, '#091c2c');
  text(progress > .32 ? '> BUILD READY_' : '> COMPILE_', 835, 183, '#8acfe2', 6);
  rect(846, 187, Math.round(33 * Math.min(1, progress / .34)), 3, '#79dce4');
  text('01 / BIO-TECH LAB', 98, 102, '#80cee5', 12); text('RESEARCH  /  SYSTEMS  /  COMPUTATION', 98, 120, '#5d7691', 6);
  // Level 2: an easel, drafting surface, brand board and editorial neon signs.
  rect(1040, 106, 4, 186, '#5b3659'); rect(1044, 106, 4, 186, '#231d36');
  text('02 / CREATIVE STUDIO', 1100, 102, '#e0a1b3', 12); text('PEOPLE  /  VOICE  /  POSSIBILITY', 1100, 120, '#9c7287', 6);
  rect(1140, 177, 65, 75, '#654159'); rect(1145, 182, 55, 64, '#c6a5ac'); rect(1151, 188, 43, 22, '#2e2846');
  text('STUDIO', 1157, 203, '#e1b7d0', 7); text('NAVYA', 1157, 221, '#574161', 8);
  rect(1145, 252, 5, 40, '#80576b'); rect(1195, 252, 5, 40, '#80576b');
  rect(1390, 224, 118, 9, '#b28191'); rect(1398, 233, 5, 59, '#654454'); rect(1495, 233, 5, 59, '#654454');
  rect(1407, 216, 54, 7, '#d0bbc2'); rect(1430, 213, 23, 3, '#a892c5');
  rect(1540, 150, 81, 84, '#533149'); rect(1544, 154, 73, 76, '#171323');
  text('THE BRAND', 1552, 173, '#e5abc1', 8); text('01 LISTEN', 1552, 190, '#956f89', 6);
  if (progress > .65) text('02 CONNECT', 1552, 203, '#c89eb0', 6);
  if (progress > .8) text('03 CREATE', 1552, 216, '#f0bc96', 6);
  rect(1830, 193, 65, 39, '#654558'); rect(1834, 197, 57, 31, '#1b1425'); text('> LAUNCH_', 1839, 212, '#f3b39c', 7); rect(1830, 236, 84, 8, '#754e65'); rect(1837, 244, 5, 48, '#53334f'); rect(1903, 244, 5, 48, '#53334f');
  // Collected badges remain in the HUD; uncollected items glow above platforms.
  for (const item of POWERUPS) if (!collected.includes(item.id)) {
    const y = 218 + Math.round(Math.sin(time * 2 + item.x) * 3), color = item.level === 'lab' ? '#a3f0e6' : '#ffd29a';
    rect(item.x, y - 5, 4, 14, color); rect(item.x - 5, y, 14, 4, color); rect(item.x - 2, y - 2, 8, 8, '#f4ecdc');
  }
  // Pixel engineer: reversible walk cycle and a raised foot during a jump.
  AVATAR.forEach((row, y) => [...row].forEach((pixel, x) => {
    if (!PALETTE[pixel]) return;
    const shift = y >= 13 ? (x < 7 ? state.frame : -state.frame) * 2 : 0;
    rect(state.x + x * 3 + shift, Math.round(state.y) + y * 3, 3, 3, pixel === 'w' && warm ? '#ee9ea8' : PALETTE[pixel]);
  }));
  // Pixel scan overlays and story-state signal, drawn at a fixed bounded cost.
  ctx.fillStyle = '#03030520'; for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);
  text(state.level === 'lab' ? 'YOU ARE HERE: THE ANALYTICAL MIND' : 'YOU ARE HERE: THE CREATIVE INSTINCT', cam + 20, 337, '#78849a', 6);
  return state;
}
