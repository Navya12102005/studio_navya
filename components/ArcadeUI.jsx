'use client';
import { useEffect, useRef } from 'react';
import { animate } from 'framer-motion';
import { useMotion } from './MotionProvider';

export default function ArcadeUI() {
  const bar = useRef(null), sprite = useRef(null), meter = useRef(null), burst = useRef(null);
  const { enabled, active } = useMotion();
  useEffect(() => {
    let frame = 0, previous = -1;
    function paint() {
      frame = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? Math.max(0, Math.min(1, scrollY / max)) : 0;
      bar.current.style.transform = `scaleX(${p})`;
      sprite.current.style.left = `calc(${p * 100}% - ${p * 14}px)`;
      const percent = Math.round(p * 100);
      if (percent !== previous) { previous = percent; meter.current.setAttribute('aria-valuenow', String(percent)); }
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    const observer = new ResizeObserver(schedule); observer.observe(document.body);
    addEventListener('scroll', schedule, { passive: true }); addEventListener('resize', schedule); paint();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); removeEventListener('scroll', schedule); removeEventListener('resize', schedule); };
  }, []);
  useEffect(() => {
    if (!enabled || !active) return;
    const layer = burst.current;
    const springs = new Set();
    function click(event) {
      const target = event.target.closest('a,button,summary');
      if (!target || target.disabled || !event.isTrusted) return;
      // Keyboard activation has no pointer coordinates. Keep its spring feedback,
      // but place particles at the button rather than at the document origin.
      const r = target.getBoundingClientRect();
      const x = event.detail ? event.clientX : r.left + r.width / 2;
      const y = event.detail ? event.clientY : r.top + r.height / 2;
      const warm = Boolean(target.closest('.creative,.warm,.arcade-warm,#contact'));
      for (let i = 0; i < 8 && layer.children.length < 64; i++) {
        const pixel = document.createElement('i');
        pixel.style.left = `${x}px`; pixel.style.top = `${y}px`;
        pixel.style.background = warm ? ['#f7ba8f', '#e6a2c9'][i % 2] : ['#9edce9', '#baa6ee'][i % 2];
        layer.append(pixel);
        const angle = i / 8 * Math.PI * 2, distance = 20 + i % 3 * 9;
        const animation = pixel.animate([{ transform: 'translate(-50%,-50%) scale(1)', opacity: .9 }, { transform: `translate(${Math.cos(angle) * distance}px,${Math.sin(angle) * distance + 10}px) scale(.3)`, opacity: 0 }], { duration: 420 + i * 17, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' });
        animation.onfinish = () => pixel.remove(); animation.oncancel = () => pixel.remove();
      }
      // Animate the actual control, leaving its magnetic wrapper independent.
      const spring = animate(target, { scale: [.97, 1] }, { type: 'spring', stiffness: 520, damping: 17, mass: .55 });
      springs.add(spring); spring.then(() => springs.delete(spring));
    }
    document.addEventListener('click', click);
    return () => { document.removeEventListener('click', click); layer.replaceChildren(); springs.forEach(spring => spring.complete()); springs.clear(); };
  }, [enabled, active]);
  return <><div className="realm-backdrop" aria-hidden="true" /><div ref={meter} className="pixel-reading-progress" role="progressbar" aria-label="Portfolio scroll depth" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span ref={bar} /><i ref={sprite} aria-hidden="true"><b /><b /><b /></i></div><div ref={burst} className="pixel-burst-layer" aria-hidden="true" /></>;
}
