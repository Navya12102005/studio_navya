'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowDown, Asterisk, Pause, Play, Check, Copy, Mail, MoveUpRight } from 'lucide-react';
import { useMotion } from './MotionProvider';
import { Magnetic } from './Interactions';

export function Header() {
  const { reduced, paused, setPaused } = useMotion();
  return <><a className="skip-link" href="#work">Skip to portfolio</a><header className="site-header page-gutter">
    <a href="#home" className="brand" aria-label="Navya Gupta — home"><Asterisk size={31} strokeWidth={1.2} /><span>navya<em>gupta.</em></span></a>
    <nav aria-label="Main navigation"><a href="#work">Selected work <span>01</span></a><a href="#arcade">Arcade <span>PLAY</span></a><a href="#about">The person <span>02</span></a><Magnetic><a href="#contact" className="nav-contact">Let’s connect <ArrowUpRight size={14} /></a></Magnetic></nav>
    <button className="motion-switch" aria-label={reduced ? 'System reduced motion enabled' : paused ? 'Resume visual effects' : 'Pause visual effects'} title={reduced ? 'System reduced motion enabled' : paused ? 'Resume visual effects' : 'Pause visual effects'} disabled={reduced} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused || reduced ? <Play size={13} /> : <Pause size={13} />}<span>{reduced ? 'Reduced motion' : paused ? 'Motion off' : 'Motion on'}</span></button>
  </header></>;
}

export function Contact() {
  const [draft, setDraft] = useState(null), [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const result = useRef(null);
  useEffect(() => { if (draft) result.current?.focus(); }, [draft]);
  function prepare(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get('website')) return;
    const subject = `${data.get('interest')} — ${String(data.get('name')).trim()}`;
    const body = `Hi Navya,\n\n${String(data.get('message')).trim()}\n\n${String(data.get('name')).trim()}\n${String(data.get('email')).trim()}`;
    setDraft({ subject, body }); setCopied(false); setCopyError(false);
  }
  async function copy() {
    try { await navigator.clipboard.writeText(`To: hello@studionavya.com\nSubject: ${draft.subject}\n\n${draft.body}`); setCopied(true); }
    catch { setCopyError(true); }
  }
  return <section id="contact" className="contact-section page-gutter"><div className="section-meta"><span>03 — THE NEXT CONNECTION</span><span>GOOD THINGS START WITH A CONVERSATION.</span></div><div className="contact-heading"><span className="contact-asterisk" aria-hidden="true">✳</span><p className="eyebrow"><span className="status-dot" /> OPEN TO OPPORTUNITIES & COLLABORATIONS</p><h2>What could we<br /><em>make possible?</em></h2><Magnetic><a className="contact-email" href="mailto:hello@studionavya.com">hello@studionavya.com <ArrowUpRight strokeWidth={1} /></a></Magnetic></div>
    <div className="contact-bottom"><div><span className="eyebrow">A THOUGHT. A BRIEF. A NEW DIRECTION.</span><p>Research, a creative collaboration,<br />a role, or something in between.</p><p className="contact-honesty">Your message stays on this page until you<br />choose to open it in your email app.</p></div><form className="enquiry-form" onSubmit={prepare} onInput={() => { setDraft(null); setCopied(false); }}>
      <div className="form-row"><label>Your name<input name="name" autoComplete="name" placeholder="How should I call you?" required maxLength={100} /></label><label>Your email<input name="email" autoComplete="email" placeholder="you@company.com" type="email" required maxLength={254} /></label></div>
      <label>I’m thinking about<select name="interest" defaultValue="A creative collaboration"><option>A creative collaboration</option><option>A tech or research opportunity</option><option>A role or internship</option><option>Something else entirely</option></select></label>
      <label>A little context<textarea name="message" placeholder="The idea, the opportunity, the possibility…" rows={2} required minLength={10} maxLength={5000} /></label>
      <label className="honeypot" aria-hidden="true">Leave this empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <div className="form-submit"><span>NO FORMS INTO THE VOID.<br />JUST A REAL CONVERSATION.</span><Magnetic><button className="pill-button" type="submit">Prepare an email <ArrowUpRight size={16} /></button></Magnetic></div>
    </form></div>
    {draft ? <div className="email-preview" tabIndex={-1} ref={result}><p className="eyebrow">YOUR EMAIL IS READY — NOT SENT</p><h3>{draft.subject}</h3><pre>{draft.body}</pre><div><a className="pill-button" href={`mailto:hello@studionavya.com?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`}><Mail size={15} /> Open email app</a><button className="text-cta" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copied' : 'Copy message'}</button></div><p role="status">{copyError ? 'Copy is unavailable. Select the message above and copy it manually.' : copied ? 'Message copied. Paste it in your email app when you’re ready.' : 'Review your message before opening or copying it.'}</p></div> : null}
  </section>;
}

export function Footer() {
  return <footer className="site-footer page-gutter"><a href="#home" className="brand"><Asterisk size={24} strokeWidth={1} /><span>navya<em>gupta.</em></span></a><p>SCIENCE IN MY THINKING. HEART IN MY WORK.</p><a href="#home">Back to the beginning <ArrowUpRight size={15} /></a><span>© {new Date().getFullYear()} NAVYA GUPTA</span><small className="model-credit">Anatomy: <a href="/models/README.md">BodyParts3D</a>, © The Database Center for Life Science. <a href="https://creativecommons.org/licenses/by-sa/2.1/jp/">CC BY-SA 2.1 Japan</a>. Adapted for this upper-body GLB.</small></footer>;
}
