import { useEffect, useState } from 'react';

// Tracks which section currently crosses the middle of the viewport.
const useActiveSection = (ids) => {
  const [active, setActive] = useState(ids[0]);
  const key = ids.join('|');

  useEffect(() => {
    const elements = key.split('|').map((id) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -54% 0px' },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key]);

  return active;
};

export default useActiveSection;
