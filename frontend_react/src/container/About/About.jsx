import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';

import { LocalTime, SectionHeading, SocialIcon, Spotlight, revealProps } from '../../components';
import { ABOUTS_QUERY, PROFILE, SOCIALS } from '../../constants';
import { useSanityQuery } from '../../hooks';
import { imageUrl, pad } from '../../utils';
import './About.scss';

const utcOffset = () => {
  const part = new Intl.DateTimeFormat('en-US', { timeZone: PROFILE.timeZone, timeZoneName: 'shortOffset' })
    .formatToParts(new Date())
    .find((p) => p.type === 'timeZoneName');
  return part ? part.value.replace('GMT', 'UTC') : '';
};

const About = () => {
  const { data: abouts, loading } = useSanityQuery(ABOUTS_QUERY);
  const [lead, ...rest] = PROFILE.bio;

  return (
    <section id="about" className="section about">
      <div className="container">
        <SectionHeading index="01" label="About" title="I know that *good design* means *good business.*" />

        <div className="about__bento">
          <Spotlight as={motion.article} className="about__intro" {...revealProps(0)}>
            <p className="about__eyebrow mono">Hello there 👋</p>
            <p className="about__lead">{lead}</p>
            {rest.map((paragraph) => (
              <p className="about__text" key={paragraph}>{paragraph}</p>
            ))}
          </Spotlight>

          <Spotlight as={motion.article} className="about__clock" {...revealProps(0.1)}>
            <div className="about__radar" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <p className="about__eyebrow mono">Local time</p>
            <LocalTime className="about__time" showSeconds={false} />
            <p className="about__meta">
              {PROFILE.location} · {PROFILE.timeZoneLabel} ({utcOffset()})
            </p>
          </Spotlight>

          <Spotlight as={motion.article} className="about__connect" {...revealProps(0.2)}>
            <p className="about__eyebrow mono">Find me online</p>
            <ul>
              {SOCIALS.map((s) => (
                <li key={s.id}>
                  <a href={s.href} target="_blank" rel="noreferrer">
                    <SocialIcon id={s.id} />
                    <span>{s.label}</span>
                    <FiArrowUpRight className="about__connect-arrow" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </Spotlight>
        </div>

        <div className="about__cards">
          {loading && [0, 1, 2, 3].map((i) => <div key={i} className="skeleton about__skeleton" />)}
          {abouts?.map((about, i) => (
            <Spotlight as={motion.article} className="about__card" key={about._id || about.title} tilt={6} {...revealProps(i * 0.08)}>
              <div className="about__card-inner">
                {about.imgUrl && (
                  <div className="about__card-media">
                    <img src={imageUrl(about.imgUrl, 640)} alt="" loading="lazy" />
                  </div>
                )}
                <span className="about__card-index mono">{pad(i + 1)}</span>
                <h3>{about.title}</h3>
                <p>{about.description}</p>
              </div>
            </Spotlight>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
