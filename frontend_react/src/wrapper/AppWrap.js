import React, { useRef } from 'react';
import { motion, useTransform } from 'framer-motion';

import { useScrollProgress } from '../hooks/useScrollFx';

// Sections open out like a card being pulled full-screen as they scroll in.
// Drops the clip entirely once open so tooltips and shadows aren't cut off.
const toClip = (p) => (p > 0.999
  ? 'none'
  : `inset(0% ${(1 - p) * 10}% 0% ${(1 - p) * 10}% round ${(1 - p) * 140}px)`);

const AppWrap = (Component, idName, classNames = '', { reveal = true } = {}) => function HOC() {
  const ref = useRef(null);
  const progress = useScrollProgress(ref, ['start end', 'start 0.15']);
  const clipPath = useTransform(progress, toClip);

  return (
    <motion.div
      ref={ref}
      id={idName}
      className={`app__container ${classNames} ${reveal ? 'scroll-fx' : ''}`}
      style={reveal ? { clipPath } : undefined}
    >
      <div className="app__wrapper app__flex">
        <Component />

        <div className="copyright">
          <p className="p-text"></p>
          <p className="p-text"></p>
        </div>
      </div>
    </motion.div>
  );
};

export default AppWrap;
