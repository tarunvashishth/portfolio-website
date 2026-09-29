import React, { useRef } from 'react';
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from 'framer-motion';

import './Marquee.scss';

const COPIES = 4;

// A strip of text that drifts on its own, then speeds up, shears and flips
// direction to follow the scroll wheel.
const Row = ({ text, baseVelocity }) => {
  const ref = useRef(null);
  const inView = useInView(ref);
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(velocity, [0, 1000], [0, 5], { clamp: false });
  const skewX = useTransform(velocity, [-3000, 0, 3000], [30, 0, -30]);
  // one copy is 1/COPIES of the track, so wrapping by that much loops seamlessly
  const x = useTransform(baseX, (v) => `${wrap(-100 / COPIES, 0, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (!inView) return;
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;

    let moveBy = direction.current * baseVelocity * (delta / 1000);
    moveBy += direction.current * moveBy * factor;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="app__marquee-row" ref={ref}>
      <motion.div className="app__marquee-track scroll-fx" style={{ x, skewX }}>
        {Array.from({ length: COPIES }, (_, i) => <span key={i}>{text}</span>)}
      </motion.div>
    </div>
  );
};

// Two bands crossed in an X that swing the other way as the page scrolls past.
const Marquee = ({ top, bottom }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rotateTop = useTransform(scrollYProgress, [0, 1], [-9, 3]);
  const rotateBottom = useTransform(scrollYProgress, [0, 1], [8, -4]);

  return (
    <div className="app__marquee" ref={ref} aria-hidden="true">
      <motion.div className="app__marquee-band app__marquee-band--dark scroll-fx" style={{ rotate: rotateTop }}>
        <Row text={top} baseVelocity={-4} />
      </motion.div>
      <motion.div className="app__marquee-band app__marquee-band--light scroll-fx" style={{ rotate: rotateBottom }}>
        <Row text={bottom} baseVelocity={4} />
      </motion.div>
    </div>
  );
};

export default Marquee;
