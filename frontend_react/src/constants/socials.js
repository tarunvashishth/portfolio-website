import { BsGithub, BsInstagram, BsTwitter } from 'react-icons/bs';
import { FaLinkedin } from 'react-icons/fa';

// One list for the desktop sidebar and the mobile row, so the links can't drift apart.
const socials = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/tarun-vashishth/', Icon: FaLinkedin },
  { name: 'GitHub', url: 'https://github.com/tarunvashishth', Icon: BsGithub },
  { name: 'Twitter', url: 'https://x.com/_tarun_v', Icon: BsTwitter },
  { name: 'Instagram', url: 'https://www.instagram.com/_tarun.v/', Icon: BsInstagram },
];

export default socials;
