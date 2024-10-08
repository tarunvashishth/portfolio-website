import React from "react";
import { BsTwitter, BsInstagram, BsGithub } from "react-icons/bs";
import { FaLinkedin } from "react-icons/fa";

const SocialMedia = () => (
  <div className="app__social">
    <a href="https://www.linkedin.com/in/tarun-vashishth/" target="_blank" rel="noreferrer">
      <FaLinkedin/>
    </a>
    <a href="https://github.com/tarunvashishth" target="_blank" rel="noreferrer">
      <BsGithub />
    </a>
    <a href="https://x.com/_tarun_v" target="_blank" rel="noreferrer">
      <BsTwitter />
    </a>
    <a href="https://www.instagram.com/_tarun.v/" target="_blank" rel="noreferrer">
      <BsInstagram />
    </a>
  </div>
);

export default SocialMedia;
