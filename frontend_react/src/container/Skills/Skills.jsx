import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

import { SectionHeading, Spotlight, revealProps } from '../../components';
import { EXPERIENCES_QUERY, SKILLS_QUERY } from '../../constants';
import { useSanityQuery } from '../../hooks';
import { imageUrl } from '../../utils';
import './Skills.scss';

const Toolkit = () => {
  const { data: skills, loading } = useSanityQuery(SKILLS_QUERY);

  return (
    <div className="skills__col">
      <h3 className="skills__subhead mono">Toolkit</h3>
      <ul className="skills__grid">
        {loading && Array.from({ length: 8 }, (_, i) => <li key={i} className="skeleton skills__skeleton" />)}
        {skills?.map((skill, i) => (
          <motion.li
            key={skill._id || skill.name}
            className="skill"
            style={skill.bgColor ? { '--skill-bg': skill.bgColor } : undefined}
            {...revealProps(i * 0.03, 16)}
          >
            <span className="skill__icon">
              {skill.icon && <img src={imageUrl(skill.icon, 128)} alt="" loading="lazy" />}
            </span>
            <span className="skill__name">{skill.name}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

const Timeline = () => {
  const { data: experiences, loading } = useSanityQuery(EXPERIENCES_QUERY);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <div className="skills__col">
      <h3 className="skills__subhead mono">Experience</h3>
      <div className="timeline" ref={ref}>
        <div className="timeline__track" aria-hidden="true">
          <motion.div className="timeline__fill" style={{ scaleY }} />
        </div>

        {loading && [0, 1].map((i) => <div key={i} className="skeleton timeline__skeleton" />)}

        {experiences?.map((experience) => (
          <div className="timeline__group" key={experience._id || experience.year}>
            <motion.span
              className="timeline__dot"
              aria-hidden="true"
              initial={{ scale: 0.4 }}
              whileInView={{ scale: 1 }}
              viewport={{ margin: '0px 0px -45% 0px' }}
              transition={{ type: 'spring', stiffness: 400, damping: 14 }}
            />
            <p className="timeline__year">{experience.year}</p>
            {(experience.works || []).map((work, i) => (
              <Spotlight
                as={motion.article}
                className="timeline__item"
                key={work._key || `${work.name}-${work.company}`}
                {...revealProps(i * 0.1, 24)}
              >
                <h4 className="timeline__role">{work.name}</h4>
                {work.company && <p className="timeline__company mono">{work.company}</p>}
                {work.desc && <p className="timeline__desc">{work.desc}</p>}
              </Spotlight>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const Skills = () => (
  <section id="skills" className="section skills">
    <div className="container">
      <SectionHeading index="03" label="Skills & Experience" title="The *toolkit* and the *journey*" />
      <div className="skills__layout">
        <Toolkit />
        <Timeline />
      </div>
    </div>
  </section>
);

export default Skills;
