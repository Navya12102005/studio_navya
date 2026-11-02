'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUpRight, Terminal, Trophy, RotateCcw, Gamepad2, Sparkles } from 'lucide-react';
import { useMotion } from './MotionProvider';
import { POWERUPS, AVATAR, PALETTE, gameState } from '../lib/arcade';
import { drawArcade } from './arcade-renderer';
import './arcade.css';

const levelNames = { lab: 'The Bio-Tech Lab', studio: 'The Creative Design Studio' };

function StaticLevel({ level }) {
  const color = level === 'lab' ? '#79d2e4' : '#ec9bba';
  return <svg className="arcade-static-art" viewBox="0 0 960 360" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${levelNames[level]} pixel-art illustration`}>
    <rect width="960" height="360" fill="#0a0d1a" /><path d="M0 292H960" stroke={color} strokeWidth="5" />
    {[90, 180, 690, 780].map(x => <g key={x}><rect x={x} y="156" width="58" height="136" fill="#19283b" stroke={color} strokeWidth="2" />{[176, 202, 228, 254].map(y => <g key={y}><rect x={x + 8} y={y} width="42" height="14" fill="#0c1427" /><rect x={x + 14} y={y + 4} width="5" height="5" fill={color} /></g>)}</g>)}
    <rect x="360" y="206" width="180" height="10" fill={color} /><path d="M375 216V292M525 216V292" stroke="#39506c" strokeWidth="6" /><rect x="410" y="151" width="80" height="48" fill="#172d43" stroke={color} strokeWidth="3" /><path d="m425 166 8 6-8 6m16 0h20" fill="none" stroke={color} strokeWidth="3" />
    <g transform="translate(285 244)">{AVATAR.flatMap((row, y) => [...row].map((p, x) => PALETTE[p] ? <rect key={`${x}-${y}`} x={x * 3} y={y * 3} width="3" height="3" fill={PALETTE[p]} /> : null))}</g>
    <text x="70" y="85" fill={color} fontSize="17" fontFamily="monospace">{level === 'lab' ? '01 / BIO-TECH LAB' : '02 / CREATIVE DESIGN STUDIO'}</text><text x="70" y="111" fill="#737f97" fontSize="10" fontFamily="monospace">EXPLORE AT YOUR OWN PACE. ALL WORK IS ALWAYS OPEN.</text>
    {level === 'studio' ? <g><rect x="680" y="145" width="170" height="130" fill="#291c33" stroke={color} strokeWidth="3" /><text x="703" y="192" fill="#efbfd3" fontSize="24" fontFamily="monospace">STUDIO</text><text x="703" y="225" fill="#efbfd3" fontSize="24" fontFamily="monospace">NAVYA</text></g> : null}
  </svg>;
}

export default function ArcadeWorld() {
  const section = useRef(null), canvas = useRef(null), progress = useRef(0), foundRef = useRef([]), trigger = useRef(null);
  const [inView, setInView] = useState(false), [level, setLevel] = useState('lab'), [found, setFound] = useState([]);
  const [terminal, setTerminal] = useState(false), [output, setOutput] = useState('Type help to inspect this little universe.');
  const [message, setMessage] = useState('Scroll to move. Explore either level at any time.');
  const [sequence, setSequence] = useState(0), [secret, setSecret] = useState(false), [percent, setPercent] = useState(0);
  const { enabled, active, scrollRef } = useMotion();
  const activeRef = useRef(active), terminalRef = useRef(null), terminalToggle = useRef(null);
  useEffect(() => { activeRef.current = active; }, [active]);
  useEffect(() => { foundRef.current = found; }, [found]);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => setInView(entries[0].isIntersecting), { rootMargin: '120px' });
    observer.observe(section.current); return () => observer.disconnect();
  }, []);
  function collect(id, announce = true) {
    if (foundRef.current.includes(id)) return;
    const next = [...foundRef.current, id]; foundRef.current = next; setFound(next);
    if (announce) setMessage(`${POWERUPS.find(item => item.id === id).label} collected. ${next.length} of 4 discoveries.`);
  }
  useEffect(() => {
    if (!enabled) return;
    gsap.registerPlugin(ScrollTrigger);
    const timeline = ScrollTrigger.create({
      trigger: section.current, start: 'top top', end: 'bottom bottom',
      onUpdate: self => {
        progress.current = self.progress;
        setPercent(current => current === Math.round(self.progress * 100) ? current : Math.round(self.progress * 100));
        const next = gameState(self.progress).level; setLevel(current => current === next ? current : next);
        // Anchor navigation can skip the whole chapter. Only an active visit
        // changes realm or earns items; jumping to work is not a completed level.
        if (self.isActive) {
          POWERUPS.forEach(item => { if (self.progress >= item.at) collect(item.id); });
        }
      }
    });
    trigger.current = timeline; ScrollTrigger.refresh();
    return () => { timeline.kill(); trigger.current = null; };
  }, [enabled]);
  useEffect(() => {
    if (!enabled || !inView) return;
    const el = canvas.current, ctx = el.getContext('2d');
    if (!ctx) return;
    let frame, previous = 0, time = 0;
    const width = () => { el.width = section.current.clientWidth < 760 ? 480 : 960; el.height = 360; };
    width(); const observer = new ResizeObserver(width); observer.observe(section.current);
    function draw(now) {
      frame = requestAnimationFrame(draw);
      if (!activeRef.current || now - previous < 45) return;
      time += Math.min((now - previous) / 1000, .05); previous = now;
      const state = drawArcade(ctx, progress.current, foundRef.current, time, el.width);
      el.dataset.level = state.level; el.dataset.avatarX = Math.round(state.x); el.dataset.avatarY = Math.round(state.y); el.dataset.jump = Math.round(state.jump);
    }
    frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [enabled, inView]);
  function visit(next) {
    if (!enabled) { setLevel(next); progress.current = next === 'lab' ? .2 : .76; setPercent(next === 'lab' ? 20 : 76); return; }
    const t = next === 'lab' ? .18 : .76;
    const y = section.current.offsetTop + (section.current.offsetHeight - innerHeight) * t;
    if (scrollRef.current?.lenis) scrollRef.current.lenis.scrollTo(y); else window.scrollTo({ top: y, behavior: 'smooth' });
  }
  function project() {
    const domain = level === 'lab' ? 'tech' : 'creative', project = level === 'lab' ? 'build' : 'studio';
    dispatchEvent(new CustomEvent('portfolio:domain', { detail: { domain, project, returnId: 'arcade-project-terminal' } }));
    setMessage(level === 'lab' ? 'Build unlocked: the system behind this portfolio.' : 'Case study unlocked: Studio Navya.');
  }
  function reset() { foundRef.current = []; setFound([]); setSequence(0); setSecret(false); setOutput('Fresh inventory. Your project access stays open.'); setMessage('Inventory reset. Explore a level or click a badge to collect again.'); }
  function command(event) {
    event.preventDefault();
    const input = event.currentTarget.elements.command, value = input.value.trim().toLowerCase(); input.value = '';
    if (value === 'help') setOutput('COMMANDS: help · lab · studio · projects · achievements · contact · reset');
    else if (value === 'lab' || value === 'studio') { visit(value); setOutput(`ENTERING ${levelNames[value].toUpperCase()}.`); }
    else if (value === 'projects') { project(); setOutput('Project highlight opened. Press Escape to return to the arcade.'); }
    else if (value === 'achievements') setOutput(foundRef.current.length ? `INVENTORY: ${foundRef.current.map(id => POWERUPS.find(p => p.id === id).label).join(' · ')}${secret ? ' · Secret connector' : ''}` : 'Empty inventory. Scroll through the level or click a power-up.');
    else if (value === 'contact') { setSecret(true); setOutput('CONNECTION FOUND. A direct route to the enquiry form is now below.'); }
    else if (value === 'reset') reset();
    else setOutput(`Unknown command: ${value.slice(0, 40) || '(empty)'}. Try help.`);
  }
  function choose(word) {
    const expected = ['Observe', 'Connect', 'Create'];
    if (word !== expected[sequence]) { setSequence(0); setMessage('Start with observation, then find the connection, then create. Try again.'); return; }
    if (sequence === 2) { setSecret(true); setSequence(0); setMessage('Achievement unlocked: Secret connector. The contact portal is open.'); }
    else { setSequence(sequence + 1); setMessage(`${word} confirmed. ${2 - sequence} steps to the hidden connection.`); }
  }
  function toggleTerminal() { setTerminal(current => !current); requestAnimationFrame(() => { if (!terminal) terminalRef.current?.focus(); else terminalToggle.current?.focus(); }); }
  return <section id="arcade" ref={section} className={`arcade-section ${enabled ? 'arcade-scroll' : 'arcade-simple'} ${level === 'studio' ? 'arcade-warm' : ''}`} aria-labelledby="arcade-title">
    <div className="arcade-sticky page-gutter">
      <div className="section-meta"><span>PLAY / A DIFFERENT WAY IN</span><a href="#work">Skip to selected work <ArrowUpRight size={11} /></a></div>
      <div className="arcade-heading"><div><p className="eyebrow"><Gamepad2 size={13} /> A PLAYABLE SIDE OF CURIOSITY</p><h2 id="arcade-title">A little world.<br /><em>Plenty to discover.</em></h2></div><p>Scroll to move. Collect an idea.<br />Stop at a terminal.<br /><span>There’s more than one way to connect.</span></p></div>
      <div className="arcade-cabinet">
        <div className="arcade-hud"><span><i /> PLAYER 01 / ENGINEER × STRATEGIST</span><div><label htmlFor="discovery-energy">DISCOVERY ENERGY</label><progress id="discovery-energy" max="4" value={found.length} /><span>{found.length * 25}%</span></div><button onClick={reset} aria-label="Reset arcade discoveries"><RotateCcw size={12} /></button></div>
        <div className="arcade-screen" aria-label={`${levelNames[level]} scrolling game scene`}>
          {enabled && inView ? <canvas ref={canvas} className="arcade-canvas" aria-hidden="true" /> : <StaticLevel level={level} />}
          <span className="arcade-level-label">LEVEL {level === 'lab' ? '01' : '02'} / {levelNames[level].toUpperCase()}</span>
        </div>
        <div className="arcade-controls"><div className="arcade-level-buttons" role="group" aria-label="Choose an arcade level"><button aria-pressed={level === 'lab'} onClick={() => visit('lab')}>01 <span>Bio-Tech Lab</span></button><button aria-pressed={level === 'studio'} onClick={() => visit('studio')}>02 <span>Creative Studio</span></button></div><div><button id="arcade-project-terminal" onClick={project}><Sparkles size={13} /> {level === 'lab' ? 'Compile & inspect build' : 'Launch Studio Navya'}<ArrowUpRight size={13} /></button><button ref={terminalToggle} onClick={toggleTerminal} aria-expanded={terminal} aria-controls="arcade-terminal"><Terminal size={13} /><span>Terminal</span></button></div></div>
      </div>
      <div className="arcade-inventory"><span>POWER-UPS /</span>{POWERUPS.map(item => <button key={item.id} className={found.includes(item.id) ? 'collected' : ''} aria-pressed={found.includes(item.id)} aria-label={`${found.includes(item.id) ? 'Inspect' : 'Collect'} ${item.label} badge`} onClick={() => { if (found.includes(item.id)) setMessage(`${item.label}: an idea for your inventory, not a professional certification.`); else collect(item.id); }}><span aria-hidden="true">✦</span>{item.label}</button>)}<small>{percent.toString().padStart(2, '0')}% OF SCROLL ROUTE</small></div>
      <p className="arcade-announcement" role="status">{message}</p>
      {terminal ? <div id="arcade-terminal" className="arcade-terminal"><div><span>NG_OS / CONNECTION TERMINAL</span><button onClick={toggleTerminal} aria-label="Close arcade terminal">×</button></div><p className="terminal-output" aria-live="polite">{output}</p><form onSubmit={command}><label htmlFor="arcade-command">navya@possibility:~$</label><input ref={terminalRef} id="arcade-command" name="command" placeholder="help" autoComplete="off" spellCheck="false" maxLength={60} /><button type="submit" aria-label="Run terminal command"><ArrowRight size={15} /></button></form><div className="arcade-puzzle"><span>SECRET SEQUENCE / {sequence}/3</span>{['Create', 'Observe', 'Connect'].map(word => <button key={word} onClick={() => choose(word)}>{word}</button>)}</div></div> : null}
      {secret ? <div className="arcade-achievement"><Trophy size={16} /><span>SECRET CONNECTOR / EVERY GOOD IDEA STARTS A CONVERSATION.</span><a href="#contact">Open contact portal <ArrowRight size={13} /></a></div> : null}
      <p className="arcade-note">Energy tracks your discoveries in this level. All portfolio work is always available. {enabled ? 'Scroll or choose a level to explore.' : 'Motion is off. Use the level buttons and terminals to explore at your own pace.'}</p>
    </div>
  </section>;
}
