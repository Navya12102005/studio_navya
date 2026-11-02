'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useMotion } from './MotionProvider';

export function Magnetic({ children, className = '' }) {
  return <span className={`magnetic ${className}`}>{children}</span>;
}

export function Tilt({ children, className = '' }) {
  const ref = useRef(null);
  const { enabled } = useMotion();
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !matchMedia('(pointer: fine)').matches) return;
    const x = gsap.quickTo(el, 'rotationX', { duration: .6, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'rotationY', { duration: .6, ease: 'power3.out' });
    function move(e) {
      const r = el.getBoundingClientRect();
      x(-(e.clientY - r.top - r.height / 2) / r.height * 5);
      y((e.clientX - r.left - r.width / 2) / r.width * 5);
    }
    function reset() { x(0); y(0); }
    gsap.set(el, { transformPerspective: 1100 });
    el.addEventListener('pointermove', move); el.addEventListener('pointerleave', reset);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', reset); gsap.killTweensOf(el); gsap.set(el, { clearProps: 'transform' }); };
  }, [enabled]);
  return <div ref={ref} className={`tilt-card ${className}`}>{children}</div>;
}

export function Cursor() {
  const ref = useRef(null);
  const { enabled, blocked } = useMotion();
  useEffect(() => {
    if (!enabled || blocked || !matchMedia('(pointer: fine)').matches) return;
    const el = ref.current;
    const x = gsap.quickTo(el, 'x', { duration: .2, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: .2, ease: 'power3.out' });
    const move = e => {
      el.style.opacity = '1'; x(e.clientX); y(e.clientY);
      el.classList.toggle('cursor-active', Boolean(e.target.closest('a,button,summary,[data-cursor]')));
    };
    const hide = () => { el.style.opacity = '0'; };
    const out = e => { if (!e.relatedTarget) hide(); };
    addEventListener('pointermove', move); document.addEventListener('pointerout', out); addEventListener('keydown', hide);
    return () => {
      removeEventListener('pointermove', move); document.removeEventListener('pointerout', out); removeEventListener('keydown', hide);
      gsap.killTweensOf(el); hide();
    };
  }, [enabled, blocked]);
  return <div className="custom-cursor" ref={ref} aria-hidden="true"><i /><span /></div>;
}
