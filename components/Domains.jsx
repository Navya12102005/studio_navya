'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowUpRight, ArrowRight, X, Atom, Fingerprint, Layers3, Cpu, Sparkles, MoveUpRight } from 'lucide-react';
import SpotlightCard from './react-bits/SpotlightCard';
import { Magnetic, Tilt } from './Interactions';
import { useMotion } from './MotionProvider';
import { techProjects, creativeProjects } from '../lib/projects';
import { CardTelemetry } from './DiagnosticHUD';

function ProjectVisual({ kind }) {
  if (kind === 'retina') return <div className="project-visual retina-visual"><div className="retina-orb" /><svg viewBox="0 0 300 200" aria-hidden="true"><path d="M150 104C118 76 119 32 76 20M150 104C170 65 204 46 238 35M150 104C104 112 65 86 20 100M150 104C194 120 232 100 285 122M150 104C139 144 100 161 91 194M150 104C179 146 202 164 223 196"/><path d="M117 68 94 63 91 39M189 60l7-27M100 110 74 144M203 116l19 29M130 144l-25-2"/><circle cx="150" cy="104" r="6" /></svg><span>RETINAL NETWORK / AN EXPLORATION</span></div>;
  if (kind === 'molecule') return <div className="project-visual molecule-visual"><Atom strokeWidth={.65} aria-hidden="true" /><i /><i /><i /><span>STRUCTURE → INTERACTION</span></div>;
  if (kind === 'data') return <div className="project-visual data-visual"><div className="mini-data"><span>DATA, WITH DIRECTION.</span><div>{[28, 55, 39, 72, 57, 91, 78, 100, 85, 118].map((height, i) => <i key={i} style={{ height }} />)}</div><small>ILLUSTRATIVE DATA STUDY — NOT CLIENT RESULTS</small></div></div>;
  if (kind === 'code') return <div className="project-visual code-visual"><span className="code-orbit"><Cpu strokeWidth={.7} /></span><pre><span>const</span> possibility = {'{'}<br />  curiosity: <b>true</b>,<br />  disciplines: <b>['science', 'art']</b>,<br />  limits: <b>null</b><br />{'}'};</pre></div>;
  if (kind === 'orbit') return <div className="creative-art orbit-visual"><div /><div /><div /><span>Ideas.<br /><em>In motion.</em></span></div>;
  if (kind === 'grid') return <div className="creative-art grid-visual"><span>the art<br />of <em>making<br />it happen.</em></span><i>01 → 02 → 03</i></div>;
  if (kind === 'studio') return <div className="creative-art studio-visual"><span>SN<small>STUDIO NAVYA</small></span><i>A CONSIDERED KIND OF DIFFERENT.</i></div>;
  return <div className="creative-art voice-visual"><span>Not more<br />words.<br /><em>The right ones.</em></span><i>VOICE / STRATEGY / CONNECTION</i></div>;
}

function ProjectCard({ project, domain, onOpen }) {
  const { enabled } = useMotion();
  const Shell = enabled ? SpotlightCard : 'div';
  const shellProps = enabled ? { spotlightColor: domain === 'tech' ? '#78dcff' : '#ffad94', intensity: .11, borderGlow: .6, grain: .04, spotlightSize: 340, theme: 'dark' } : {};
  return <Tilt className={`project-shell ${project.size === 'wide' ? 'wide' : ''}`}><Shell {...shellProps} className={`portfolio-card ${domain} ${project.number !== '01' ? 'windowed-card' : ''}`}>
    {project.number !== '01' ? <div className="retro-window-bar" aria-hidden="true"><span><i /><i /><i /></span><span>NAVYA / {domain === 'tech' ? 'SYSTEMS' : 'STUDIO'} / {project.number}</span><span>↗</span></div> : null}
    <article className="project-inner" onPointerMove={event => {
      if (!enabled || event.pointerType !== 'mouse') return;
      const r = event.currentTarget.getBoundingClientRect();
      const percent = Math.min(100, Math.max(0, Math.round((event.clientX - r.left) / r.width * 100)));
      event.currentTarget.style.setProperty('--glass-x', `${percent}%`);
      event.currentTarget.style.setProperty('--glass-y', `${(event.clientY - r.top) / r.height * 100}%`);
      const value = event.currentTarget.querySelector('[data-card-progress]');
      if (value) value.textContent = String(percent).padStart(2, '0');
    }}>
      <CardTelemetry index={Number(project.number) - 1} />
      <div className="iridescent-film" aria-hidden="true" />
      <div className="card-eyebrow"><span>{project.type}</span><span>/{project.number}</span></div>
      <ProjectVisual kind={project.visual} />
      <div className="card-copy"><p className="project-category">{project.category}</p><h3>{project.title.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}</h3><p className="card-description">{project.description}</p><div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>
      <button className="card-open" onClick={event => onOpen(project, event.currentTarget)} aria-label={`Explore ${project.category}`}><ArrowUpRight size={19} strokeWidth={1.3} /></button>
    </article>
  </Shell></Tilt>;
}

