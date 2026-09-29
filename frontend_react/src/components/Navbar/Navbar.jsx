import React, { useEffect, useState } from 'react';
import { HiMenuAlt4, HiX } from 'react-icons/hi';
import { motion } from 'framer-motion';

import { SECTIONS } from '../../constants';
import useActiveSection from '../../hooks/useActiveSection';
import './Navbar.scss';

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const active = useActiveSection();

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
    <nav className="app__navbar">
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
    </nav>
  );
};

export default Navbar;
