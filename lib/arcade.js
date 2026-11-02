export const WORLD_WIDTH = 2048;
export const VIEW_WIDTH = 960;
export const VIEW_HEIGHT = 360;
export const FLOOR_Y = 292;
export const POWERUPS = [
  { id: 'curiosity', label: 'Curiosity', x: 310, level: 'lab', at: .14 },
  { id: 'systems', label: 'Systems thinker', x: 710, level: 'lab', at: .34 },
  { id: 'story', label: 'Story builder', x: 1270, level: 'studio', at: .64 },
  { id: 'connection', label: 'Connector', x: 1740, level: 'studio', at: .89 }
];
export const AVATAR = [
  '....hhhhhh....', '...hhhhhhhh...', '...hhsssshh...', '...hssssssh...',
  '...sssesse....', '....ssssss....', '.....ssss.....', '...cccccccc...',
  '..ccwccccwcc..', '..scwccccwcs..', '..sswccccwss..', '....wwwwww....',
  '....pppppp....', '....pp..pp....', '....pp..pp....', '...bbb..bbb...'
];
export const PALETTE = { h: '#252439', s: '#efbfa5', e: '#313149', c: '#d6e8eb', w: '#72d1e9', p: '#43506f', b: '#a5b7d4' };
export function gameState(progress, viewWidth = VIEW_WIDTH) {
  const p = Math.max(0, Math.min(1, progress));
  const x = 85 + p * (WORLD_WIDTH - 190);
  // Traverse three raised platforms. Arc height is tied to scroll position,
  // so reverse scrolling reverses the same jump rather than starting a timer.
  let jump = 0;
  for (const [start, end, height] of [[245, 430, 54], [640, 820, 64], [1200, 1385, 56], [1610, 1820, 66]]) {
    if (x >= start && x <= end) jump = Math.sin((x - start) / (end - start) * Math.PI) * height;
  }
  return { progress: p, x, y: FLOOR_Y - 48 - jump, camera: Math.max(0, Math.min(WORLD_WIDTH - viewWidth, x - viewWidth * .38)), level: x < 1024 ? 'lab' : 'studio', frame: Math.floor(x / 12) % 2, jump };
}
