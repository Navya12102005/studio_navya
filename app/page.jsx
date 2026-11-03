import { ArrowUpRight, ArrowDown, Orbit, Fingerprint } from '../components/Icons';
import CadInspection from '../components/CadInspection';
import TechnicalTelemetry from '../components/TechnicalTelemetry';
import Journey from '../components/Journey';
import EditorialMotion from '../components/EditorialMotion';
import Domains from '../components/Domains';
import { SpatialQuote } from '../components/SpatialEditorial';
import { Magnetic } from '../components/Interactions';
import { Contact, Footer, Header } from '../components/SiteChrome';
import VoxelTechHud from '../components/VoxelTechHud';

export default function Home() {
  return <><Header /><VoxelTechHud/><main><EditorialMotion/>
    <Journey /><TechnicalTelemetry/><CadInspection/>
    <div className="manifesto page-gutter"><p className="eyebrow">CONNECTED DISCIPLINES</p><SpatialQuote>I believe the most interesting things happen between disciplines.</SpatialQuote><div><span>THE ANALYTICAL MIND.</span><i /><span>THE CREATIVE INSTINCT.</span></div></div>
    <Domains />
    <section id="about" className="about-section page-gutter"><div className="section-meta"><span>02  |  BEHIND THE CONNECTIONS</span><span>ABOUT NAVYA</span></div><div className="about-grid"><div className="about-art"><div className="about-orbit" /><img src="/art/heart.webp" alt="" width="1024" height="1536" loading="lazy" /><p>BUILT ON CURIOSITY.<br /><span>DRIVEN BY SOMETHING MORE.</span></p><span className="art-coordinate">FIG. 02 / CREATIVE INSTINCT</span></div><div className="about-copy"><p className="eyebrow">NAVYA GUPTA / VIT BHOPAL</p><h2>Equal parts<br /><em>method & magic.</em></h2><p className="about-lead">A bioengineering student with an analytical mind and a decidedly creative heart.</p><p>I’m drawn to the questions that don’t fit neatly into one discipline. How can a system be clearer? A story more human? An idea more useful?</p><p>From research and computational workflows to leading communities, shaping content and building Studio Navya, I bring the same approach: look closely, connect the dots, and make something with intent.</p><div className="about-roles"><div><Fingerprint size={19} strokeWidth={1.1} /><span>BIOENGINEERING</span><small>VIT Bhopal · Third year</small></div><div><Orbit size={19} strokeWidth={1.1} /><span>COMMUNITY & LEADERSHIP</span><small>Startup Club President · AWS Student Builder operations</small></div></div><Magnetic><a href="#contact" className="text-cta">A connection worth making <ArrowUpRight size={16} /></a></Magnetic></div></div></section>
    <Contact />
  </main><Footer /></>;
}
