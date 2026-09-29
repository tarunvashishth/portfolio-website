import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

import { useFinePointer } from '../../hooks';
import './Cursor.scss';

const INTERACTIVE = 'a, button, input, textarea, label, [role="button"], [data-cursor]';

// A soft ring that trails the native cursor, grows over interactive elements
// and shows a label over anything with data-cursor-label. Mouse only.
const CursorFollower = () => {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 32, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 350, damping: 32, mass: 0.6 });
  const [mode, setMode] = useState({ hover: false, label: '' });
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const modeRef = useRef(mode);

  useEffect(() => {
    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const onOver = (e) => {
      const target = e.target instanceof Element ? e.target : null;
      const label = target?.closest('[data-cursor-label]')?.getAttribute('data-cursor-label') || '';
      const hover = Boolean(target?.closest(INTERACTIVE));
      if (modeRef.current.hover !== hover || modeRef.current.label !== label) {
        modeRef.current = { hover, label };
        setMode(modeRef.current);
      }
    };
    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, [x, y]);

  const className = [
    'cursor-ring',
    visible && 'is-visible',
    mode.hover && 'is-hover',
    mode.label && 'has-label',
    pressed && 'is-pressed',
  ].filter(Boolean).join(' ');

  return (
    <>
      <motion.div className={`cursor-dot ${visible ? 'is-visible' : ''}`} style={{ x, y }} aria-hidden="true" />
      <motion.div className={className} style={{ x: ringX, y: ringY }} aria-hidden="true">
        <span className="cursor-ring__label">{mode.label}</span>
      </motion.div>
    </>
  );
};

const Cursor = () => {
  const finePointer = useFinePointer();
  const reduceMotion = useReducedMotion();
  if (!finePointer || reduceMotion) return null;
  return <CursorFollower />;
};

export default Cursor;
