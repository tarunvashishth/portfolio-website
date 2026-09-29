/* eslint-disable jsx-a11y/anchor-has-content */ // dots are labelled via aria-label

import React from 'react';

import { SECTIONS } from '../constants';
import useActiveSection from '../hooks/useActiveSection';

const NavigationDots = () => {
  const active = useActiveSection();

  return (
    <nav className="app__navigation" aria-label="Section navigation">
      {SECTIONS.map((item) => (
        <a
          href={`#${item}`}
          key={item}
          className={`app__navigation-dot ${active === item ? 'app__navigation-dot--active' : ''}`}
          aria-label={item}
          aria-current={active === item ? 'true' : undefined}
          data-label={item}
        />
      ))}
    </nav>
  );
};

export default NavigationDots;
