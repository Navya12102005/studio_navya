import Link from 'next/link';
import { ArrowUpRight } from '../components/Icons';
export default function NotFound() {
  return <main className="not-found page-gutter"><span className="eyebrow">404 / AN UNEXPECTED CONNECTION</span><h1>A little<br /><em>off course.</em></h1><p>There’s plenty to explore. This page just isn’t part of it.</p><Link href="/" className="text-cta">Back to possibility <ArrowUpRight size={16} /></Link></main>;
}
