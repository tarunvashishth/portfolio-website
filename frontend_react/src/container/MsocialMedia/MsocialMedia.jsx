import React from 'react';
import { BsTwitter, BsInstagram, BsGithub } from 'react-icons/bs';
import { FaLinkedin } from 'react-icons/fa';

import { MotionWrap } from '../../wrapper';

import './MsocialMedia.scss';

const MsocialMedia = () => (
  <div className="mobile__app__social">
    <a href="https://www.linkedin.com/in/tarun-vashishth/" target="_blank" rel="noreferrer">
      <FaLinkedin/>
    </a>
    <a href="https://github.com/tarunvashishth" target="_blank" rel="noreferrer">
      <BsGithub />
    </a>
    <a href="https://twitter.com/_0verThinker__" target="_blank" rel="noreferrer">
      <BsTwitter />
    </a>
    <a href="https://www.instagram.com/_tarun.v/" target="_blank" rel="noreferrer">
      <BsInstagram />
    </a>
  </div>
);

export default MotionWrap(MsocialMedia);