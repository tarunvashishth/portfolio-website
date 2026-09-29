import React from 'react';
import { motion } from 'framer-motion';

export const EASE_OUT = [0.22, 1, 0.36, 1];

// Spread onto any motion.* element for the standard scroll reveal.
export const revealProps = (delay = 0, y = 32) => ({
  initial: { opacity: 0, y },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -12% 0px' },
  transition: { duration: 0.8, delay, ease: EASE_OUT },
});

// Fades + lifts its children in the first time they scroll into view.
const Reveal = ({ as = 'div', children, delay = 0, y = 32, className, ...rest }) => {
  const Component = motion[as];
  return (
    <Component className={className} {...revealProps(delay, y)} {...rest}>
      {children}
    </Component>
  );
};

export default Reveal;
