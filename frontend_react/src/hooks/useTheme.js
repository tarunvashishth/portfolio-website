import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { flushSync } from 'react-dom';

const STORAGE_KEY = 'theme';
const THEME_COLORS = { dark: '#07070a', light: '#f6f5f1' };

const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} });

const readStored = () => {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch (e) {
    return null;
  }
};

const applyTheme = (theme, persist) => {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme]);
  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      // storage unavailable (private mode) — the choice just won't persist
    }
  }
};

export const ThemeProvider = ({ children }) => {
  // public/index.html sets data-theme before first paint to avoid a flash.
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark');

  // Follow the OS setting until the visitor picks a theme explicitly.
  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = () => {
      if (readStored()) return;
      const next = mql.matches ? 'light' : 'dark';
      applyTheme(next, false);
      setTheme(next);
    };
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const toggleTheme = useCallback((origin) => {
    const next = theme === 'dark' ? 'light' : 'dark';
    const commit = () => {
      applyTheme(next, true);
      setTheme(next);
    };

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || reduceMotion) {
      commit();
      return;
    }

    // Circular reveal of the new theme, expanding from the toggle.
    const x = origin?.x ?? window.innerWidth / 2;
    const y = origin?.y ?? 0;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const root = document.documentElement;

    root.classList.add('theme-transition');
    const transition = document.startViewTransition(() => flushSync(commit));
    transition.ready
      .then(() => root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 650, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' },
      ))
      .catch(() => {});
    transition.finished.finally(() => root.classList.remove('theme-transition'));
  }, [theme]);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
