import React from 'react';
import { motion } from 'framer-motion';

import { PROFILE, SOCIALS } from '../../constants';
import { SocialIcon } from '../Icons';
import './SocialRail.scss';

// Fixed side rails on wide screens: socials on the left, email on the right.
const SocialRail = () => (
  <>
    <motion.aside
      className="rail rail--left"
      aria-label="Social links"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4, duration: 0.8 }}
    >
      <ul>
        {SOCIALS.map((s) => (
          <li key={s.id}>
            <a href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} title={s.label}>
              <SocialIcon id={s.id} />
            </a>
          </li>
        ))}
      </ul>
    </motion.aside>
    <motion.div
      className="rail rail--right"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.8 }}
    >
      <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
    </motion.div>
  </>
);

export default SocialRail;
