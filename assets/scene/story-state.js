// Pure, reversible choreography: the same scroll position always gives the same pose.
export const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, Number.isFinite(n) ? n : 0));
export const mix = (a, b, t) => a + (b - a) * t;
export const smooth = (a, b, n) => { const t = clamp((n - a) / (b - a)); return t * t * (3 - 2 * t); };
export const wrapAngle = n => ((n + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;

export function eveningState(progress, { reduced = false, night = false, breeze = false, greeting = 0 } = {}) {
  const raw = clamp(progress);
  const p = reduced ? Math.min(3, Math.floor(raw * 3 + .25)) / 3 : raw;
  const dusk = night ? 1 : smooth(.12, .94, p);
  const waking = Math.max(smooth(.21, .40, p), greeting);
  const standing = Math.max(smooth(.34, .52, p), greeting * .7);
  const walk = smooth(.53, .92, p);
  const path = [mix(2.02, -.7, walk), mix(.52, -.45, walk) + Math.sin(walk * Math.PI) * .42];
  return {
    progress: p, dusk, sunHeight: mix(2.4, -.7, dusk),
    lamp: smooth(.31, .63, dusk), fairy: smooth(.18, .51, dusk),
    breeze: breeze ? 1 : smooth(.08, .38, p) * (1 - smooth(.78, 1, p)) * .8,
    chair: smooth(.08, .35, p), waking, standing, walk,
    dogX: path[0], dogZ: path[1], gait: walk * Math.PI * 11,
    dogTurn: mix(-.2, -1.9, smooth(0, .14, walk)),
    notebook: smooth(.22, .44, p),
    // No automatic camera turns. Visitors own their view throughout the story.
    cameraZ: reduced ? 2.7 : 2.7 - Math.sin(p * Math.PI) * .15
  };
}
