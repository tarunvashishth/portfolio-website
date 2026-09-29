import React, { useRef } from 'react';
import { motion, useSpring } from 'framer-motion';

const SPRING = { stiffness: 220, damping: 16, mass: 0.4 };

// Pulls its child toward the cursor while hovered (mouse only).
const Magnetic = ({ children, strength = 0.3, className = '' }) => {
  const ref = useRef(null);
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);

  const onPointerMove = (e) => {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`magnetic ${className}`}
      style={{ x, y, display: 'inline-flex' }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  );
};

export default Magnetic;
