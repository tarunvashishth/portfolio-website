import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiArrowUpRight, FiCommand } from 'react-icons/fi';

import { NAV_ITEMS, PROFILE, SOCIALS } from '../../constants';
import { useActiveSection } from '../../hooks';
import { isMac, pad } from '../../utils';
import { openCommandPalette } from '../CommandPalette/CommandPalette';
import { SocialIcon } from '../Icons';
import ThemeToggle from '../ThemeToggle';
import './Navbar.scss';

const SECTION_IDS = NAV_ITEMS.map((item) => item.id);
const EASE = [0.76, 0, 0.24, 1];

const MobileMenu = ({ active, onClose }) => (
  <motion.div
    id="mobile-menu"
    className="mobile-menu"
    initial={{ clipPath: 'circle(0% at calc(100% - 2.6rem) 2.4rem)' }}
    animate={{ clipPath: 'circle(150% at calc(100% - 2.6rem) 2.4rem)', transition: { duration: 0.75, ease: EASE } }}
    exit={{ clipPath: 'circle(0% at calc(100% - 2.6rem) 2.4rem)', transition: { duration: 0.55, ease: EASE, delay: 0.1 } }}
  >
    <nav aria-label="Mobile" className="container mobile-menu__inner">
      <ul className="mobile-menu__links">
        {NAV_ITEMS.map((item, i) => (
          <li key={item.id} className="mobile-menu__item">
            <motion.a
              href={`#${item.id}`}
              onClick={onClose}
              className={active === item.id ? 'is-active' : ''}
              initial={{ y: '110%' }}
              animate={{ y: 0, transition: { delay: 0.25 + i * 0.06, duration: 0.7, ease: EASE } }}
              exit={{ y: '110%', transition: { duration: 0.3, ease: EASE } }}
            >
              <span className="mobile-menu__index mono">{pad(i + 1)}</span>
              {item.label}
            </motion.a>
          </li>
        ))}
      </ul>

      <motion.div
        className="mobile-menu__footer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.55 } }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
      >
        <a className="mobile-menu__email" href={`mailto:${PROFILE.email}`}>
          {PROFILE.email}
          <FiArrowUpRight aria-hidden="true" />
        </a>
        <div className="mobile-menu__socials">
          {SOCIALS.map((s) => (
            <a key={s.id} className="icon-btn" href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
              <SocialIcon id={s.id} />
            </a>
          ))}
        </div>
      </motion.div>
    </nav>
  </motion.div>
);

const Navbar = () => {
  const active = useActiveSection(SECTION_IDS);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Hide while scrolling down, reveal on the way back up.
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        if (y > 320 && y > lastY + 6) setHidden(true);
        else if (y < lastY - 6 || y <= 320) setHidden(false);
        lastY = y;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const onResize = () => window.innerWidth > 900 && setOpen(false);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const classes = ['nav', hidden && !open && 'nav--hidden', (scrolled || open) && 'nav--scrolled', open && 'nav--open']
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <header className={classes}>
        <div className="container nav__inner">
          <a href="#home" className="nav__logo" aria-label={`${PROFILE.firstName} ${PROFILE.lastName} — back to top`} onClick={() => setOpen(false)}>
            <span className="nav__logo-mark" aria-hidden="true">{PROFILE.firstName[0]}</span>
            <span className="nav__logo-text">{PROFILE.firstName.toLowerCase()}<span>.</span></span>
          </a>

          <nav aria-label="Primary" className="nav__primary">
            <ul className="nav__links">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`nav__link ${active === item.id ? 'is-active' : ''}`}
                    aria-current={active === item.id ? 'true' : undefined}
                  >
                    {active === item.id && (
                      <motion.span layoutId="nav-pill" className="nav__pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                    )}
                    <span className="nav__roll" data-text={item.label}>
                      <span>{item.label}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="nav__actions">
            <button type="button" className="nav__cmd" onClick={openCommandPalette} aria-label="Open command palette" title="Command palette">
              {isMac() ? <FiCommand aria-hidden="true" /> : <span className="nav__cmd-ctrl">Ctrl</span>}
              <span>K</span>
            </button>
            <ThemeToggle />
            <button
              type="button"
              className={`nav__burger ${open ? 'is-open' : ''}`}
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>{open && <MobileMenu active={active} onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
};

export default Navbar;
