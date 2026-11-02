// Shared, transient visual state. Content and navigation never depend on WebGL.
export const spatialState = { realm: 'tech', work: 0, workVisible: false, pointer: { x: 0, y: 0 }, clicks: [], project: 0 };
export const clamp01 = value => Math.max(0, Math.min(1, value));
const smooth = value => { const p = clamp01(value); return p * p * (3 - 2 * p); };
const lerp = (a, b, t) => a + (b - a) * t;

// Exactly one turn about the spine; the final radius enters the cardiac cavity.
// The opening establishes the full figure before moving into the cranial axis.
export function sampleHelix(progress, { mobile = false, heart = [0, .02, .48], pointer = [0, 0] } = {}) {
  const p = clamp01(progress), orbit = smooth((p - .12) / .88), angle = orbit * Math.PI * 2;
  const descent = smooth((p - .25) / .75), establish = smooth(p / .25), dive = smooth((p - .82) / .18);
  const elevation = lerp(lerp(.9, 2.84, establish), .02, descent);
  const radius = p < .25 ? lerp(mobile ? 10.8 : 8.6, mobile ? 4.8 : 3.9, establish)
    : lerp(mobile ? 4.8 : 3.9, mobile ? .2 : .14, smooth((p - .25) / .75));
  const target = [heart[0] * dive, lerp(elevation, heart[1], dive), heart[2] * dive];
  const parallax = pointer[0] * .035 * (1 - dive);
  return { progress: p, angle, radius, elevation, target,
    position: [target[0] + Math.sin(angle + parallax) * radius, target[1] + pointer[1] * .035 * (1 - dive), target[2] + Math.cos(angle + parallax) * radius] };
}

export function projectAnchor(position, camera, viewport, vector) {
  vector.set(...position).project(camera);
  return { x: (vector.x * .5 + .5) * viewport.width, y: (-vector.y * .5 + .5) * viewport.height,
    visible: vector.z > -1 && vector.z < 1 && Math.abs(vector.x) < .92 && Math.abs(vector.y) < .86 };
}
