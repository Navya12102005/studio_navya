'use client';

import { useRef } from 'react';
import { motion, MotionConfig, useInView } from 'framer-motion';
import { useMotion } from './MotionProvider';

/* Original Aceternity-style grid/beam and opposed-conic Lamp compositions.
   The official registry returned HTTP 403; no upstream component source is
   claimed or copied. Framer Motion supplies the actual motion runtime. */
export default function RealmAtmosphere({ realm }) {
  const ref = useRef(null), visible = useInView(ref, { margin: '100px' });
  const { enabled, active } = useMotion();
  const run = enabled && active && visible;
  return <MotionConfig reducedMotion={enabled ? 'user' : 'always'}><div ref={ref} className={`realm-atmosphere ${realm}`} aria-hidden="true">
    {realm === 'tech' ? <>
      <div className="realm-geometric-grid" />
      <motion.div className="realm-beam realm-beam-cyan" animate={run ? { y: [-25, 35, -25], opacity: [.15, .4, .15] } : { y: 0, opacity: .18 }} transition={run ? { duration: 12, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }} />
      <motion.div className="realm-beam realm-beam-violet" animate={run ? { y: [25, -30, 25], opacity: [.1, .3, .1] } : { y: 0, opacity: .14 }} transition={run ? { duration: 15, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }} />
      <span className="realm-effect-label">LAB / GEOMETRY & SIGNAL</span>
    </> : <div className="realm-lamp">
      <motion.div className="lamp-cone lamp-cone-left" initial={false} animate={{ scaleX: run ? 1 : .7, opacity: run ? .6 : .3 }} transition={{ duration: enabled ? 1 : 0, ease: 'easeOut' }} />
      <motion.div className="lamp-cone lamp-cone-right" initial={false} animate={{ scaleX: run ? 1 : .7, opacity: run ? .65 : .3 }} transition={{ duration: enabled ? 1 : 0, ease: 'easeOut' }} />
      <div className="lamp-glow" />
      <motion.div className="lamp-filament" initial={false} animate={{ scaleX: run ? 1 : .6, opacity: run ? 1 : .6 }} transition={{ duration: enabled ? 1 : 0, ease: 'easeOut' }} />
      <span className="realm-effect-label">STUDIO / A DIFFERENT KIND OF LIGHT</span>
    </div>}
  </div></MotionConfig>;
}
