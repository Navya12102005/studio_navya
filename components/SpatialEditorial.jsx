'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotion } from './MotionProvider';

export function SpatialQuote({ children, source = 'NAVYA / ON CONNECTING DISCIPLINES' }) {
  const ref = useRef(null);
  const { enabled } = useMotion();
  useEffect(() => {
    if (!enabled) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current, { '--quote-warmth': 0 }, { '--quote-warmth': 1, ease: 'none', scrollTrigger: {
        trigger: ref.current, start: 'top 90%', end: 'bottom 20%', scrub: 1.2
      } });
    });
    return () => ctx.revert();
  }, [enabled]);
  return <figure className="spatial-quote" ref={ref}><blockquote>{children}</blockquote><figcaption>{source}</figcaption></figure>;
}

export function MicroTelemetry({ index = 0 }) {
  return <div className="micro-telemetry" aria-hidden="true"><span>[STATUS: ACTIVE]</span><span>NODE / {String(index + 1).padStart(3, '0')}</span><span data-pointer-coordinate>X 0.500 / Y 0.500</span><span>DEPTH / <b data-spatial-depth>0.000</b></span></div>;
}

// Screen readers retain the editorial HTML. The matching visual markers are
// real billboards anchored in the 3D world; no canvas text is the sole content.
export function SpatialMilestones() {
  return <div className="spatial-milestones" aria-hidden="true">{['brain', 'spine', 'heart'].map(id =>
    <span key={id} className="spatial-milestone" data-world-anchor={id}><i />{id === 'brain' ? '01 / NEURAL ORIGIN' : id === 'spine' ? '02 / CONNECTIVE SYSTEM' : '03 / CREATIVE CORE'}</span>
  )}</div>;
}
