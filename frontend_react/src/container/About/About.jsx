import React, { useState, useEffect, useRef } from 'react';
import { motion, useTransform } from 'framer-motion';

import { AppWrap, MotionWrap } from '../../wrapper';
import { SplitText } from '../../components';
import { useScrollProgress } from '../../hooks/useScrollFx';
import './About.scss';
import { urlFor, client } from '../../client';

// Cards swing in from alternating sides, spinning flat as they land.
const AboutCard = ({ about, index }) => {
  const ref = useRef(null);
  const progress = useScrollProgress(ref, ['start end', 'start 0.55']);
  const side = index % 2 ? 1 : -1;
  const x = useTransform(progress, [0, 1], [side * 320, 0]);
  const y = useTransform(progress, [0, 1], [140, 0]);
  const rotate = useTransform(progress, [0, 1], [side * 28, 0]);
  const rotateY = useTransform(progress, [0, 1], [side * -75, 0]);
  const opacity = useTransform(progress, [0, 0.5], [0, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ x, y, rotate, rotateY, opacity, transformPerspective: 900 }}
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.5, type: 'tween' }}
      className="app__profile-item scroll-fx"
    >
      <img src={urlFor(about.imgUrl).width(400).auto('format').url()} alt={about.title} loading="lazy" />
      <h2 className="bold-text" style={{ marginTop: 20 }}>{about.title}</h2>
      <p className="p-text" style={{ marginTop: 10 }}>{about.description}</p>
    </motion.div>
  );
};

const About = () => {
  const [abouts, setAbouts] = useState([]);

  useEffect(() => {
    const query = '*[_type == "abouts"]';

    client.fetch(query).then((data) => {
      setAbouts(data);
    });
  }, []);

  return (
    <>
      <SplitText className="head-text" capitalize>I Know that <span>Good Design</span> <br />means  <span>Good Business</span></SplitText>

      <div className="app__profiles">
        {abouts.map((about, index) => (
          <AboutCard about={about} index={index} key={about.title + index} />
        ))}
      </div>
    </>
  );
};

export default AppWrap(
  MotionWrap(About, 'app__about'),
  'about',
  'app__whitebg',
);
