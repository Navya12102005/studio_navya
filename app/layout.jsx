import './globals.css';
import './spatial.css';
import './restraint.css';
import './clean.css';
import './technical.css';
import './inspection.css';
import './comic.css';
import localFont from 'next/font/local';
import { MotionProvider } from '../components/MotionProvider';

const mono = localFont({ src: './fonts/JetBrainsMono.ttf', variable: '--font-jetbrains', display: 'swap' });
const syne = localFont({ src: './fonts/Syne.ttf', variable: '--font-syne', display: 'swap' });
const jakarta = localFont({ src: './fonts/PlusJakartaSans.ttf', variable: '--font-jakarta', display: 'swap' });

export const metadata = {
  title: 'Navya Gupta  |  The science of possibility',
  description: 'Bioengineering meets creative instinct. The portfolio of Navya Gupta  |  technology, research, creative strategy, marketing and PR.',
  icons: { icon: '/icon.svg' },
  openGraph: { title: 'Navya Gupta  |  The science of possibility', description: 'One curious mind. Two connected worlds.', type: 'website' }
};
export const viewport = { themeColor: '#030305' };

export default function RootLayout({ children }) {
  return <html lang="en"><body className={`${mono.variable} ${syne.variable} ${jakarta.variable}`}><MotionProvider>{children}</MotionProvider></body></html>;
}
