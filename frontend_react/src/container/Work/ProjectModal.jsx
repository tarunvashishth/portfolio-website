import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiX } from 'react-icons/fi';

import { pad } from '../../utils';
import { ProjectImage, ProjectLinks } from './WorkCard';

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const ProjectModal = ({ works, index, onClose, onNavigate }) => {
  const work = index !== null ? works[index] : null;
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const returnFocus = useRef(null);
  const isOpen = Boolean(work);

  useEffect(() => {
    if (!isOpen) return undefined;
    returnFocus.current = document.activeElement;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbar}px`;
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      if (returnFocus.current instanceof HTMLElement) returnFocus.current.focus({ preventScroll: true });
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onNavigate(1);
      else if (e.key === 'ArrowLeft') onNavigate(-1);
      else if (e.key === 'Tab' && panelRef.current) {
        // keep focus inside the dialog
        const nodes = [...panelRef.current.querySelectorAll(FOCUSABLE)];
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose, onNavigate]);

  return createPortal(
    <AnimatePresence>
      {work && (
        <motion.div
          className="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: 0.1 } }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            ref={panelRef}
            className="modal__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97, transition: { duration: 0.25 } }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          >
            <div className="modal__bar">
              <span className="mono">
                {pad(index + 1)} / {pad(works.length)}
              </span>
              <div className="modal__controls">
                {works.length > 1 && (
                  <>
                    <button type="button" className="icon-btn" onClick={() => onNavigate(-1)} aria-label="Previous project">
                      <FiArrowLeft />
                    </button>
                    <button type="button" className="icon-btn" onClick={() => onNavigate(1)} aria-label="Next project">
                      <FiArrowRight />
                    </button>
                  </>
                )}
                <button ref={closeRef} type="button" className="icon-btn" onClick={onClose} aria-label="Close project details">
                  <FiX />
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={work._id || work.title}
                className="modal__content"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
              >
                <div className="modal__media">
                  <ProjectImage work={work} width={1400} />
                </div>
                <div className="modal__body">
                  {work.tags?.length > 0 && (
                    <div className="modal__tags">
                      {work.tags.map((tag) => <span className="chip" key={tag}>{tag}</span>)}
                    </div>
                  )}
                  <h3 id="project-modal-title" className="modal__title">{work.title}</h3>
                  {work.description && <p className="modal__desc">{work.description}</p>}
                  <ProjectLinks work={work} className="modal__links" />
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default ProjectModal;
