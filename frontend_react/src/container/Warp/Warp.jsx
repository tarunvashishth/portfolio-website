import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

import { WARP_WORDS } from '../../constants';
import { seeded } from '../../hooks/useScrollFx';
import './Warp.scss';

const RINGS = 9;
const STARS = 36;
const SCREENS_PER_WORD = 0.8;

// Rings rush toward the viewer and loop back, staggered, so they read as a tunnel.
const Ring = ({ progress, index }) => {
  const t = useTransform(progress, (p) => (p * 4 + index / RINGS) % 1);
  const scale = useTransform(t, (v) => 0.03 * 2 ** (v * 9));
  const opacity = useTransform(t, (v) => Math.min(v * 5, 1) * (1 - v));

  return <motion.span className="app__warp-ring" style={{ scale, opacity }} />;
};

// Streaks fly out from the centre, stretching as they speed up: warp speed.
// The outer span points along the streak's direction, so the inner one only has
// to move and stretch along its own x axis.
const Star = ({ progress, index }) => {
  const angle = seeded(index) * 360;
  const speed = 2 + seeded(index + 50) * 4;
  const phase = seeded(index + 100);

  const t = useTransform(progress, (p) => (p * speed + phase) % 1);
  const x = useTransform(t, (v) => `${0.6 * 2 ** (v * 7.2)}vmax`);
  const scaleX = useTransform(t, (v) => 1 + v * 14);
  const opacity = useTransform(t, (v) => Math.min(v * 6, 1) * (1 - v * v));

  return (
    <span className="app__warp-star" style={{ transform: `rotate(${angle}deg)` }}>
      <motion.span style={{ x, scaleX, opacity }} />
    </span>
  );
};

// Each word gets its own slice of the scroll: it zooms in, holds, then flies past the camera.
const Word = ({ progress, index, count, children }) => {
  const at = (f) => (index + f) / count;
  const first = index === 0;
  const last = index === count - 1;

  const scale = useTransform(
    progress,
    [at(0), at(0.35), at(0.65), at(1)],
    [first ? 1 : 0.2, 1, 1.15, last ? 1.3 : 10],
  );
  const opacity = useTransform(
    progress,
    [at(0), at(0.3), at(0.7), at(0.95)],
    [first ? 1 : 0, 1, 1, last ? 1 : 0],
  );
  const rotate = useTransform(progress, [at(0), at(0.35)], [first ? 0 : (index % 2 ? 25 : -25), 0]);
  const letterSpacing = useTransform(progress, [at(0), at(0.35)], [first ? '-0.03em' : '0.4em', '-0.03em']);

  return (
    <div className="app__warp-word">
      <motion.p style={{ scale, opacity, rotate, letterSpacing }}>{children}</motion.p>
    </div>
  );
};

const Warp = () => {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.0005 });
  const backgroundColor = useTransform(
    progress,
    [0, 0.35, 0.7, 1],
    ['#313bac', '#6d28d9', '#be185d', '#0b1030'],
  );
  const hintOpacity = useTransform(progress, [0, 0.06], [1, 0]);

  if (reduceMotion) {
    return (
      <section ref={ref} className="app__warp app__warp--static">
        <p>{WARP_WORDS.join(' ')}</p>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className="app__warp"
      style={{ height: `${100 + WARP_WORDS.length * SCREENS_PER_WORD * 100}vh` }}
    >
      <motion.div className="app__warp-sticky" style={{ backgroundColor }}>
        <div className="app__warp-space" aria-hidden="true">
          {Array.from({ length: RINGS }, (_, i) => <Ring key={`ring-${i}`} progress={progress} index={i} />)}
          {Array.from({ length: STARS }, (_, i) => <Star key={`star-${i}`} progress={progress} index={i} />)}
        </div>

        {WARP_WORDS.map((word, i) => (
          <Word key={word} progress={progress} index={i} count={WARP_WORDS.length}>{word}</Word>
        ))}

        <motion.p className="app__warp-hint" style={{ opacity: hintOpacity }} aria-hidden="true">
          keep scrolling
        </motion.p>
        <motion.div className="app__warp-bar" style={{ scaleX: progress }} />
      </motion.div>
    </section>
  );
};

export default Warp;
