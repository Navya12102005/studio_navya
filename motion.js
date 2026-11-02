/* Motion direction: Lenis + GSAP, optional Vanta NET, and a React Bits-inspired
   SpotlightCard treatment adapted for this static portfolio. See THIRD_PARTY.md. */
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 901px) and (pointer: fine)');
  const root = document.documentElement;
  const hero = document.querySelector('.hero');
  const background = document.createElement('div');
  background.className = 'neural-atmosphere';
  background.setAttribute('aria-hidden', 'true');
  hero.prepend(background);
  let lenis, context, effect, heroVisible = true, generation = 0;
  const scripts = new Map();
  const paused = () => reduce.matches || root.classList.contains('visuals-paused');
  const blocked = () => paused() || document.hidden || document.body.classList.contains('menu-open');
  const tick = time => lenis?.raf(time * 1000);
  function loadScript(src) {
    if (!scripts.has(src)) scripts.set(src, new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src; script.onload = resolve; script.onerror = reject;
      document.head.append(script);
    }));
    return scripts.get(src);
  }
  function destroyBackground() {
    generation++;
    effect?.destroy(); effect = null;
    background.dataset.state = 'static';
  }
  async function syncBackground() {
    if (blocked() || !desktop.matches || !heroVisible || navigator.connection?.saveData) {
      destroyBackground(); return;
    }
    if (effect || background.dataset.state === 'loading' || background.dataset.state === 'unavailable') return;
    background.dataset.state = 'loading';
    const run = ++generation;
    try {
      // Heavy WebGL dependencies are only requested on a visible desktop opening.
      await loadScript('vendor/three.min.js');
      await loadScript('vendor/vanta.net.min.js');
      if (run !== generation || blocked() || !heroVisible || !desktop.matches) return;
      effect = window.VANTA.NET({
        el: background, THREE: window.THREE, mouseControls: false, touchControls: false,
        gyroControls: false, backgroundColor: 0x08070b, color: 0x8e789f,
        points: 5, maxDistance: 19, spacing: 23, showDots: false,
        scale: 1.5, scaleMobile: 2, minHeight: 200, minWidth: 200
      });
      background.dataset.state = 'active';
      effect.renderer.domElement.addEventListener('webglcontextlost', () => {
        destroyBackground(); background.dataset.state = 'unavailable';
      }, { once: true });
    } catch {
      if (run === generation) { destroyBackground(); background.dataset.state = 'unavailable'; }
    }
  }
  function syncScrolling() {
    const wanted = desktop.matches && !paused() && window.Lenis && window.gsap;
    if (!wanted && lenis) {
      window.gsap.ticker.remove(tick); lenis.destroy(); lenis = null;
    }
    if (wanted && !lenis) {
      lenis = new window.Lenis({ duration: 1.05, smoothWheel: true, anchors: true, syncTouch: false });
      lenis.on('scroll', () => window.ScrollTrigger?.update());
      window.gsap.ticker.add(tick);
    }
    if (lenis) { if (blocked()) lenis.stop(); else lenis.start(); }
    root.dataset.smoothScroll = lenis ? 'enabled' : 'native';
  }
  function syncEntrances() {
    if (!window.gsap || !window.ScrollTrigger) return;
    if (paused()) { context?.revert(); context = null; return; }
    if (!context) {
      const gsap = window.gsap;
      gsap.registerPlugin(window.ScrollTrigger);
      context = gsap.context(() => {
        // Content is visible by default; a library failure never hides the page.
        if (scrollY < innerHeight * .4) {
          gsap.from('.hero-kicker, .hero h1, .hero .intro, .chapters, .work-cta, .availability', {
            y: 28, opacity: 0, duration: 1.15, stagger: .12, ease: 'power3.out', clearProps: 'transform,opacity'
          });
        }
        document.querySelectorAll('.project, .strengths-card').forEach(card => {
          gsap.from(card, { y: 32, duration: .85, ease: 'power3.out', clearProps: 'transform',
            scrollTrigger: { trigger: card, start: 'top 94%', once: true } });
        });
      });
    }
    // Freeze active entrances when the navigation or browser tab covers them.
    context.getTweens().forEach(tween => tween.paused(blocked()));
  }
  // Pointer-local light, inspired by React Bits SpotlightCard. No React runtime
  // is needed; keyboard focus receives the same illuminated boundary through CSS.
  document.querySelectorAll('.project, .strengths-card').forEach(card => {
    card.classList.add('spotlight-surface');
    card.addEventListener('pointermove', event => {
      if (blocked() || !desktop.matches || event.pointerType !== 'mouse') return;
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--light-x', `${event.clientX - bounds.left}px`);
      card.style.setProperty('--light-y', `${event.clientY - bounds.top}px`);
    }, { passive: true });
  });
  function sync() {
    syncScrolling(); syncEntrances(); syncBackground();
    root.dataset.motion = paused() ? 'static' : 'enhanced';
  }
  new IntersectionObserver(entries => {
    heroVisible = entries[0].isIntersecting; syncBackground();
  }, { rootMargin: '80px' }).observe(hero);
  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['class'] });
  new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  reduce.addEventListener('change', sync);
  desktop.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  addEventListener('pagehide', () => {
    window.gsap?.ticker.remove(tick); lenis?.destroy(); lenis = null;
    context?.revert(); context = null; destroyBackground();
  });
  addEventListener('pageshow', sync);
  sync();
})();
