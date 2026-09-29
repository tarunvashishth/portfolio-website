import React from 'react';

import { socials } from '../constants';

const SocialMedia = () => (
  <div className="app__social">
    {socials.map(({ name, url, Icon }) => (
      <a key={name} href={url} target="_blank" rel="noreferrer" aria-label={name} title={name}>
        <Icon />
      </a>
    ))}
  </div>
);

export default SocialMedia;
