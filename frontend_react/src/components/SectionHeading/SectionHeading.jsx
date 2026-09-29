import React from 'react';
import { motion } from 'framer-motion';

import ScrambleText from '../ScrambleText';
import { EASE_OUT } from '../Reveal';
import './SectionHeading.scss';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const word = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: 0.9, ease: EASE_OUT } },
};

// "I know that *good design* means *good business.*" — segments wrapped in
// asterisks render in the italic serif accent face.
export const parseEmphasis = (text) => text.split('*').map((segment, i) => ({ text: segment, em: i % 2 === 1 }));

export const RevealTitle = ({ as = 'h2', text, className = '' }) => {
  const Component = motion[as];
  const segments = parseEmphasis(text);

  return (
    <Component
      className={`reveal-title ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      variants={container}
    >
      <span className="sr-only">{text.replace(/\*/g, '')}</span>
      {segments.flatMap(({ text: segment, em }, s) => segment
        .split(' ')
        .filter(Boolean)
        .map((w, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <span className="reveal-title__mask" aria-hidden="true" key={`${s}-${i}`}>
            <motion.span className={`reveal-title__word ${em ? 'serif gradient-text' : ''}`} variants={word}>
              {w}
            </motion.span>
          </span>
        )))}
    </Component>
  );
};

const SectionHeading = ({ index, label, title, children }) => (
  <header className="section-heading">
    <div className="section-heading__main">
      <p className="section-heading__label mono">
        <span className="section-heading__index">{index}</span>
        <span className="section-heading__rule" />
        <ScrambleText text={label} />
      </p>
      <RevealTitle text={title} />
    </div>
    {children && <div className="section-heading__aside">{children}</div>}
  </header>
);

export default SectionHeading;
