'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const MotionContext = createContext({ reduced: true, paused: false, enabled: false });
export const useMotion = () => useContext(MotionContext);

function ScrollBridge({ blocked }) {
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) return;
    gsap.registerPlugin(ScrollTrigger);
    const tick = time => lenis.raf(time * 1000);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); lenis.off('scroll', ScrollTrigger.update); };
  }, [lenis]);
  useEffect(() => {
    if (!lenis) return;
    // Stop only while a modal is open; pause-visuals keeps native navigation usable.
    if (blocked) lenis.stop(); else lenis.start();
  }, [lenis, blocked]);
  return null;
}

export function MotionProvider({ children }) {
  const [reduced, setReduced] = useState(true);
  const [paused, setPaused] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [intro, setIntro] = useState(false);
  const [touch, setTouch] = useState(true);
  const [visible, setVisible] = useState(true);
  const scrollRef = useRef(null);
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = matchMedia('(pointer: coarse)');
    const sync = () => { setReduced(preference.matches); setTouch(pointer.matches); };
    const visibility = () => setVisible(!document.hidden);
    sync();
    preference.addEventListener('change', sync); pointer.addEventListener('change', sync);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      preference.removeEventListener('change', sync); pointer.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);
  const enabled = !reduced && !paused;
  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? 'reduced' : paused ? 'paused' : 'full';
  }, [reduced, paused]);
  const value = { reduced, paused, enabled, active: enabled && visible && !blocked, setPaused, setBlocked, blocked, scrollRef, intro, setIntro };
  // The maintained React Lenis package supports current React. The retired
  // @studio-freight/react-lenis package has React 17/18-only peer dependencies.
  return <MotionContext.Provider value={value}>
    {enabled && !touch ? <ReactLenis root ref={scrollRef} options={{ autoRaf: false, anchors: true, duration: 1.1, smoothWheel: true, syncTouch: false }}><ScrollBridge blocked={blocked || intro} /></ReactLenis> : null}
    {children}
  </MotionContext.Provider>;
}
