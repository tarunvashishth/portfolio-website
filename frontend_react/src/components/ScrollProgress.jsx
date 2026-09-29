import React, { useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { HiArrowUp } from 'react-icons/hi';

// Gradient bar across the top plus a back-to-top button whose ring fills as you scroll.
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  const [showTop, setShowTop] = useState(false);

  useMotionValueEvent(scrollYProgress, 'change', (v) => setShowTop(v > 0.08));

  return (
    <>
      <motion.div className="app__progress" style={{ scaleX: progress }} />

      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            className="app__totop"
            aria-label="Back to top"
            title="Back to top"
            onClick={() => window.scrollTo(0, 0)}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          >
            <svg viewBox="0 0 48 48" aria-hidden="true">
              <circle cx="24" cy="24" r="21" className="app__totop-track" />
              <motion.circle cx="24" cy="24" r="21" className="app__totop-ring" style={{ pathLength: progress }} />
            </svg>
            <HiArrowUp />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default ScrollProgress;
