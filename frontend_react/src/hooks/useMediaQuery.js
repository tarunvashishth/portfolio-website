import { useEffect, useState } from 'react';

const getMatch = (query) => typeof window !== 'undefined' && window.matchMedia(query).matches;

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => getMatch(query));

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
};

export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)');

export default useMediaQuery;
