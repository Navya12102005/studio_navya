'use client';
import { useEffect, useRef } from 'react';
import { useMotion } from './MotionProvider';

export default function ParticleField() {
  const canvas = useRef(null);
  const { active, enabled } = useMotion();
  const activeRef = useRef(active);
  useEffect(() => { activeRef.current = active; }, [active]);
  useEffect(() => {
    if (!enabled) return;
    const el = canvas.current, ctx = el.getContext('2d');
    if (!ctx) return;
    let width, height, frame, dots = [], last = 0;
    function resize() {
      width = innerWidth; height = innerHeight;
      const dpr = Math.min(devicePixelRatio, 1.5);
      el.width = width * dpr; el.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = Array.from({ length: width < 700 ? 28 : 65 }, (_, i) => ({
        x: ((i * 137.508) % width), y: ((i * 83.71) % height), speed: .09 + i % 5 * .035, size: i % 4 === 0 ? 1.1 : .55
      }));
    }
    function paint(now) {
      frame = requestAnimationFrame(paint);
      if (now - last < 32 || !activeRef.current) return;
      last = now; ctx.clearRect(0, 0, width, height);
      dots.forEach((dot, i) => {
        dot.y -= dot.speed; if (dot.y < 0) dot.y = height;
        ctx.fillStyle = i % 3 ? 'rgba(140,204,229,.4)' : 'rgba(255,178,137,.45)';
        ctx.beginPath(); ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2); ctx.fill();
      });
    }
    resize(); addEventListener('resize', resize); frame = requestAnimationFrame(paint);
    return () => { cancelAnimationFrame(frame); removeEventListener('resize', resize); };
  }, [enabled]);
  return enabled ? <canvas className="particle-field" ref={canvas} aria-hidden="true" /> : null;
}
