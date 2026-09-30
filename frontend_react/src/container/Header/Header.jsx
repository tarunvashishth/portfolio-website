import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

import { AppWrap } from '../../wrapper';
import { images } from '../../constants';
import { SplitText } from '../../components';
import './Header.scss';

const scaleVariants = {
  whileInView: {
    scale: [0, 1],
    opacity: [0, 1],
    transition: {
      duration: 1,
      ease: 'easeInOut',
    },
  },
};

// where each tech bubble gets flung as the hero scrolls away: [x, y, rotate]
const BUBBLES = [
  { src: images.javascript, exit: [-560, -260, -420] },
  { src: images.react, exit: [520, -380, 540] },
  { src: images.css, exit: [300, 460, -720] },
];

const Bubble = ({ src, exit: [x, y, rotate], progress }) => {
  const bubbleX = useTransform(progress, [0, 1], [0, x]);
  const bubbleY = useTransform(progress, [0, 1], [0, y]);
  const bubbleRotate = useTransform(progress, [0, 1], [0, rotate]);
  const bubbleScale = useTransform(progress, [0, 1], [1, 1.8]);

  return (
    <motion.div
      className="circle-cmp app__flex scroll-fx"
      style={{ x: bubbleX, y: bubbleY, rotate: bubbleRotate, scale: bubbleScale }}
    >
      <img src={src} alt="" />
    </motion.div>
  );
};

const Header = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 });

  const infoX = useTransform(progress, [0, 1], [0, -480]);
  const infoRotate = useTransform(progress, [0, 1], [0, -18]);
  const infoOpacity = useTransform(progress, [0, 0.75], [1, 0]);
  const photoY = useTransform(progress, [0, 1], [0, 260]);
  const photoScale = useTransform(progress, [0, 1], [1, 1.4]);
  const ringRotate = useTransform(progress, [0, 1], [0, 220]);
  const bgX = useTransform(progress, [0, 1], ['0%', '-40%']);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);

  return (
    <div className="app__header app__flex" ref={ref}>
      <motion.div className="app__header-bgtext scroll-fx" style={{ x: bgX }} aria-hidden="true">
        AI Engineer — AI Engineer —
      </motion.div>

      <motion.div
        className="app__header-info scroll-fx"
        style={{ x: infoX, rotate: infoRotate, opacity: infoOpacity }}
      >
        <motion.div
          whileInView={{ x: [-100, 0], opacity: [0, 1] }}
          transition={{ duration: 0.5 }}
          className="app__header-badge"
        >
          <div className="badge-cmp app__flex">
            <span className="app__header-wave" role="img" aria-label="wave">👋</span>
            <div style={{ marginLeft: 20 }}>
              <p className="p-text">Hello, I am</p>
              <SplitText as="h1" className="head-text" capitalize>Tarun</SplitText>
            </div>
          </div>

          <div className="tag-cmp app__flex">
            <p className="p-text">Full Stack AI Engineer</p>
            <p className="p-text">LLM · RAG · Agents</p>
            {/* <p className="p-text">Freelancer</p> */}
          </div>

          <div className="app__header-cta">
            <a href="#work" className="p-text app__header-btn">See my work</a>
            <a href="#contact" className="p-text app__header-btn app__header-btn--light">Say hello</a>
          </div>

          <motion.div className="app__header-scroll" style={{ opacity: cueOpacity }} aria-hidden="true">
            <div className="app__header-mouse" />
            <p className="p-text">scroll</p>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        whileInView={{ opacity: [0, 1] }}
        transition={{ duration: 0.5, delayChildren: 0.5 }}
        className="app__header-img scroll-fx"
        style={{ y: photoY, scale: photoScale }}
      >
        <img src={images.profile} alt="Tarun" />
        <motion.img
          whileInView={{ scale: [0, 1] }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          style={{ rotate: ringRotate }}
          src={images.circle}
          alt=""
          className="overlay_circle scroll-fx"
        />
      </motion.div>

      <motion.div
        variants={scaleVariants}
        whileInView={scaleVariants.whileInView}
        className="app__header-circles"
      >
        {BUBBLES.map(({ src, exit }) => (
          <Bubble key={src} src={src} exit={exit} progress={progress} />
        ))}
      </motion.div>
    </div>
  );
};

export default AppWrap(Header, 'home', '', { reveal: false });
