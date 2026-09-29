import React, { useEffect, useState } from 'react';
import { HiMenuAlt4, HiX } from 'react-icons/hi';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';

import { SECTIONS } from '../../constants';
import useActiveSection from '../../hooks/useActiveSection';
import './Navbar.scss';

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const [hidden, setHidden] = useState(false);
  const active = useActiveSection();
  const { scrollY } = useScroll();

  // slide away while scrolling down, come back the moment you scroll up
  useMotionValueEvent(scrollY, 'change', (y) => {
    const delta = y - scrollY.getPrevious();
    if (Math.abs(delta) > 4) setHidden(delta > 0 && y > 150);
  });

  useEffect(() => {
    if (!toggle) return undefined;
    const onKey = (e) => e.key === 'Escape' && setToggle(false);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [toggle]);

  return (
    <motion.nav
      className="app__navbar"
      animate={{ y: hidden && !toggle ? '-170%' : '0%' }}
      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      // keyboard users tabbing into a hidden bar get it back
      onFocus={() => setHidden(false)}
    >
      <div className="app__navbar-logo">
{/*         <img src={images.logo} alt="logo" /> */}
      </div>
      <ul className="app__navbar-links">
        {SECTIONS.map((item) => (
          <li className={`app__flex p-text ${active === item ? 'app__navbar-link--active' : ''}`} key={`link-${item}`}>
            <div />
            <a href={`#${item}`} aria-current={active === item ? 'true' : undefined}>{item}</a>
          </li>
        ))}
      </ul>

      <div className="app__navbar-menu">
        <button type="button" aria-label="Open menu" aria-expanded={toggle} onClick={() => setToggle(true)}>
          <HiMenuAlt4 />
        </button>

        {toggle && (
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
          >
            <button type="button" aria-label="Close menu" onClick={() => setToggle(false)}>
              <HiX />
            </button>
            <ul>
              {SECTIONS.map((item) => (
                <li key={item} className={active === item ? 'app__navbar-link--active' : ''}>
                  <a href={`#${item}`} onClick={() => setToggle(false)}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
