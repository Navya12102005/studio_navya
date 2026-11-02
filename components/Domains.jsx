'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowUpRight, ArrowRight, X, Atom, Fingerprint, Layers3, Cpu, Sparkles, MoveUpRight } from 'lucide-react';
import { Magnetic } from './Interactions';
import { useMotion } from './MotionProvider';
import { techProjects, creativeProjects } from '../lib/projects';
import { MicroTelemetry, SpatialQuote } from './SpatialEditorial';
import { spatialState, clamp01 } from '../lib/spatial';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function ProjectCard({ project, domain, onOpen, index }) {
  const { enabled } = useMotion();
  const title = useRef(null);
  function glitch() {
    if (!enabled || domain !== 'creative') return;
    const el = title.current;
    gsap.killTweensOf(el); el.dataset.glitch = 'active';
    gsap.fromTo(el, { '--glitch-shift': '-3px' }, { '--glitch-shift': '3px', duration: 1 / 60, repeat: 1, yoyo: true, ease: 'steps(1)',
      onComplete: () => { delete el.dataset.glitch; } });
  }
  useEffect(() => () => gsap.killTweensOf(title.current), []);
  return <article className={`spatial-project ${index % 2 ? 'spatial-right' : 'spatial-left'}`} data-project-index={index} data-project-anchor={project.id}>
    <MicroTelemetry index={index} />
    <div className="spatial-project-copy" onPointerEnter={glitch}>
      <p className="project-category">{project.category}</p>
      <h3 ref={title} data-glitch-text={project.title.replace('\n',' ')}>{project.title.split('\n').map((line,i)=><span key={i}>{line}<br /></span>)}</h3>
      <p className="spatial-description">{project.description}</p>
      <div className="spatial-tags">{project.tags.map(tag=><span key={tag}>{tag}</span>)}</div>
      <button className="text-cta spatial-project-open" onFocus={glitch} onClick={event=>onOpen(project,event.currentTarget)} aria-label={`Explore ${project.category}`}>Explore the work <ArrowUpRight size={18} strokeWidth={1.3}/></button>
    </div>
    <span className="spatial-project-index" aria-hidden="true">{project.number}</span>
  </article>;
}

