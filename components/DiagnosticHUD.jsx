'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useMotion } from './MotionProvider';

// Decorative scan studies. Percentages represent actual page scan progress,
// never invented scientific readings or portfolio performance results.
export default function DiagnosticHUD({ progress }) {
  const host = useRef(null);
  const { enabled, active } = useMotion();
  useEffect(() => {
    if (!enabled) return;
    const el = host.current;
    const number = el.querySelector('[data-scan-progress]');
    const title = el.querySelector('[data-scan-title]');
    const coordinate = el.querySelector('[data-scan-coordinate]');
    let last = -1;
    const tick = () => {
      if (!active) return;
      const p = progress.current, percent = Math.round(p * 100);
      if (percent === last) return; last = percent;
      el.dataset.region = p < .45 ? 'cranial' : p < .75 ? 'spinal' : 'thoracic';
      number.textContent = `${String(percent).padStart(2, '0')}%`;
      title.textContent = p < .45 ? 'CRANIAL / AXIAL' : p < .75 ? 'SPINAL / SAGITTAL' : 'THORACIC / CORONAL';
      coordinate.textContent = `Z / ${(1 - p * .7).toFixed(3)}`;
      el.style.setProperty('--scan-progress', `${percent}%`);
    };
    gsap.ticker.add(tick); tick();
    return () => gsap.ticker.remove(tick);
  }, [enabled, active, progress]);
  function parallax(event) {
    const r = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--hud-x', `${(event.clientX - r.left) / r.width * 8 - 4}px`);
    event.currentTarget.style.setProperty('--hud-y', `${(event.clientY - r.top) / r.height * 8 - 4}px`);
  }
  if (!enabled) return null;
  return <div ref={host} className={`diagnostic-hud ${active ? 'hud-running' : ''}`} aria-hidden="true" data-region="cranial" onPointerMove={parallax}>
    <div className="hud-title"><span>SIGNAL STUDY</span><span>NG / 001</span></div>
    <div className="hud-slice"><div className="slice-grid">{Array.from({ length: 24 }, (_, i) => <i key={i} style={{ '--cell': (i * 7 % 11) / 10, '--cell-delay': `${i * .08}s` }} />)}</div><span className="slice-reticle" /><span className="slice-coordinate">X / 024 &nbsp; Y / 016</span><i className="slice-scan" /></div>
    <div className="hud-readout"><span data-scan-title>CRANIAL / AXIAL</span><span data-scan-coordinate>Z / 1.000</span></div>
    <svg className="hud-wave" viewBox="0 0 160 35"><path className="wave-baseline" d="M0 18H160" /><path d="M0 18h12l4-3 5 6 6-5 5 2h10l5-6 3 10 5-20 5 31 5-20 5 5h10l5-3 4 6 5-3h10l5-7 3 11 5-20 5 30 5-18 5 4h24" /></svg>
    <div className="hud-progress"><span>SCAN PROGRESS</span><strong data-scan-progress>00%</strong><i /></div>
    <span className="hud-disclaimer">ARTISTIC SIGNAL VISUALISATION</span>
  </div>;
}

export function CardTelemetry({ index = 0 }) {
  const ref = useRef(null);
  const { enabled } = useMotion();
  return <div ref={ref} className="card-telemetry" aria-hidden="true"><span>FRAME / {String(index + 1).padStart(3, '0')}</span><span>X {String(24 + index * 13).padStart(3, '0')} · Y {String(16 + index * 7).padStart(3, '0')}</span><span className="card-scan-value">SCAN <b data-card-progress>{enabled ? '00' : ' | '}</b>{enabled ? '%' : ''}</span><i /><i /><i /><i /></div>;
}
