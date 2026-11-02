import './globals.css';
import { MotionProvider } from '../components/MotionProvider';

export const metadata = {
  title: 'Navya Gupta — The science of possibility',
  description: 'Bioengineering meets creative instinct. The portfolio of Navya Gupta — technology, research, creative strategy, marketing and PR.',
  icons: { icon: '/icon.svg' },
  openGraph: { title: 'Navya Gupta — The science of possibility', description: 'One curious mind. Two connected worlds.', type: 'website' }
};
export const viewport = { themeColor: '#030305' };

export default function RootLayout({ children }) {
  return <html lang="en"><body><MotionProvider>{children}</MotionProvider></body></html>;
}
