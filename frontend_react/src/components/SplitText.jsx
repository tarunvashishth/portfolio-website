import React, { Children, cloneElement, isValidElement } from 'react';
import { motion } from 'framer-motion';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.03 } },
};

const letter = {
  hidden: { y: '120%', rotateX: -110, rotate: 18, scale: 0.4, opacity: 0 },
  visible: {
    y: '0%',
    rotateX: 0,
    rotate: 0,
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', damping: 11, stiffness: 170 },
  },
};

const textOf = (children) => Children.toArray(children).map((child) => {
  if (typeof child === 'string' || typeof child === 'number') return child;
  if (!isValidElement(child)) return '';
  return child.type === 'br' ? ' ' : textOf(child.props.children);
}).join('');

// Each letter is its own inline-block, which makes CSS `capitalize` upper-case
// every letter — so capitalise word starts here instead.
const splitWord = (word, key, capitalize) => (
  <span className="split-word" key={key}>
    {[...(capitalize ? word[0].toUpperCase() + word.slice(1) : word)].map((char, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <motion.span className="split-char" variants={letter} key={i}>{char}</motion.span>
    ))}
  </span>
);

const split = (children, prefix, capitalize) => Children.toArray(children).flatMap((child, i) => {
  const key = `${prefix}-${i}`;
  if (typeof child === 'string') {
    return child.split(/(\s+)/).filter(Boolean).map((part, j) => (
      /^\s+$/.test(part) ? ' ' : splitWord(part, `${key}-${j}`, capitalize)
    ));
  }
  if (isValidElement(child) && child.props.children) {
    return cloneElement(child, { key }, split(child.props.children, key, capitalize));
  }
  return child;
});

// Heading whose letters flip up into place one after another every time it scrolls into view.
// Nested elements (accent <span>s, <br />) are kept; screen readers get the plain text.
const SplitText = ({ as = 'h2', className = '', capitalize = false, children }) => {
  const Tag = motion[as];

  return (
    <Tag
      className={`${className} split-text ${capitalize ? 'split-text--capitalize' : ''}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.5 }}
    >
      <span className="sr-only">{textOf(children).replace(/\s+/g, ' ').trim()}</span>
      <span className="split-line" aria-hidden="true">{split(children, 's', capitalize)}</span>
    </Tag>
  );
};

export default SplitText;
