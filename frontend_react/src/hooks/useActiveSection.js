import { useEffect, useState } from 'react';

import { SECTIONS } from '../constants';

// Which section currently crosses the middle of the screen.
const useActiveSection = () => {
  const [active, setActive] = useState(SECTIONS[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
      { rootMargin: '-45% 0px -54% 0px' },
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return active;
};

export default useActiveSection;
