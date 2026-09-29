import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { FiGrid, FiList } from 'react-icons/fi';

import { SectionHeading } from '../../components';
import { DEFAULT_WORK_FILTER, SOCIALS, WORKS_QUERY, WORK_FILTERS } from '../../constants';
import { useSanityQuery } from '../../hooks';
import ProjectModal from './ProjectModal';
import WorkCard from './WorkCard';
import WorkList from './WorkList';
import './Work.scss';

const matches = (work, filter) => filter === 'All' || Boolean(work.tags?.includes(filter));
const GITHUB = SOCIALS.find((s) => s.id === 'github')?.href;

const Work = () => {
  const { data: works, loading, error } = useSanityQuery(WORKS_QUERY);
  const [filter, setFilter] = useState(DEFAULT_WORK_FILTER);
  const [view, setView] = useState('grid');
  const [openIndex, setOpenIndex] = useState(null);

  const counts = useMemo(
    () => Object.fromEntries(WORK_FILTERS.map((f) => [f, (works || []).filter((w) => matches(w, f)).length])),
    [works],
  );
  const visible = useMemo(() => (works || []).filter((w) => matches(w, filter)), [works, filter]);

  // Don't greet visitors with an empty default tab.
  useEffect(() => {
    if (works?.length && counts[DEFAULT_WORK_FILTER] === 0) setFilter('All');
  }, [works, counts]);

  const close = useCallback(() => setOpenIndex(null), []);
  const navigate = useCallback(
    (step) => setOpenIndex((i) => (i === null ? i : (i + step + visible.length) % visible.length)),
    [visible.length],
  );

  const toolbar = (
    <div className="work__toolbar">
      <LayoutGroup id="work-filters">
        <div className="work__filters" role="group" aria-label="Filter projects">
          {WORK_FILTERS.map((f) => (
            <button
              type="button"
              key={f}
              className={`work__filter ${filter === f ? 'is-active' : ''}`}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {filter === f && <motion.span layoutId="work-filter-pill" className="work__filter-pill" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
              <span className="work__filter-label">{f}</span>
              {works && <span className="work__filter-count">{counts[f]}</span>}
            </button>
          ))}
        </div>
      </LayoutGroup>

      <div className="work__views" role="group" aria-label="Layout">
        {[['grid', FiGrid, 'Grid view'], ['list', FiList, 'List view']].map(([id, Icon, label]) => (
          <button
            type="button"
            key={id}
            className={`work__view ${view === id ? 'is-active' : ''}`}
            aria-pressed={view === id}
            aria-label={label}
            title={label}
            onClick={() => setView(id)}
          >
            <Icon aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );

  let content;
  if (loading) {
    content = (
      <div className="work__grid">
        {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton work__skeleton" />)}
      </div>
    );
  } else if (error) {
    content = (
      <p className="state-message">
        Projects couldn&apos;t load right now.
        {GITHUB && <> Meanwhile, browse my code on <a href={GITHUB} target="_blank" rel="noreferrer">GitHub</a>.</>}
      </p>
    );
  } else if (!visible.length) {
    content = <p className="state-message">No {filter} projects here yet — check back soon.</p>;
  } else if (view === 'grid') {
    content = (
      <motion.div layout className="work__grid" key="grid">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((work, i) => (
            <WorkCard key={work._id || work.title} work={work} index={i} onOpen={() => setOpenIndex(i)} />
          ))}
        </AnimatePresence>
      </motion.div>
    );
  } else {
    content = <WorkList key={`list-${filter}`} works={visible} onOpen={setOpenIndex} />;
  }

  return (
    <section id="work" className="section work">
      <div className="container">
        <SectionHeading index="02" label="Work" title="Selected *projects*">
          {toolbar}
        </SectionHeading>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={loading || error ? 'state' : view}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {content}
          </motion.div>
        </AnimatePresence>
      </div>

      <ProjectModal works={visible} index={openIndex} onClose={close} onNavigate={navigate} />
    </section>
  );
};

export default Work;