export default function Domains() {
  const [selected, setSelected] = useState(null);
  const [switching, setSwitching] = useState(false);
  const [domain, setDomain] = useState('tech');
  const { enabled, setBlocked } = useMotion();
  const wipe = useRef(null), panel = useRef(null), dialog = useRef(null), opener = useRef(null), tabs = useRef([]);
  const projects = domain === 'tech' ? techProjects : creativeProjects;
  useEffect(() => {
    if (!selected) return;
    dialog.current.showModal(); setBlocked(true); document.body.classList.add('modal-open');
    return () => { setBlocked(false); document.body.classList.remove('modal-open'); opener.current?.focus({ preventScroll: true }); };
  }, [selected, setBlocked]);
  useEffect(() => () => { gsap.killTweensOf(wipe.current); }, []);
  useEffect(() => {
    if (!enabled) {
      gsap.killTweensOf(wipe.current);
      gsap.set(wipe.current, { scaleX: 0 });
      setSwitching(false);
    }
  }, [enabled]);
  function switchDomain(next) {
    if (next === domain || switching) return;
    if (!enabled) { setDomain(next); return; }
    setSwitching(true);
    const overlay = wipe.current;
    gsap.fromTo(overlay, { scaleX: 0, transformOrigin: 'left', opacity: 1 }, { scaleX: 1, duration: .33, ease: 'power3.inOut', onComplete: () => {
      setDomain(next);
      gsap.to(overlay, { scaleX: 0, transformOrigin: 'right', duration: .4, delay: .1, ease: 'power3.inOut', onComplete: () => { setSwitching(false); ScrollRefresh(); } });
    } });
  }
  useEffect(() => {
    const navigate = event => {
      const target = typeof event.detail === 'string' ? { domain: event.detail } : event.detail;
      if (target?.domain === 'tech' || target?.domain === 'creative') {
        switchDomain(target.domain);
        if (target.project) {
          const project = [...techProjects, ...creativeProjects].find(item => item.id === target.project);
          if (project) {
            opener.current = [...document.querySelectorAll('[data-part-control]')].find(el => el.dataset.partControl === target.part) || document.activeElement;
            setSelected(project);
          }
        }
      }
    };
    addEventListener('portfolio:domain', navigate);
    return () => removeEventListener('portfolio:domain', navigate);
  }, [domain, enabled, switching]);
  function ScrollRefresh() { window.dispatchEvent(new Event('resize')); }
  function tabKey(event, index) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - index;
    tabs.current[next].focus(); switchDomain(next ? 'creative' : 'tech');
  }
  function open(project, button) { opener.current = button; setSelected(project); }
  return <section id="work" className={`domains page-gutter ${domain}`}>
    <div className="section-meta"><span>01 — SELECTED WORLDS</span><span>AN INTERSECTION, NOT A DIVIDE.</span></div>
    <div className="domain-intro"><h2>One mind.<br /><em>Two worlds.</em></h2><div><p>Some ideas ask for a method.<br />Others ask for a little instinct.<br /><span>I like working where they meet.</span></p><div className="domain-legend"><i /> EXPLORE BOTH SIDES <ArrowDownIcon /></div></div></div>
    <div className="domain-tabs" role="tablist" aria-label="Portfolio domain">
      {[['tech', 'Tech & Bioengineering', '01', Fingerprint], ['creative', 'Creative, PR & Strategy', '02', Sparkles]].map(([id, label, n, Icon], i) => <button key={id} id={`tab-${id}`} role="tab" ref={el => { tabs.current[i] = el; }} aria-selected={domain === id} aria-controls="domain-panel" tabIndex={domain === id ? 0 : -1} onKeyDown={event => tabKey(event, i)} onClick={() => switchDomain(id)}><span>{n}</span><Icon size={17} strokeWidth={1.2} /><span>{label}</span><ArrowUpRight size={16} /></button>)}
    </div>
    <div className="domain-panel-wrap">
      <div className="domain-wipe" ref={wipe} aria-hidden="true"><span>CONNECTING THE DOTS.</span></div>
      <div id="domain-panel" role="tabpanel" aria-labelledby={`tab-${domain}`} ref={panel} tabIndex={0}>
        <div className="domain-note"><span>{domain === 'tech' ? 'PATTERNS. PROCESSES. POSSIBILITIES.' : 'PEOPLE. PERSPECTIVE. POSSIBILITY.'}</span><span>{projects.length.toString().padStart(2, '0')} EXPLORATIONS</span></div>
        <div className={`projects-grid ${domain === 'creative' ? 'editorial-grid' : ''}`} key={domain}>{projects.map(project => <ProjectCard key={project.id} project={project} domain={domain} onOpen={open} />)}</div>
      </div>
    </div>
    <p className="portfolio-footnote"><span className="status-dot" /> A living collection of research context, independent concepts, leadership and builds. Open a card for scope and context.</p>
    {selected ? <dialog ref={dialog} className={`project-dialog ${domain}`} onCancel={event => { event.preventDefault(); setSelected(null); }} onClick={event => { if (event.target === event.currentTarget) setSelected(null); }} aria-labelledby="project-dialog-title">
      <div className="dialog-inner"><button className="dialog-close" aria-label="Close project" onClick={() => setSelected(null)}><X size={21} /></button><p className="eyebrow">{selected.type} / {selected.number}</p><p className="project-category">{selected.category}</p><h2 id="project-dialog-title">{selected.title.replace('\n', ' ')}</h2><p className="dialog-description">{selected.detail}</p><div className="dialog-scope"><span>IN FOCUS</span>{selected.outputs.map((output, i) => <div key={output}><span>0{i + 1}</span><p>{output}</p><ArrowUpRight size={16} /></div>)}</div>{selected.source ? <p><a className="text-cta" href={selected.source} download>Download the working Python study<ArrowUpRight size={15} /></a></p> : null}<Magnetic><a className="text-cta" href="#contact" onClick={() => setSelected(null)}>Start a conversation <ArrowRight size={16} /></a></Magnetic></div>
    </dialog> : null}
  </section>;
}

function ArrowDownIcon() { return <MoveUpRight size={13} className="rotate-90" aria-hidden="true" />; }
