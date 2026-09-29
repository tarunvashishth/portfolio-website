import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { FiArrowUpRight, FiGithub } from 'react-icons/fi';

import { resetTilt, trackPointer } from '../../components';
import { imageUrl, pad } from '../../utils';

export const ProjectLinks = ({ work, className = '' }) => (
  (work.projectLink || work.codeLink) ? (
    <div className={`project-links ${className}`}>
      {work.projectLink && (
        <a className="project-link project-link--primary" href={work.projectLink} target="_blank" rel="noreferrer">
          Live site
          <FiArrowUpRight aria-hidden="true" />
        </a>
      )}
      {work.codeLink && (
        <a className="project-link" href={work.codeLink} target="_blank" rel="noreferrer">
          <FiGithub aria-hidden="true" />
          Code
        </a>
      )}
    </div>
  ) : null
);

export const ProjectImage = ({ work, width = 900, className = '' }) => {
  const src = imageUrl(work.imgUrl, width);
  if (src) return <img className={className} src={src} alt={`Screenshot of ${work.title}`} loading="lazy" />;
  const initials = (work.title || '?').split(/\s+/).slice(0, 2).map((w) => w[0]).join('');
  return <div className={`project-placeholder ${className}`} aria-hidden="true">{initials}</div>;
};

// forwardRef: AnimatePresence's popLayout mode measures exiting cards.
const WorkCard = forwardRef(({ work, index, onOpen }, ref) => (
  <motion.article
    ref={ref}
    layout
    className="work-card"
    initial={{ opacity: 0, y: 30, scale: 0.96 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.25 } }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
  >
    <div className="work-card__inner card spotlight" onPointerMove={(e) => trackPointer(e, 5)} onPointerLeave={resetTilt}>
      <button type="button" className="work-card__hit" onClick={onOpen} data-cursor-label="View">
        <span className="sr-only">{`Open details for ${work.title}`}</span>
      </button>

      <div className="work-card__media">
        <ProjectImage work={work} />
        {work.tags?.length > 0 && (
          <div className="work-card__tags">
            {work.tags.map((tag) => <span className="chip" key={tag}>{tag}</span>)}
          </div>
        )}
      </div>

      <div className="work-card__body">
        <span className="work-card__index mono">{pad(index + 1)}</span>
        <h3 className="work-card__title">{work.title}</h3>
        {work.description && <p className="work-card__desc">{work.description}</p>}
        <ProjectLinks work={work} className="work-card__links" />
      </div>
    </div>
  </motion.article>
));

WorkCard.displayName = 'WorkCard';

export default WorkCard;
