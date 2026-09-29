import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FiArrowDown, FiCode } from 'react-icons/fi';

import { EASE_OUT, LocalTime, Magnetic, NeuralCanvas, openCommandPalette } from '../../components';
import { PROFILE, SKILLS_QUERY, images } from '../../constants';
import { useFinePointer, useSanityQuery } from '../../hooks';
import { imageUrl, isMac } from '../../utils';
import './Header.scss';

const FALLBACK_ORBIT = [
  { name: 'JavaScript', src: images.javascript },
  { name: 'React', src: images.react },
  { name: 'CSS', src: images.css },
];

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.9, ease: EASE_OUT },
});

// Letters get lighter the closer the cursor is — the variable font "breathes".
const WeightedName = ({ lines }) => {
  const ref = useRef(null);
  const centers = useRef([]);
  const finePointer = useFinePointer();
  const reduceMotion = useReducedMotion();
  const interactive = finePointer && !reduceMotion;

  const measure = () => {
    centers.current = [...ref.current.querySelectorAll('.hero__char')].map((el) => {
      const r = el.getBoundingClientRect();
      return { el, x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
  };

  const onPointerMove = (e) => {
    if (!centers.current.length) measure();
    centers.current.forEach(({ el, x, y }) => {
      const t = Math.max(0, 1 - Math.hypot(e.clientX - x, e.clientY - y) / 280);
      el.style.fontWeight = Math.round(720 - t * 520);
    });
  };

  const onPointerLeave = () => {
    centers.current.forEach(({ el }) => {
      el.style.fontWeight = '';
    });
    centers.current = [];
  };

  let charIndex = 0;
  return (
    <h1
      ref={ref}
      className="hero__title"
      onPointerEnter={interactive ? measure : undefined}
      onPointerMove={interactive ? onPointerMove : undefined}
      onPointerLeave={interactive ? onPointerLeave : undefined}
    >
      <span className="sr-only">{lines.join(' ')}</span>
      {lines.map((line, li) => (
        <span className="hero__line" key={line} aria-hidden="true">
          {line.split('').map((char) => {
            charIndex += 1;
            return (
              <motion.span
                // eslint-disable-next-line react/no-array-index-key
                key={charIndex}
                className="hero__char"
                initial={{ y: '105%' }}
                animate={{ y: '0%' }}
                transition={{ delay: 0.2 + charIndex * 0.035, duration: 1.1, ease: EASE_OUT }}
              >
                {char}
              </motion.span>
            );
          })}
          {li === lines.length - 1 && (
            <motion.span
              className="hero__char hero__char--dot"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + charIndex * 0.035, type: 'spring', stiffness: 400, damping: 12 }}
            >
              .
            </motion.span>
          )}
        </span>
      ))}
    </h1>
  );
};

const Rotator = ({ words }) => {
  const [index, setIndex] = useState(0);
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), '');

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), 2600);
    return () => clearInterval(id);
  }, [words.length]);

  return (
    <span className="rotator" aria-hidden="true">
      <span className="rotator__sizer serif">{longest}</span>
      <AnimatePresence initial={false}>
        <motion.span
          key={index}
          className="rotator__word serif gradient-text"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

const CircularBadge = () => {
  const text = `${PROFILE.role} ✦ Based in ${PROFILE.location} ✦ `;
  return (
    <div className="hero__badge" aria-hidden="true">
      <svg viewBox="0 0 120 120" className="hero__badge-ring">
        <defs>
          <path id="hero-badge-path" d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0" />
        </defs>
        <text>
          <textPath href="#hero-badge-path" textLength="293" lengthAdjust="spacing">
            {text.toUpperCase()}
          </textPath>
        </text>
      </svg>
      <span className="hero__badge-emoji">👋</span>
    </div>
  );
};

const Portrait = () => {
  const { data: skills, loading } = useSanityQuery(SKILLS_QUERY);
  const fromCms = (skills || [])
    .filter((s) => s.icon?.asset)
    .slice(0, 6)
    .map((s) => ({ name: s.name, src: imageUrl(s.icon, 96), bg: s.bgColor }));
  const orbit = fromCms.length ? fromCms : FALLBACK_ORBIT;
  const inner = orbit.filter((_, i) => i % 2 === 0);
  const outer = orbit.filter((_, i) => i % 2 === 1);

  const ring = (items, className) => (
    <div className={`orbit ${className}`}>
      {items.map((item, i) => (
        <div className="orbit__slot" key={item.name} style={{ '--angle': `${(360 / items.length) * i + (className === 'orbit--outer' ? 40 : 0)}deg` }}>
          <div className="orbit__icon">
            <span className="orbit__bubble" title={item.name} style={item.bg ? { '--icon-bg': item.bg } : undefined}>
              <img src={item.src} alt="" loading="lazy" />
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <motion.div
      className="hero__portrait"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 1.2, ease: EASE_OUT }}
    >
      <div className="hero__halo" aria-hidden="true" />
      <div className="hero__disc" aria-hidden="true" />
      {!loading && ring(inner, 'orbit--inner')}
      {!loading && outer.length > 0 && ring(outer, 'orbit--outer')}
      <div className="hero__cutout">
        <img src={images.profile} alt={`Portrait of ${PROFILE.firstName}`} width="422" height="376" fetchpriority="high" />
      </div>
      <motion.div className="hero__chip" {...fadeUp(1.3)}>
        <span className="hero__chip-icon"><FiCode aria-hidden="true" /></span>
        <span>
          <small>Building</small>
          AI &amp; Web Apps
        </span>
      </motion.div>
      <CircularBadge />
    </motion.div>
  );
};

const Header = () => (
  <section id="home" className="hero">
    <div className="hero__bg" aria-hidden="true">
      <div className="hero__aurora">
        <span />
        <span />
        <span />
      </div>
      <div className="hero__grid" />
      <NeuralCanvas className="hero__canvas" />
    </div>

    <div className="container hero__inner">
      <div className="hero__content">
        <motion.p className="hero__status" {...fadeUp(0.1)}>
          <span className="live-dot" />
          {PROFILE.status}
        </motion.p>

        <WeightedName lines={[PROFILE.firstName, PROFILE.lastName]} />

        <motion.p className="hero__lede" {...fadeUp(0.9)}>
          <span className="sr-only">
            {`${PROFILE.role} turning ideas into ${PROFILE.rotatingWords.join(', ')}`}
          </span>
          <span aria-hidden="true">{PROFILE.role} turning ideas into </span>
          <Rotator words={PROFILE.rotatingWords} />
        </motion.p>

        <motion.div className="hero__ctas" {...fadeUp(1.05)}>
          <Magnetic>
            <a href="#work" className="btn btn--primary">
              View my work
              <FiArrowDown aria-hidden="true" />
            </a>
          </Magnetic>
          <Magnetic>
            <a href="#contact" className="btn btn--ghost">Let&apos;s talk</a>
          </Magnetic>
        </motion.div>

        <motion.button type="button" className="hero__hint" onClick={openCommandPalette} {...fadeUp(1.2)}>
          or press
          <kbd>{isMac() ? '⌘' : 'Ctrl'}</kbd>
          <kbd>K</kbd>
          to jump anywhere
        </motion.button>
      </div>

      <div className="hero__visual">
        <Portrait />
      </div>
    </div>

    <motion.div className="container hero__footer" {...fadeUp(1.4)}>
      <a href="#about" className="hero__scroll">
        <span className="hero__mouse" aria-hidden="true" />
        <span className="mono">Scroll to explore</span>
      </a>
      <p className="hero__time mono">
        <span>{PROFILE.location}</span>
        <LocalTime />
        <span>{PROFILE.timeZoneLabel}</span>
      </p>
    </motion.div>
  </section>
);

export default Header;
