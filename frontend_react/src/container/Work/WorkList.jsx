import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';

import { useFinePointer } from '../../hooks';
import { pad } from '../../utils';
import { ProjectImage } from './WorkCard';

// An index-style list. On mouse devices a preview window trails the cursor and
// slides between screenshots as you move across rows.
const WorkList = ({ works, onOpen }) => {
  const [hovered, setHovered] = useState(null);
  const finePointer = useFinePointer();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 28, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 260, damping: 28, mass: 0.5 });

  const onPointerMove = (e) => {
    x.set(e.clientX);
    y.set(e.clientY);
  };

  return (
    <motion.div
      className="work-list"
      onPointerMove={finePointer ? onPointerMove : undefined}
      onPointerLeave={() => setHovered(null)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
    >
      <ul>
        {works.map((work, i) => (
          <motion.li
            key={work._id || work.title}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0, transition: { delay: i * 0.05 } }}
          >
            <button
              type="button"
              className={`work-row ${hovered !== null && hovered !== i ? 'is-dimmed' : ''}`}
              onClick={() => onOpen(i)}
              onPointerEnter={() => setHovered(i)}
              data-cursor-label="View"
            >
              <span className="work-row__index mono">{pad(i + 1)}</span>
              <span className="work-row__thumb" aria-hidden="true"><ProjectImage work={work} width={240} /></span>
              <span className="work-row__title">{work.title}</span>
              <span className="work-row__tags mono">{work.tags?.join(' · ')}</span>
              <span className="work-row__arrow" aria-hidden="true"><FiArrowUpRight /></span>
            </button>
          </motion.li>
        ))}
      </ul>

      {finePointer && createPortal(
        <motion.div
          className="work-preview"
          style={{ x: springX, y: springY }}
          animate={{ scale: hovered !== null ? 1 : 0.4, opacity: hovered !== null ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          aria-hidden="true"
        >
          <div className="work-preview__track" style={{ transform: `translateY(-${(hovered ?? 0) * 100}%)` }}>
            {works.map((work) => (
              <div className="work-preview__item" key={work._id || work.title}>
                <ProjectImage work={work} width={640} />
              </div>
            ))}
          </div>
        </motion.div>,
        document.body,
      )}
    </motion.div>
  );
};

export default WorkList;
