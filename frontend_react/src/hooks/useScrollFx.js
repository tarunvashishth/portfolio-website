import { useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';

const SMOOTH = { stiffness: 170, damping: 26, restDelta: 0.001 };

// 0 → 1 as `ref` travels through `offset`, eased with a spring so scrubbed
// animations glide after the wheel instead of snapping to it.
export const useScrollProgress = (ref, offset = ['start end', 'start 0.35']) => {
  const { scrollYProgress } = useScroll({ target: ref, offset });
  return useSpring(scrollYProgress, SMOOTH);
};

// Leans content with the scroll: the faster you go, the harder it skews.
export const useVelocitySkew = (max = 6) => {
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { stiffness: 400, damping: 40 });
  return useTransform(velocity, [-2500, 0, 2500], [-max, 0, max]);
};

// Deterministic 0–1 "random" so scattered layouts don't reshuffle on re-render.
export const seeded = (seed) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};
