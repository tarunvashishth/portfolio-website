import { useEffect, useState } from 'react';

import { client } from '../client';

// One in-flight/settled promise per query, so sections that need the same
// data (e.g. the hero orbit and the skills grid) share a single request.
const cache = new Map();

const fetchQuery = (query) => {
  if (!cache.has(query)) {
    const request = client.fetch(query).catch((error) => {
      cache.delete(query);
      throw error;
    });
    cache.set(query, request);
  }
  return cache.get(query);
};

const useSanityQuery = (query) => {
  const [state, setState] = useState({ data: null, error: null, loading: true });

  useEffect(() => {
    let active = true;
    fetchQuery(query).then(
      (data) => active && setState({ data: data || [], error: null, loading: false }),
      (error) => active && setState({ data: null, error, loading: false }),
    );
    return () => {
      active = false;
    };
  }, [query]);

  return state;
};

export default useSanityQuery;
