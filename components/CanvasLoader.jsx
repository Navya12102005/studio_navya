'use client';
import { useLayoutEffect, useRef } from 'react';
import { useProgress } from '@react-three/drei';

// Suspense fallback mounted in the R3F tree. A small owned DOM overlay avoids
// nesting another React root inside a suspended canvas (Drei Html/React 19).
// It is text only: no substitute anatomy, generated meshes or image fallback.
export default function CanvasLoader() {
  const { progress } = useProgress();
  const element = useRef(null);
  useLayoutEffect(() => {
    const el = document.createElement('div');
    el.className = 'anatomy-model-loader';el.setAttribute('role','status');el.setAttribute('aria-live','polite');
    const spinner=document.createElement('i');spinner.setAttribute('aria-hidden','true');
    const label=document.createElement('span');label.textContent='LOADING ANATOMY';
    const value=document.createElement('small');value.textContent='0%';
    el.append(spinner,label,value);document.body.appendChild(el);element.current=el;
    return () => { element.current=null;el.remove(); };
  }, []);
  useLayoutEffect(() => {
    if(element.current)element.current.querySelector('small').textContent=`${Math.round(progress)}%`;
  }, [progress]);
  return null;
}
