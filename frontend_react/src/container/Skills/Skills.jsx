import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Tooltip } from 'react-tooltip';

import { AppWrap, MotionWrap } from '../../wrapper';
import { SplitText } from '../../components';
import { seeded, useScrollProgress } from '../../hooks/useScrollFx';
import { urlFor, client } from '../../client';
import './Skills.scss';

// Icons start scattered and spinning all over the place, then snap into the grid.
const SkillBubble = ({ skill, index, progress }) => {
  const spread = (n) => seeded(index * 7 + n) * 2 - 1;
  const x = useTransform(progress, [0, 1], [spread(1) * 520, 0]);
  const y = useTransform(progress, [0, 1], [spread(2) * 360 + 180, 0]);
  const rotate = useTransform(progress, [0, 1], [spread(3) * 540, 0]);
  const scale = useTransform(progress, [0, 1], [0, 1]);
  const opacity = useTransform(progress, [0, 0.35], [0, 1]);

  return (
    <motion.div
      style={{ x, y, rotate, scale, opacity }}
      className="app__skills-item app__flex scroll-fx"
    >
      <div
        className="app__flex"
        style={{ backgroundColor: skill.bgColor }}
      >
        <img src={urlFor(skill.icon).width(120).auto('format').url()} alt="" loading="lazy" />
      </div>
      <p className="p-text">{skill.name}</p>
    </motion.div>
  );
};

// Each year slams in from the right, sheared, with its label shrinking down from huge.
const ExperienceItem = ({ experience }) => {
  const ref = useRef(null);
  const progress = useScrollProgress(ref, ['start end', 'start 0.7']);
  const x = useTransform(progress, [0, 1], [280, 0]);
  const skewX = useTransform(progress, [0, 1], [-30, 0]);
  const opacity = useTransform(progress, [0, 0.5], [0, 1]);
  const yearScale = useTransform(progress, [0, 1], [2.6, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ x, skewX, opacity }}
      className="app__skills-exp-item scroll-fx"
    >
      <motion.div className="app__skills-exp-year scroll-fx" style={{ scale: yearScale, originX: 0 }}>
        <p className="bold-text">{experience.year}</p>
      </motion.div>
      <motion.div className="app__skills-exp-works">
        {(experience.works || []).map((work) => (
          <motion.div
            whileInView={{ opacity: [0, 1] }}
            transition={{ duration: 0.5 }}
            className={`app__skills-exp-work ${work.desc ? 'has-desc' : ''}`}
            data-tooltip-id={work.desc ? 'skills-tooltip' : undefined}
            data-tooltip-content={work.desc}
            tabIndex={work.desc ? 0 : undefined}
            key={work._key || `${work.name}-${work.company}`}
          >
            <h4 className="bold-text">{work.name}</h4>
            <p className="p-text">{work.company}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

const Skills = () => {
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);
  const listRef = useRef(null);
  const expRef = useRef(null);
  const listProgress = useScrollProgress(listRef, ['start end', 'start 0.35']);
  const { scrollYProgress: expProgress } = useScroll({ target: expRef, offset: ['start 0.8', 'end 0.5'] });
  const timeline = useSpring(expProgress, { stiffness: 170, damping: 26, restDelta: 0.001 });
  const headTop = useTransform(timeline, (v) => `calc(1rem + ${v} * (100% - 2rem))`);

  useEffect(() => {
    const query = '*[_type == "experiences"] | order(year desc)';
    const skillsQuery = '*[_type == "skills"]';

    client.fetch(query).then((data) => {
      setExperiences(data);
    });

    client.fetch(skillsQuery).then((data) => {
      setSkills(data);
    });
  }, []);

  return (
    <>
      <SplitText className="head-text" capitalize>Skills & Experiences</SplitText>

      <div className="app__skills-container">
        <motion.div className="app__skills-list" ref={listRef}>
          {skills.map((skill, index) => (
            <SkillBubble skill={skill} index={index} progress={listProgress} key={skill._id || skill.name} />
          ))}
        </motion.div>
        <div className="app__skills-exp" ref={expRef}>
          {/* timeline that draws itself down the years as you scroll */}
          <motion.span className="app__skills-exp-line scroll-fx" style={{ scaleY: timeline }} aria-hidden="true" />
          <motion.span className="app__skills-exp-head" style={{ top: headTop }} aria-hidden="true" />
          {experiences.map((experience) => (
            <ExperienceItem experience={experience} key={experience._id || experience.year} />
          ))}
        </div>
      </div>

      {/* One tooltip shared by every role; its text comes from data-tooltip-content. */}
      <Tooltip id="skills-tooltip" className="skills-tooltip" />
    </>
  );
};

export default AppWrap(
  MotionWrap(Skills, 'app__skills'),
  'skills',
  'app__whitebg',
);
