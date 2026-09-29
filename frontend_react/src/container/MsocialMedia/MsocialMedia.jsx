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

// last thing on the page, so it can never scroll up past the default end point
export default MotionWrap(MsocialMedia, '', { offset: ['start end', 'end end'] });
