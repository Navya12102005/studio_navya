'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';

const MotionContext = createContext({ reduced: true, paused: false, enabled: false });
export const useMotion = () => useContext(MotionContext);

export function MotionProvider({ children }) {
  const [reduced, setReduced] = useState(true);
  const [paused, setPaused] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [intro, setIntro] = useState(false);
  const [touch, setTouch] = useState(true);
  const [visible, setVisible] = useState(true);
  const [reading, setReading] = useState(false);
  const [flightReady, setFlightReady] = useState(false);
  const scrollRef = useRef(null);
  useEffect(() => {
    setReading(new URLSearchParams(location.search).has('reading'));
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
  const enabled = !reduced && !reading;
  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? 'reduced' : paused || reading ? 'paused' : 'full';
  }, [reduced, paused, reading]);
  const value = { reduced, paused, reading, setReading, flightReady, setFlightReady, enabled, active: enabled && !paused && visible && !blocked, setPaused, setBlocked, blocked, scrollRef, intro, setIntro };
  return <MotionContext.Provider value={value}>
    {children}
  </MotionContext.Provider>;
}
