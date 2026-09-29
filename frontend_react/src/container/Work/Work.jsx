import React, { useState, useEffect, useRef } from 'react';
import { AiFillEye, AiFillGithub } from 'react-icons/ai';
import { motion, useScroll, useTransform } from 'framer-motion';

import { AppWrap, MotionWrap } from '../../wrapper';
import { SplitText } from '../../components';
import { useScrollProgress } from '../../hooks/useScrollFx';
import { urlFor, client } from '../../client';
import './Work.scss';

const DEFAULT_FILTER = 'AI App';
const FILTERS = ['AI App', 'Web App', 'All'];

const byFilter = (works, filter) => (filter === 'All' ? works : works.filter((work) => work.tags?.includes(filter)));

// Cards flip up off the table as they scroll in; the screenshot drifts inside its frame.
const WorkCard = ({ work, index }) => {
  const ref = useRef(null);
  const progress = useScrollProgress(ref, ['start end', 'start 0.6']);
  const { scrollYProgress: pass } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const lean = (index % 3) - 1; // left, centre, right of a row
  const y = useTransform(progress, [0, 1], [240, 0]);
  const scale = useTransform(progress, [0, 1], [0.6, 1]);
  const rotateX = useTransform(progress, [0, 1], [70, 0]);
  const rotate = useTransform(progress, [0, 1], [lean * 14, 0]);
  const opacity = useTransform(progress, [0, 0.4], [0, 1]);
  const imgY = useTransform(pass, [0, 1], ['-10%', '10%']);

  return (
    <motion.div
      ref={ref}
      style={{ y, scale, rotateX, rotate, opacity, transformPerspective: 1000 }}
      className="app__work-item app__flex scroll-fx"
    >
      <div className="app__work-img app__flex">
        <motion.img
          src={urlFor(work.imgUrl).width(600).auto('format').url()}
          alt={work.title}
          loading="lazy"
          className="scroll-fx"
          style={{ y: imgY, scale: 1.25 }}
        />

        <div className="app__work-hover app__flex">
          {work.projectLink && (
            <a href={work.projectLink} target="_blank" rel="noreferrer" aria-label={`View ${work.title} live`} title="View live">
              <motion.div
                whileHover={{ scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className="app__flex"
              >
                <AiFillEye />
              </motion.div>
            </a>
          )}
          {work.codeLink && (
            <a href={work.codeLink} target="_blank" rel="noreferrer" aria-label={`View ${work.title} code on GitHub`} title="View code">
              <motion.div
                whileHover={{ scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className="app__flex"
              >
                <AiFillGithub />
              </motion.div>
            </a>
          )}
        </div>
      </div>

      <div className="app__work-content app__flex">
        <h4 className="bold-text">{work.title}</h4>
        <p className="p-text" style={{ marginTop: 10 }}>{work.description}</p>

        {work.tags?.[0] && (
          <div className="app__work-tag app__flex">
            <p className="p-text">{work.tags[0]}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const Work = () => {
  const [works, setWorks] = useState([]);
  const [filterWork, setFilterWork] = useState([]);
  const [activeFilter, setActiveFilter] = useState(DEFAULT_FILTER);
  const [animateCard, setAnimateCard] = useState({ y: 0, opacity: 1 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const query = '*[_type == "works"]';

    client.fetch(query).then((data) => {
      // don't open on an empty tab
      const initial = byFilter(data, DEFAULT_FILTER).length ? DEFAULT_FILTER : 'All';
      setWorks(data);
      setActiveFilter(initial);
      setFilterWork(byFilter(data, initial));
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);

  const handleWorkFilter = (item) => {
    if (item === activeFilter) return;
    setActiveFilter(item);
    setAnimateCard({ y: 100, opacity: 0 });

    setTimeout(() => {
      setAnimateCard({ y: 0, opacity: 1 });
      setFilterWork(byFilter(works, item));
    }, 500);
  };

  return (
    <>
      <SplitText className="head-text" capitalize>My Creative <span>Portfolio</span> Section</SplitText>

      <div className="app__work-filter" role="group" aria-label="Filter projects">
        {FILTERS.map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => handleWorkFilter(item)}
            aria-pressed={activeFilter === item}
            className={`app__work-filter-item app__flex p-text ${activeFilter === item ? 'item-active' : ''}`}
          >
            {item}
            <span className="app__work-filter-count">{byFilter(works, item).length}</span>
          </button>
        ))}
      </div>

      <motion.div
        animate={animateCard}
        transition={{ duration: 0.5, delayChildren: 0.5 }}
        className="app__work-portfolio"
      >
        {filterWork.map((work, index) => (
          <WorkCard work={work} index={index} key={work._id || work.title} />
        ))}

        {loaded && filterWork.length === 0 && (
          <p className="p-text app__work-empty">
            {works.length ? `No ${activeFilter} projects yet — check back soon.` : 'Projects couldn’t load right now. Please try again later.'}
          </p>
        )}
      </motion.div>
    </>
  );
};

export default AppWrap(
  MotionWrap(Work, 'app__works'),
  'work',
  'app__primarybg',
);
