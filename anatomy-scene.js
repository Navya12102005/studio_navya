/* Body → brain → neural interior → chest/heart. Composited layers, not volumetric 3D. */
(() => {
  'use strict';
  const stage = document.querySelector('#anatomyStage');
  const names = ['body', 'brain', 'neuron', 'heart'];
  const layers = Object.fromEntries(names.map(name => [name, stage.querySelector(`.scene-${name}`)]));
  const imageIDs = { brain: '#brainArtwork', neuron: '#neuronArtwork', heart: '#heartArtwork' };
  const anchors = { brain: document.querySelector('#mind'), neuron: document.querySelector('#spark'), heart: document.querySelector('#intent') };
  const experience = document.querySelector('#experience');
  const signalSVG = stage.querySelector('.neuron-signal-svg');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 600px)');
  const meter = document.querySelector('.journey-meter span');
  const caption = document.querySelector('#journeyCaption');
  const ready = { brain: false, neuron: false, heart: false };
  const loading = {};
  let frame = 0, pointer = 0, paused = false, signalPlaying = false;
  let bounds = { brain: 1, neuron: 2, heart: 3, end: 4 };
  const clamp = value => Math.max(0, Math.min(1, value));
  const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
  signalSVG.pauseAnimations();

  async function loadScene(name) {
    if (loading[name]) return;
    loading[name] = true;
    const image = document.querySelector(imageIDs[name]);
    try {
      image.src = image.dataset.src;
      await image.decode();
      ready[name] = true;
      if (name === 'neuron') layers.neuron.style.setProperty('--neural-texture', `url("${image.getAttribute('src')}")`);
      schedule();
    } catch {
      image.hidden = true;
      stage.dataset[`${name}Unavailable`] = 'true';
    }
  }
  function update() {
    frame = 0;
    const vh = Math.max(1, innerHeight);
    const transitions = Object.fromEntries(['brain', 'neuron', 'heart'].map(name => [name, ready[name] ? smooth((scrollY - bounds[name] + vh * .85) / (vh * .8)) : 0]));
    const b = transitions.brain, n = transitions.neuron, h = transitions.heart;
    // Later layers can still appear if an earlier optional asset failed to load.
    const weights = { body: (1 - b) * (1 - n) * (1 - h), brain: b * (1 - n) * (1 - h), neuron: n * (1 - h), heart: h };
    const fade = clamp((bounds.end + vh * .1 - scrollY) / (vh * .55));
    const visible = fade > .001;
    const animated = visible && !document.hidden && !motion.matches && !paused && !document.body.classList.contains('menu-open');
    stage.style.opacity = String(fade);
    stage.style.visibility = visible ? 'visible' : 'hidden';
    stage.classList.toggle('is-visible', visible && !document.hidden);
    for (const name of names) {
      layers[name].style.opacity = String(weights[name]);
      layers[name].classList.toggle('is-active', weights[name] > .05);
    }
    stage.dataset.scene = names.reduce((best, name) => weights[name] > weights[best] ? name : best, 'body');
    const shouldPlaySignal = animated && weights.neuron > .05;
    if (shouldPlaySignal !== signalPlaying) {
      signalPlaying = shouldPlaySignal;
      if (shouldPlaySignal) signalSVG.unpauseAnimations(); else signalSVG.pauseAnimations();
    }
    if (!motion.matches && !paused) {
      const tilt = mobile.matches ? 0 : pointer * 1.2;
      layers.body.querySelector('.scene-figure').style.transform = `translateY(${b * 8}%) scale(${1 + b * .65}) rotate(${tilt}deg)`;
      layers.brain.querySelector('.scene-figure').style.transform = `scale(${1 + n * .45}) rotate(${tilt * .6}deg)`;
      layers.neuron.querySelector('.scene-figure').style.transform = `translateX(${-h * 4}%) scale(${1.02 + n * .045 + h * .05})`;
      layers.heart.querySelector('.scene-figure').style.transform = `scale(${.85 + h * .15}) rotate(${tilt * .4}deg)`;
      stage.querySelector('.chest-art').style.transform = `scale(${1.4 + h * .6})`;
    } else {
      stage.querySelectorAll('.scene-figure, .chest-art').forEach(figure => figure.style.transform = 'none');
    }
    // Load progressively; skipping straight to work does not download every scene.
    for (const name of ['brain', 'neuron', 'heart']) if (visible && bounds[name] - scrollY < vh * 1.7) loadScene(name);
    const progress = clamp((scrollY - bounds.brain) / Math.max(1, bounds.end - bounds.brain));
    meter.style.transform = `scaleX(${progress})`;
    caption.textContent = progress < .35 ? '01 — Start with a better question.' : progress < .75 ? '02 — Find the connection that matters.' : '03 — Give the idea a clear direction.';
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  function cacheBounds() {
    for (const name of ['brain', 'neuron', 'heart']) bounds[name] = anchors[name].getBoundingClientRect().top + scrollY;
    bounds.end = experience.getBoundingClientRect().bottom + scrollY;
    schedule();
  }
  document.querySelector('#crystalAnatomy').addEventListener('error', () => {
    layers.body.hidden = true; stage.classList.add('scene-fallback'); loadScene('brain');
  });
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', cacheBounds);
  addEventListener('pointermove', event => {
    if (motion.matches || mobile.matches || event.pointerType !== 'mouse' || stage.style.visibility === 'hidden') return;
    pointer = event.clientX / Math.max(1, innerWidth) - .5; schedule();
  }, { passive: true });
  document.addEventListener('visibilitychange', schedule);
  new MutationObserver(schedule).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  const pauseButton = document.querySelector('#motionToggle');
  function syncMotionControl() {
    pauseButton.disabled = motion.matches;
    pauseButton.textContent = motion.matches ? 'Reduced motion' : paused ? 'Resume visuals' : 'Pause visuals';
    pauseButton.setAttribute('aria-pressed', String(paused));
    schedule();
  }
  pauseButton.addEventListener('click', () => {
    paused = !paused; document.documentElement.classList.toggle('visuals-paused', paused); syncMotionControl();
  });
  motion.addEventListener('change', () => { syncMotionControl(); cacheBounds(); });
  syncMotionControl();
  new ResizeObserver(cacheBounds).observe(experience);
  cacheBounds();
})();
