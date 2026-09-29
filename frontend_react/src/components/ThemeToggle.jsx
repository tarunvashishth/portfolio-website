import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiMoon, FiSun } from 'react-icons/fi';

import { useTheme } from '../hooks';

const ThemeToggle = ({ className = 'icon-btn' }) => {
  const { theme, toggleTheme } = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';

  const onClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    toggleTheme({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  };

  return (
    <button type="button" className={className} onClick={onClick} aria-label={`Switch to ${next} theme`} title={`Switch to ${next} theme`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          style={{ display: 'grid' }}
          initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {theme === 'dark' ? <FiSun /> : <FiMoon />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
};

export default ThemeToggle;
