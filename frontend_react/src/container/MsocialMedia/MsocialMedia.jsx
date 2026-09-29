import React from 'react';

import { socials } from '../../constants';
import { MotionWrap } from '../../wrapper';

import './MsocialMedia.scss';

const MsocialMedia = () => (
  <div className="mobile__app__social">
    {socials.map(({ name, url, Icon }) => (
      <a key={name} href={url} target="_blank" rel="noreferrer" aria-label={name}>
        <Icon />
      </a>
    ))}
  </div>
);

export default MotionWrap(MsocialMedia);
