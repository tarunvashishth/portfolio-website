import React, { useRef } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';

import { useSanityQuery } from '../../hooks';
import { SKILLS_QUERY } from '../../constants';
import './Marquee.scss';

const FALLBACK = ['AI Apps', 'Web Apps', 'APIs', 'Interfaces', 'Good Design', 'Good Business'];
const PROCESS = ['Think', 'Design', 'Build', 'Ship', 'Learn', 'Repeat'];

const wrap = (min, max, v) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

// A row that drifts on its own and speeds up / flips with scroll velocity.
const VelocityRow = ({ items, baseVelocity, outline = false }) => {
  const reduceMotion = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });
  const direction = useRef(1);
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduceMotion) return;
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;
    moveBy += direction.current * moveBy * factor;
    baseX.set(baseX.get() + moveBy);
  });

  // Enough copies that half the track is always wider than the viewport.
  const sequence = Array.from({ length: Math.max(2, Math.ceil(12 / items.length)) }, () => items).flat();

  return (
    <div className={`marquee__row ${outline ? 'marquee__row--outline' : ''}`}>
      <motion.div className="marquee__track" style={{ x }}>
        {[0, 1].map((copy) => (
          <div className="marquee__group" key={copy} aria-hidden={copy === 1 ? 'true' : undefined}>
            {sequence.map((item, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <span className="marquee__item" key={`${item}-${i}`}>
                {item}
                <span className="marquee__star" aria-hidden="true">✦</span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const Marquee = () => {
  const { data: skills } = useSanityQuery(SKILLS_QUERY);
  const names = skills?.map((s) => s.name).filter(Boolean);

  return (
    <section className="marquee" aria-label="What I work with">
      <div className="marquee__band">
        <VelocityRow items={names?.length ? names : FALLBACK} baseVelocity={-2.2} />
      </div>
      <div className="marquee__band marquee__band--alt" aria-hidden="true">
        <VelocityRow items={PROCESS} baseVelocity={1.6} outline />
      </div>
    </section>
  );
};

export default Marquee;
