// Small original action symbols. No external icon library or decorative marks.
const paths={
 ArrowUpRight:'M6 18 18 6M6 6h12v12',ArrowRight:'M4 12h16m-6-6 6 6-6 6',ArrowLeft:'M20 12H4m6-6-6 6 6 6',ArrowDown:'M12 4v16m-6-6 6 6 6-6',
 Pause:'M8 5v14M16 5v14',Play:'m8 5 11 7-11 7Z',X:'m6 6 12 12M18 6 6 18',Check:'m5 12 5 5 9-11',Copy:'M8 4h12v13H8ZM4 8v13h12',Mail:'M3 5h18v14H3Zm0 0 9 8 9-8',BookOpen:'M12 6v15M3 4h5l4 2 4-2h5v15h-5l-4 2-4-2H3Z',
 Brain:'M9 4H6v4H4v8h2v4h3M15 4h3v4h2v8h-2v4h-3M9 8l6 8m0-8-6 8',Studio:'m5 18 1-5L17 2l5 5L11 18l-6 1ZM14 5l5 5M3 22h18',Terminal:'m4 6 5 6-5 6m8 0h8',RotateCcw:'M4 10a8 8 0 1 1 1 8M4 4v6h6',Volume2:'M3 9h4l5-4v14l-5-4H3Zm13-1a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14',VolumeX:'M3 9h4l5-4v14l-5-4H3Zm13-1 5 8m0-8-5 8'
};
const icon=name=>function ActionIcon({size=20,strokeWidth=1.5,...props}){const d=paths[name];return d?<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true" {...props}><path d={d}/></svg>:null;};
export const ArrowUpRight=icon('ArrowUpRight'),ArrowRight=icon('ArrowRight'),ArrowLeft=icon('ArrowLeft'),ArrowDown=icon('ArrowDown'),MoveDown=ArrowDown,MoveUpRight=ArrowUpRight;
export const Pause=icon('Pause'),Play=icon('Play'),X=icon('X'),Check=icon('Check'),Copy=icon('Copy'),Mail=icon('Mail'),BookOpen=icon('BookOpen'),Brain=icon('Brain'),Studio=icon('Studio'),Terminal=icon('Terminal'),RotateCcw=icon('RotateCcw'),Volume2=icon('Volume2'),VolumeX=icon('VolumeX');
export const Asterisk=icon('none'),Orbit=icon('none'),Fingerprint=icon('Brain'),Atom=icon('none'),Layers3=icon('none'),Cpu=icon('none'),Trophy=icon('none'),Gamepad2=icon('none');
