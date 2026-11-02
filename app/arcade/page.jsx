import ArcadeWorld from '../../components/ArcadeWorld';
import Domains from '../../components/Domains';
import {Contact,Footer} from '../../components/SiteChrome';
export const metadata={title:'Interactive demo | Navya Gupta'};
export default function ArcadeDemo(){return <><nav className="page-gutter" style={{paddingBlock:24,position:'relative',zIndex:20}}><a href="/">Back to portfolio</a></nav><main id="home"><ArcadeWorld/><Domains/><Contact/></main><Footer/></>;}
