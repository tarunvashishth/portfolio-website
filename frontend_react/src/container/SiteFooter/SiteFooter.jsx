import React from 'react';
import { FiArrowUp } from 'react-icons/fi';

import { LocalTime, SocialIcon } from '../../components';
import { NAV_ITEMS, PROFILE, SOCIALS } from '../../constants';
import { scrollToSection } from '../../utils';
import './SiteFooter.scss';

const SiteFooter = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer__top">
        <div className="footer__cta">
          <p className="mono">Have an idea?</p>
          <a href={`mailto:${PROFILE.email}`} className="footer__email">{PROFILE.email}</a>
        </div>

        <nav aria-label="Footer" className="footer__nav">
          <p className="mono">Sitemap</p>
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.id}><a href={`#${item.id}`}>{item.label}</a></li>
            ))}
          </ul>
        </nav>

        <div className="footer__nav">
          <p className="mono">Socials</p>
          <ul>
            {SOCIALS.map((s) => (
              <li key={s.id}>
                <a href={s.href} target="_blank" rel="noreferrer">
                  <SocialIcon id={s.id} />
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="footer__wordmark" aria-hidden="true">
        {PROFILE.firstName}
        <span>.</span>
      </p>

      <div className="footer__bottom mono">
        <span>© {new Date().getFullYear()} {PROFILE.firstName} {PROFILE.lastName}</span>
        <span className="footer__time">
          {PROFILE.location} <LocalTime showSeconds={false} /> {PROFILE.timeZoneLabel}
        </span>
        <button type="button" className="footer__top-btn" onClick={() => scrollToSection('home')}>
          Back to top
          <FiArrowUp aria-hidden="true" />
        </button>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
