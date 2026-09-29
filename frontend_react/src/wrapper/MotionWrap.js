import React, { useRef } from 'react';
import { motion, useTransform } from 'framer-motion';

import { useScrollProgress, useVelocitySkew } from '../hooks/useScrollFx';

// Section content tilts up off the floor as it scrolls in, then leans with the scroll speed.
const MotionWrap = (Component, classNames = '', { offset } = {}) => function HOC() {
  const ref = useRef(null);
  const progress = useScrollProgress(ref, offset);
  const y = useTransform(progress, [0, 1], [160, 0]);
  const scale = useTransform(progress, [0, 1], [0.82, 1]);
  const rotateX = useTransform(progress, [0, 1], [38, 0]);
  const opacity = useTransform(progress, [0, 0.7], [0, 1]);
  const skewY = useVelocitySkew();

  return (
    <motion.div
      ref={ref}
      style={{ y, scale, rotateX, opacity, skewY, transformPerspective: 1200, originY: 0 }}
      className={`${classNames} app__flex scroll-fx`}
    >
      <Component />
    </motion.div>
  );
};

export default MotionWrap;
