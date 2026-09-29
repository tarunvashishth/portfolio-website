import React, { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01';

// "Decodes" text from random glyphs the first time it scrolls into view.
const ScrambleText = ({ text, className, duration = 900 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduceMotion = useReducedMotion();
  const [output, setOutput] = useState(text);

  useEffect(() => {
    if (!inView || reduceMotion) {
      setOutput(text);
      return undefined;
    }
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const revealed = Math.floor(progress * text.length);
      setOutput(
        text
          .split('')
          .map((char, i) => {
            if (i < revealed || char === ' ') return char;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join(''),
      );
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduceMotion, text, duration]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{output}</span>
    </span>
  );
};

export default ScrambleText;
