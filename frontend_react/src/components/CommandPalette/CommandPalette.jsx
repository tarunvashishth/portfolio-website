import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FiArrowUpRight,
  FiBriefcase,
  FiCopy,
  FiCornerDownLeft,
  FiCpu,
  FiHome,
  FiMail,
  FiMoon,
  FiSearch,
  FiSend,
  FiSun,
  FiUser,
} from 'react-icons/fi';

import { NAV_ITEMS, PROFILE, SOCIALS } from '../../constants';
import { useTheme } from '../../hooks';
import { copyToClipboard, scrollToSection } from '../../utils';
import { SocialIcon } from '../Icons';
import './CommandPalette.scss';

const OPEN_EVENT = 'command-palette:open';
export const openCommandPalette = () => window.dispatchEvent(new CustomEvent(OPEN_EVENT));

const NAV_ICONS = { home: FiHome, about: FiUser, work: FiBriefcase, skills: FiCpu, contact: FiSend };

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const returnFocus = useRef(null);

  const commands = useMemo(() => [
    ...NAV_ITEMS.map((item) => ({
      id: `nav-${item.id}`,
      group: 'Navigate',
      label: item.id === 'home' ? 'Back to top' : `Go to ${item.label}`,
      Icon: NAV_ICONS[item.id],
      run: () => scrollToSection(item.id),
    })),
    {
      id: 'theme',
      group: 'Actions',
      label: `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`,
      keywords: 'dark light mode appearance',
      Icon: theme === 'dark' ? FiSun : FiMoon,
      run: () => toggleTheme(),
    },
    {
      id: 'copy-email',
      group: 'Actions',
      label: 'Copy email address',
      hint: PROFILE.email,
      Icon: FiCopy,
      run: () => copyToClipboard(PROFILE.email, 'Email copied to clipboard'),
    },
    {
      id: 'send-email',
      group: 'Actions',
      label: 'Send me an email',
      keywords: 'contact hire',
      Icon: FiMail,
      run: () => {
        window.location.href = `mailto:${PROFILE.email}`;
      },
    },
    ...SOCIALS.map((s) => ({
      id: `social-${s.id}`,
      group: 'Elsewhere',
      label: s.label,
      hint: s.handle,
      Icon: (props) => <SocialIcon id={s.id} {...props} />,
      external: true,
      run: () => window.open(s.href, '_blank', 'noopener,noreferrer'),
    })),
  ], [theme, toggleTheme]);

  const results = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return commands;
    return commands.filter((c) => {
      const haystack = `${c.label} ${c.group} ${c.hint || ''} ${c.keywords || ''}`.toLowerCase();
      return terms.every((t) => haystack.includes(t));
    });
  }, [commands, query]);

  const close = useCallback(() => setOpen(false), []);

  const run = useCallback((command) => {
    setOpen(false);
    // let the palette unmount (and the scroll lock lift) before acting
    requestAnimationFrame(() => command.run());
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    returnFocus.current = document.activeElement;
    setQuery('');
    setActiveIndex(0);
    document.body.style.overflow = 'hidden';
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 10);
    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = '';
      if (returnFocus.current instanceof HTMLElement) returnFocus.current.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => setActiveIndex(0), [query]);

  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter' && results[activeIndex]) {
      e.preventDefault();
      run(results[activeIndex]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'Tab') {
      e.preventDefault(); // focus stays in the search field
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="palette"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          onMouseDown={(e) => e.target === e.currentTarget && close()}
        >
          <motion.div
            className="palette__panel"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          >
            <div className="palette__search">
              <FiSearch aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type a command or search…"
                aria-label="Search commands"
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-list"
                aria-activedescendant={results[activeIndex] ? `cmd-${results[activeIndex].id}` : undefined}
                autoComplete="off"
                spellCheck="false"
              />
              <kbd>esc</kbd>
            </div>

            <div ref={listRef} id="palette-list" className="palette__list" role="listbox" aria-label="Commands">
              {results.length === 0 && <p className="palette__empty">No results for “{query}”</p>}
              {results.map((command, i) => {
                const showGroup = i === 0 || results[i - 1].group !== command.group;
                const { Icon } = command;
                return (
                  <React.Fragment key={command.id}>
                    {showGroup && <p className="palette__group mono" role="presentation">{command.group}</p>}
                    <div
                      id={`cmd-${command.id}`}
                      role="option"
                      aria-selected={i === activeIndex}
                      className={`palette__item ${i === activeIndex ? 'is-active' : ''}`}
                      onMouseMove={() => i !== activeIndex && setActiveIndex(i)}
                      onClick={() => run(command)}
                    >
                      <span className="palette__icon"><Icon aria-hidden="true" /></span>
                      <span className="palette__label">{command.label}</span>
                      {command.hint && <span className="palette__hint">{command.hint}</span>}
                      {command.external ? (
                        <FiArrowUpRight className="palette__enter" aria-hidden="true" />
                      ) : (
                        <FiCornerDownLeft className="palette__enter" aria-hidden="true" />
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            <div className="palette__footer mono" aria-hidden="true">
              <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
              <span><kbd>↵</kbd> select</span>
              <span className="palette__brand">{PROFILE.firstName.toLowerCase()}.</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