export default function Domains() {
  const [selected, setSelected] = useState(null);
  const [switching, setSwitching] = useState(false);
  const [domain, setDomain] = useState('tech');
  const { enabled, setBlocked } = useMotion();
  const host = useRef(null);
  const wipe = useRef(null), panel = useRef(null), dialog = useRef(null), opener = useRef(null), tabs = useRef([]);
  const projects = domain === 'tech' ? techProjects : creativeProjects;
  useEffect(() => {
    spatialState.realm = domain; document.documentElement.dataset.realm = domain;
    dispatchEvent(new CustomEvent('portfolio:realm', { detail: domain }));
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [domain]);
  useEffect(() => {
    const root = host.current;
    let visible = false, lastCoordinate = 0;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; spatialState.workVisible = visible; }, { rootMargin: '80px' });
    observer.observe(root);
    function pointer(event) {
      spatialState.pointer.x = event.clientX / innerWidth - .5;
      spatialState.pointer.y = .5 - event.clientY / innerHeight;
      if (!enabled || !visible || performance.now() - lastCoordinate < 80) return;
      lastCoordinate = performance.now();
      for (const el of root.querySelectorAll('[data-pointer-coordinate]')) el.textContent = `X ${(event.clientX / innerWidth).toFixed(3)} / Y ${(event.clientY / innerHeight).toFixed(3)}`;
    }
    function tick() {
      if (!visible) return;
      const bounds = root.getBoundingClientRect();
      spatialState.work = clamp01(-bounds.top / (bounds.height - innerHeight));
      let nearest = 0, distance = Infinity;
      for (const article of root.querySelectorAll('[data-project-index]')) {
        const rect = article.getBoundingClientRect(), delta = Math.abs(rect.top + rect.height * .5 - innerHeight * .5);
        if (delta < distance) { distance = delta; nearest = Number(article.dataset.projectIndex); }
        const depth = clamp01(1 - Math.abs(rect.top) / innerHeight);
        article.querySelector('[data-spatial-depth]').textContent = depth.toFixed(3);
        // Small perspective shift only; paragraphs remain in normal document
        // flow and cannot collide or clip when canvas support is unavailable.
        article.style.setProperty('--spatial-drift', enabled ? `${Math.max(-16, Math.min(16, (rect.top / innerHeight - .3) * -12))}px` : '0px');
      }
      spatialState.project = nearest;
    }
    addEventListener('pointermove', pointer, { passive: true });gsap.ticker.add(tick);
    return () => { observer.disconnect();removeEventListener('pointermove',pointer);gsap.ticker.remove(tick);spatialState.workVisible=false; };
  }, [enabled, domain]);
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
    gsap.fromTo(overlay, { scale: .7, opacity: 0 }, { scale: 1, opacity: .35, duration: .33, ease: 'power3.inOut', onComplete: () => {
      setDomain(next);
      gsap.to(overlay, { scale: 1, opacity: 0, duration: .4, delay: .1, ease: 'power3.inOut', onComplete: () => { setSwitching(false); ScrollRefresh(); } });
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
  function ScrollRefresh() { ScrollTrigger.refresh(); }
  function tabKey(event, index) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - index;
    tabs.current[next].focus(); switchDomain(next ? 'creative' : 'tech');
  }
  function open(project, button) { opener.current = button; setSelected(project); }
  return <section id="work" ref={host} className={`domains page-gutter ${domain}`}>
    <div className="section-meta"><span>01 — SELECTED WORLDS</span><span>AN INTERSECTION, NOT A DIVIDE.</span></div>
    <div className="domain-intro"><h2 data-realm-heading>One mind.<br /><em>Two worlds.</em></h2><div><p>Some ideas ask for a method.<br />Others ask for a little instinct.<br /><span>I like working where they meet.</span></p><div className="domain-legend"><i /> EXPLORE BOTH SIDES <ArrowDownIcon /></div></div></div>
    <div className="domain-tabs" role="tablist" aria-label="Portfolio domain">
      {[['tech', 'Tech & Bioengineering', '01', Fingerprint], ['creative', 'Creative, PR & Strategy', '02', Sparkles]].map(([id, label, n, Icon], i) => <button key={id} id={`tab-${id}`} role="tab" ref={el => { tabs.current[i] = el; }} aria-selected={domain === id} aria-controls="domain-panel" tabIndex={domain === id ? 0 : -1} onKeyDown={event => tabKey(event, i)} onClick={() => switchDomain(id)}><span>{n}</span><Icon size={17} strokeWidth={1.2} /><span>{label}</span><ArrowUpRight size={16} /></button>)}
    </div>
    <div className="domain-panel-wrap">
      <div className="domain-wipe" ref={wipe} aria-hidden="true"><span>CONNECTING THE DOTS.</span></div>
      <div id="domain-panel" role="tabpanel" aria-labelledby={`tab-${domain}`} ref={panel} tabIndex={0}>
        <div className="domain-note"><span>{domain === 'tech' ? 'PATTERNS. PROCESSES. POSSIBILITIES.' : 'PEOPLE. PERSPECTIVE. POSSIBILITY.'}</span><span>{projects.length.toString().padStart(2, '0')} EXPLORATIONS</span></div>
        <div className={`spatial-projects ${domain === 'creative' ? 'spatial-editorial' : ''}`} key={domain}>{projects.map((project,index) => <ProjectCard key={project.id} project={project} index={index} domain={domain} onOpen={open} />)}</div>
        <SpatialQuote source={domain === 'tech' ? 'THE BIO-TECH LAB / A WORKING PHILOSOPHY' : 'THE CREATIVE STUDIO / A WORKING PHILOSOPHY'}>{domain === 'tech' ? 'Find the pattern. Ask a better question.' : 'Ideas become meaningful when they move people.'}</SpatialQuote>
      </div>
    </div>
    <p className="portfolio-footnote"><span className="status-dot" /> A living collection of research context, independent concepts, leadership and builds. Explore each work for scope and context.</p>
    {selected ? <dialog ref={dialog} className={`project-dialog ${domain}`} onCancel={event => { event.preventDefault(); setSelected(null); }} onClick={event => { if (event.target === event.currentTarget) setSelected(null); }} aria-labelledby="project-dialog-title">
      <div className="dialog-inner"><button className="dialog-close" aria-label="Close project" onClick={() => setSelected(null)}><X size={21} /></button><p className="eyebrow">{selected.type} / {selected.number}</p><p className="project-category">{selected.category}</p><h2 id="project-dialog-title">{selected.title.replace('\n', ' ')}</h2><p className="dialog-description">{selected.detail}</p><div className="dialog-scope"><span>IN FOCUS</span>{selected.outputs.map((output, i) => <div key={output}><span>0{i + 1}</span><p>{output}</p><ArrowUpRight size={16} /></div>)}</div>{selected.source ? <p><a className="text-cta" href={selected.source} download>Download the working Python study<ArrowUpRight size={15} /></a></p> : null}<Magnetic><a className="text-cta" href="#contact" onClick={() => setSelected(null)}>Start a conversation <ArrowRight size={16} /></a></Magnetic></div>
    </dialog> : null}
  </section>;
}

function ArrowDownIcon() { return <MoveUpRight size={13} className="rotate-90" aria-hidden="true" />; }
