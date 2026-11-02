'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { useMotion } from './MotionProvider';

export default function CinematicIntro() {
  const { intro, enabled } = useMotion();
  const [sound, setSound] = useState(false), [unavailable, setUnavailable] = useState(false);
  const audio = useRef(null), timer = useRef(null), skip = useRef(null), soundButton = useRef(null);
  useEffect(() => {
    if (!intro) return;
    const previous = document.activeElement;
    skip.current?.focus({ preventScroll: true });
    document.documentElement.classList.add('cinematic-open');
    return () => {
      document.documentElement.classList.remove('cinematic-open');
      if (previous instanceof HTMLElement && previous !== document.body && document.contains(previous)) previous.focus({ preventScroll: true });
    };
  }, [intro]);
  useEffect(() => {
    const sync = event => {
      if (!audio.current || !sound) return;
      const { context, gain, low, high } = audio.current, p = event.detail;
      low.frequency.setTargetAtTime(55 + Math.sin(p * Math.PI) * 43, context.currentTime, .06);
      high.frequency.setTargetAtTime(110 + p * 100, context.currentTime, .08);
      gain.gain.setTargetAtTime(.018 * Math.sin(Math.min(1, p + .06) * Math.PI), context.currentTime, .08);
    };
    addEventListener('portfolio:intro-energy', sync);
    return () => removeEventListener('portfolio:intro-energy', sync);
  }, [sound]);
  useEffect(() => {
    if (intro) return;
    setSound(false);
    if (audio.current) {
      const current = audio.current;
      current.gain.gain.setTargetAtTime(0, current.context.currentTime, .04);
      timer.current = setTimeout(() => { current.context.close(); if (audio.current === current) audio.current = null; }, 200);
    }
  }, [intro]);
  useEffect(() => () => { clearTimeout(timer.current); audio.current?.context.close(); }, []);
  useEffect(() => {
    const silence = () => {
      if (!document.hidden || !audio.current) return;
      audio.current.gain.gain.value = 0;
      audio.current.context.suspend().catch(() => {}); setSound(false);
    };
    document.addEventListener('visibilitychange', silence);
    return () => document.removeEventListener('visibilitychange', silence);
  }, []);
  async function toggleSound(event) {
    event.stopPropagation();
    try {
      if (sound) {
        audio.current.gain.gain.setTargetAtTime(0, audio.current.context.currentTime, .04); setSound(false); return;
      }
      if (!audio.current) {
        const Audio = window.AudioContext || window.webkitAudioContext;
        const context = new Audio(), gain = context.createGain(), low = context.createOscillator(), high = context.createOscillator();
        gain.gain.value = 0; low.frequency.value = 55; high.frequency.value = 110;
        low.connect(gain); high.connect(gain); gain.connect(context.destination); low.start(); high.start();
        audio.current = { context, gain, low, high };
      }
      await audio.current.context.resume(); setSound(true);
    } catch { setUnavailable(true); }
  }
  if (!intro || !enabled) return null;
  return <div className="cinematic-overlay" role="region" aria-label="Cosmic introduction" onKeyDown={event => {
    if (event.key === 'Escape') dispatchEvent(new Event('portfolio:intro-skip'));
    if (event.key === 'Tab') {
      const last = unavailable ? skip.current : soundButton.current;
      if (event.shiftKey && document.activeElement === skip.current) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); skip.current?.focus(); }
    }
  }} onClick={() => dispatchEvent(new Event('portfolio:intro-accelerate'))}>
    <div className="intro-top"><span>NAVYA GUPTA / A CONNECTED UNIVERSE</span><button ref={skip} onClick={event => { event.stopPropagation(); dispatchEvent(new Event('portfolio:intro-skip')); }}>Skip intro <ArrowRight size={13} /></button></div>
    <div className="intro-caption"><span>FROM INFINITE POSSIBILITIES</span><p>One connected mind.</p><small>SCROLL OR CLICK TO CONVERGE</small></div>
    <button className="intro-sound" ref={soundButton} disabled={unavailable} aria-pressed={sound} onClick={toggleSound}>{sound ? <Volume2 size={14} /> : <VolumeX size={14} />}{unavailable ? 'Sound unavailable' : sound ? 'Sound on' : 'Enable ambient sound'}</button>
    <span className="intro-bottom-note">A MOMENT BEFORE THE CONNECTION.</span>
  </div>;
}
