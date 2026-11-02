'use client';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowUpRight, MoveDown } from 'lucide-react';
import { useMotion } from './MotionProvider';
import { Magnetic } from './Interactions';
import { anatomicalParts } from '../lib/anatomy';
import DiagnosticHUD from './DiagnosticHUD';
import CinematicIntro from './CinematicIntro';

const AnatomyScene = dynamic(() => import('./AnatomyScene'), { ssr: false });
const chapters = [
  { id: 'brain', label: '01 / THE MIND', name: 'Think in systems.', text: 'A research-minded approach. An instinct for finding the pattern beneath the complexity.', color: 'cool', at: .33 },
  { id: 'spine', label: '02 / THE CONNECTION', name: 'Connect the unexpected.', text: 'Between science and storytelling, there is a common language: curiosity.', color: 'mixed', at: .63 },
  { id: 'heart', label: '03 / THE INSTINCT', name: 'Create with intent.', text: 'Ideas become meaningful when they move people. Logic gives them structure. Heart gives them life.', color: 'warm', at: 1 }
];
export default function Journey() {
  const section = useRef(null), progress = useRef(0), velocity = useRef(0);
  const [ready, setReady] = useState(false);
  const [sceneChapter, setSceneChapter] = useState(null);
  const [rayPart, setRayPart] = useState(null), [focusedPart, setFocusedPart] = useState(null);
  const inspectedPart = focusedPart || rayPart;
  const inspect = inspectedPart ? anatomicalParts[inspectedPart] : null;
  const { enabled, active, scrollRef, setIntro } = useMotion();
  const onReady = useCallback(value => setReady(value), []);
  const onIntro = useCallback(value => setIntro(value), [setIntro]);
  const onPartHover = useCallback(value => setRayPart(value), []);
  const onPartSelect = useCallback(part => {
    const { domain, project } = anatomicalParts[part];
    dispatchEvent(new CustomEvent('portfolio:domain', { detail: { domain, project, part } }));
    if (project) return;
    const target = document.getElementById('work');
    if (scrollRef.current?.lenis) scrollRef.current.lenis.scrollTo(target);
    else target.scrollIntoView({ behavior: 'smooth' });
  }, [scrollRef]);
  useEffect(() => {
    if (!enabled) { progress.current = 0; setSceneChapter(null); return; }
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ scrollTrigger: {
        trigger: section.current, start: 'top top', end: 'bottom bottom', scrub: .65,
        onUpdate: self => {
          progress.current = self.progress;
          velocity.current = Math.max(-1.5, Math.min(1.5, self.getVelocity() / 4500));
          const next = self.progress < .18 ? null : self.progress < .46 ? 'brain' : self.progress < .76 ? 'spine' : 'heart';
          setSceneChapter(current => current === next ? current : next);
        }
      } });
      timeline.to('.hero-editorial', { opacity: 0, y: -35, duration: .13 }, .05);
      chapters.forEach((chapter, i) => {
        const start = [.2, .49, .78][i];
        timeline.fromTo(`[data-chapter="${chapter.id}"]`, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .09 }, start);
        if (i < 2) timeline.to(`[data-chapter="${chapter.id}"]`, { opacity: 0, y: -24, duration: .08 }, start + .2);
      });
      timeline.to('.journey-progress-fill', { scaleY: 1, duration: 1, ease: 'none' }, 0);
      timeline.fromTo('.diagnostic-sweep', { top: '-5%', opacity: 0 }, { top: '105%', opacity: .42, duration: .24, ease: 'none' }, .43);
      timeline.to('.diagnostic-sweep', { opacity: 0, duration: .06 }, .67);
      gsap.from('.hero-editorial > *', { opacity: 0, y: 20, stagger: .09, duration: 1.1, ease: 'power3.out', clearProps: 'transform,opacity' });
    }, section);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [enabled]);
  function goTo(chapter) {
    const node = section.current;
    const top = enabled ? node.offsetTop + (node.offsetHeight - innerHeight) * Math.min(chapter.at, .98) : document.getElementById(chapter.id).offsetTop;
    const lenis = scrollRef.current?.lenis;
    if (lenis) lenis.scrollTo(top); else window.scrollTo({ top, behavior: enabled ? 'smooth' : 'auto' });
  }
  return <section id="home" ref={section} data-radiance={inspectedPart === 'heart' ? 'warm' : inspectedPart ? 'cool' : 'neutral'} className={`anatomical-journey ${enabled ? 'journey-animated' : 'journey-static'}`} aria-label="From thought to feeling">
    <div className="journey-sticky">
      <div className="scene-vignette" aria-hidden="true" />
      <div className="diagnostic-sweep" aria-hidden="true" />
      <div className={`anatomy-art ${ready && enabled ? 'canvas-ready' : ''}`}>
        <div className="prism-radiation" aria-hidden="true" />
        <img className="anatomy-fallback" src="/art/anatomy.webp" alt="" width="1024" height="1536" fetchPriority="high" />
        {enabled ? <AnatomyScene progress={progress} velocity={velocity} active={active} onReady={onReady} onIntro={onIntro} onPartHover={onPartHover} onPartSelect={onPartSelect} /> : null}
      </div>
      <div className="hero-editorial page-gutter">
        <p className="eyebrow"><span className="status-dot" /> A MULTIDISCIPLINARY MIND</p>
        <h1>The science<br />of <em>possibility.</em></h1>
        <p className="hero-deck">Rooted in biology.<br />Wired for ideas. Moved by people.</p>
        <div className="hero-signature"><span>Navya Gupta</span><span>BIOENGINEERING × CREATIVE STRATEGY</span></div>
        <Magnetic><a className="text-cta" href="#work">Enter my world <ArrowUpRight size={17} strokeWidth={1.3} /></a></Magnetic>
      </div>
      {chapters.map(chapter => <div key={chapter.id} data-chapter={chapter.id} className={`journey-chapter page-gutter ${chapter.color}`}>
        <p className="eyebrow">{chapter.label}</p><h2>{chapter.name}</h2><p>{chapter.text}</p>
      </div>)}
      <div className="specimen-label" aria-hidden="true"><span>FIG. 01 — HUMAN POTENTIAL</span><div className="specimen-rule" /><span>LOGIC <i /> INSTINCT</span></div>
      <div className="floating-code" aria-hidden="true"><span>MAP / CONNECT / INTERPRET</span><span>↳ SYSTEM.PERSPECTIVE</span><span>021 / 034 / 055 / 089</span></div>
      <DiagnosticHUD progress={progress} />
      <div className="anatomy-inspector" onPointerLeave={() => setFocusedPart(null)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocusedPart(null); }}>
        <div className="molecular-nodes" aria-label="Molecular project nodes">{['cell', 'ligand'].map(part => <button key={part} data-part-control={part} onFocus={() => setFocusedPart(part)} onPointerEnter={() => setFocusedPart(part)} onClick={() => onPartSelect(part)} aria-label={`Open ${part} project highlight`}>{part}<ArrowUpRight size={9} /></button>)}</div>
        <div className="anatomy-nodes" aria-label="Explore the anatomy">
          {[chapters[0], { id: 'vascular', color: 'mixed', at: .72 }, chapters[1], chapters[2]].map(chapter => <Magnetic key={chapter.id}><button data-part-control={chapter.id} className={`anatomy-node ${chapter.color}`} onPointerEnter={() => setFocusedPart(chapter.id)} onFocus={() => setFocusedPart(chapter.id)} aria-describedby={inspectedPart === chapter.id ? 'anatomy-readout' : undefined} onClick={() => goTo(chapter)} aria-label={`Explore ${chapter.id}`}><i /><span>{chapter.id}</span></button></Magnetic>)}
        </div>
        {inspect ? <aside className={`anatomy-readout ${inspectedPart === 'heart' ? 'warm' : 'cool'}`} id="anatomy-readout" aria-label={`${inspect.label} anatomy readout`}>
          <span className="eyebrow">{inspect.label}</span><h3>{inspect.title}</h3><p>{inspect.description}</p><small>{inspect.readout}</small><button onClick={() => onPartSelect(inspectedPart)}>{inspect.action}<ArrowUpRight size={13} /></button>
        </aside> : null}
      </div>
      <div className="hero-bottom page-gutter"><a href="#brain" onClick={event => { event.preventDefault(); goTo(chapters[0]); }}><span className="scroll-pill"><ArrowDown size={14} /></span> SCROLL TO FIND THE CONNECTION</a><span className="hero-coordinates">23.2599° N &nbsp; 77.4126° E</span></div>
      <div className="journey-progress" aria-hidden="true"><span className="journey-progress-fill" /></div>
      {enabled && sceneChapter ? <div className={`chapter-preview ${sceneChapter === 'brain' ? 'cool' : 'warm'}`} key={sceneChapter}>
        <span className="eyebrow">{sceneChapter === 'brain' ? 'SYSTEMS / RESEARCH / COMPUTATION' : 'LEADERSHIP / PR / STRATEGY'}</span>
        <button onClick={() => onPartSelect(sceneChapter)}><span>{sceneChapter === 'brain' ? 'Explore the analytical side.' : 'Explore the creative instinct.'}</span><ArrowUpRight size={18} /></button><small>{sceneChapter === 'brain' ? 'BIOENGINEERING × TECHNOLOGY' : 'PEOPLE × PURPOSE × POSSIBILITY'}</small>
      </div> : null}
    </div>
    <div className="static-chapters page-gutter">{chapters.map(chapter => <div className={chapter.color} id={chapter.id} key={chapter.id}><p className="eyebrow">{chapter.label}</p><h2>{chapter.name}</h2><p>{chapter.text}</p><MoveDown size={20} aria-hidden="true" /></div>)}</div>
    <div className="journey-exit page-gutter"><span>DIFFERENT DISCIPLINES.</span><ArrowDown size={16} /><span>ONE CONNECTED PERSPECTIVE.</span></div>
    <CinematicIntro />
  </section>;
}
