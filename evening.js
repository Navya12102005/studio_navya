/* A deterministic, reversible evening. Scroll position owns every story action. */
(() => {
  const clamp = n => Math.max(0, Math.min(1, Number.isFinite(n) ? n : 0));
  const range = (p, a, b) => clamp((p - a) / (b - a));
  const ease = (p, a, b) => { const t = range(p, a, b); return t * t * (3 - 2 * t); };
  function bounce(t) {
    const n = 7.5625, d = 2.75;
    if (t < 1 / d) return n * t * t;
    if (t < 2 / d) { t -= 1.5 / d; return n * t * t + .75; }
    if (t < 2.5 / d) { t -= 2.25 / d; return n * t * t + .9375; }
    t -= 2.625 / d; return n * t * t + .984375;
  }
  function sample(progress, options = {}) {
    let p = clamp(progress);
    // Reduced motion shows settled tableaux rather than travelling objects.
    if (options.reduced) p = p < .3 ? 0 : p < .55 ? .4 : p < .8 ? .72 : 1;
    const light = options.night ? 1 : p;
    const dusk = ease(light, .12, .87), lamp = ease(light, .24, .88);
    const settled = Number(p >= .7);
    const wake = options.reduced ? Number(p >= .4) : ease(p, .25, .39);
    const stand = options.reduced ? settled : ease(p, .44, .57);
    const move = options.reduced ? settled : ease(p, .57, .83);
    const fall = options.reduced ? settled : range(p, .43, .61);
    const unroll = options.reduced ? settled : ease(p, .61, .89);
    const desktop = options.reduced ? settled : ease(p, .23, .43);
    const pillow = options.reduced ? settled : range(p, .55, .83);
    const impact = options.reduced ? 0 : Math.sin(Math.PI * range(p, .76, .83));
    return {
      progress: p, dusk,
      sunY: 276 + 80 * ease(light, 0, .52), sunOpacity: 1 - ease(light, .38, .53),
      skyNight: dusk * .91, upperNight: ease(light, .28, .88) * .72,
      stars: ease(light, .53, .88), moon: ease(light, .66, .96) * .78,
      roomAmbient: 1 - dusk * .38, propAmbient: 1 - dusk * .24,
      lamp: .1 + lamp * .9, lampScale: 1 + lamp * .18,
      fairy: .35 + lamp * .65, wineLevel: 1 - ease(p, .14, .82),
      sleep: 1 - wake, awake: wake * (1 - stand), standing: stand,
      dogX: -172 * move, dogY: 126 * move - 84 * Math.sin(Math.PI * move),
      dogTilt: -5 * Math.sin(Math.PI * move), dogShadowY: 782 + 126 * move,
      dogShadowOpacity: .23 - .12 * Math.sin(Math.PI * move),
      pillowX: 1515 - 65 * pillow, pillowY: 655 + 215 * bounce(pillow),
      pillowAngle: -10 - 160 * pillow + 145 * pillow * pillow,
      pillowSquash: 1 - .12 * impact,
      paperX: 1220 + 122 * desktop + 18 * fall - 234 * unroll,
      paperY: 497 + 5 * desktop + 350 * fall * fall + 13 * unroll,
      paperAngle: -7 + 120 * fall * (1 - ease(p, .61, .68)),
      paperUnroll: unroll, paperFloorOpacity: ease(p, .61, .625),
      paperShadow: .12 + .1 * unroll,
      chapter: p < .25 ? 'golden-hour' : p < .44 ? 'waking' : p < .61 ? 'dusk' : p < .83 ? 'settling-in' : 'night'
    };
  }
  const api = window.StudioRoom, scene = document.querySelector('#continuousScene');
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const $ = selector => scene && scene.querySelector(selector);
  function set(selector, name, value) {
    const el = $(selector); if (!el) return;
    el.setAttribute(name, String(value));
    if (name === 'opacity') el.style.opacity = String(value);
  }
  function render(state) {
    if (!scene) return;
    const f = sample(state.progress, { reduced: media.matches, night: state.night });
    if (state.greetingUntil > performance.now() && f.progress < .44) {
      f.sleep = 0; f.awake = 1; f.standing = 0;
    }
    scene.dataset.evening = f.chapter;
    scene.style.setProperty('--night', (.03 + f.dusk * .58).toFixed(4));
    scene.style.setProperty('--room-ambient', f.roomAmbient.toFixed(4));
    scene.style.setProperty('--prop-ambient', f.propAmbient.toFixed(4));
    scene.style.setProperty('--lamp-strength', f.lamp.toFixed(4));
    scene.style.setProperty('--lamp-brightness', (1 + f.lamp * .35).toFixed(4));
    scene.style.setProperty('--fairy-strength', f.fairy.toFixed(4));
    set('.setting-sun', 'transform', 'translate(0 ' + (f.sunY - 276).toFixed(3) + ')');
    set('.setting-sun', 'opacity', f.sunOpacity);
    set('.window-night-wash', 'opacity', f.skyNight);
    set('.window-upper-night', 'opacity', f.upperNight);
    set('.window-stars', 'opacity', f.stars);
    set('.window-moon', 'opacity', f.moon);
    set('.lamp-halo', 'opacity', f.lamp);
    set('.lamp-halo', 'rx', 186 * f.lampScale);
    set('.lamp-halo', 'ry', 160 * f.lampScale);
    set('.lamp-desk-pool', 'opacity', f.lamp * .55);
    set('.lamp-floor-pool', 'opacity', f.lamp * .32);
    set('.lamp-bulb', 'opacity', f.lamp);
    set('.wine-liquid', 'y', 424 + (1 - f.wineLevel) * 22);
    set('.wine-liquid', 'height', f.wineLevel * 22);
    set('.wine-surface', 'cy', 424 + (1 - f.wineLevel) * 22);
    set('.wine-surface', 'opacity', f.wineLevel < .015 ? 0 : .8);
    set('.retriever-sleeping', 'opacity', f.sleep);
    set('.retriever-awake', 'opacity', f.awake);
    set('.retriever-standing', 'opacity', f.standing);
    set('.dog-sleep-text', 'opacity', f.sleep);
    set('.retriever-travel', 'transform', 'translate(' + f.dogX.toFixed(3) + ' ' + f.dogY.toFixed(3) + ') rotate(' + f.dogTilt.toFixed(3) + ' 1450 720)');
    set('.retriever-ground-shadow', 'cx', 1450 + f.dogX);
    set('.retriever-ground-shadow', 'cy', f.dogShadowY);
    set('.retriever-ground-shadow', 'opacity', f.dogShadowOpacity);
    set('.room-pillow', 'transform', 'translate(' + f.pillowX.toFixed(3) + ' ' + f.pillowY.toFixed(3) + ') rotate(' + f.pillowAngle.toFixed(3) + ') scale(1 ' + f.pillowSquash.toFixed(3) + ')');
    set('.paper-roll-travel', 'transform', 'translate(' + f.paperX.toFixed(3) + ' ' + f.paperY.toFixed(3) + ') rotate(' + f.paperAngle.toFixed(3) + ')');
    const x = f.paperX + 6;
    set('.unrolled-paper', 'd', 'M' + x.toFixed(3) + ' 858 Q' + ((x + 1367) / 2).toFixed(3) + ' 851 1367 855 L1353 892 Q' + ((x + 1353) / 2).toFixed(3) + ' 902 ' + (x - 10).toFixed(3) + ' 892 Z');
    set('.floor-paper', 'opacity', f.paperFloorOpacity);
    set('.paper-floor-shadow', 'opacity', f.paperShadow * f.paperFloorOpacity);
    window.StudioEvening.frame = f;
  }
  window.StudioEvening = { sample, render, frame: sample(0) };
  if (api && scene) {
    api.subscribe(render); media.addEventListener('change', () => render(api.state));
    render(api.state);
  }
})();
