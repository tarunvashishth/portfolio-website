import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

import { SectionHeading } from '../../components';
import { BRANDS_QUERY, TESTIMONIALS_QUERY } from '../../constants';
import { useSanityQuery } from '../../hooks';
import { imageUrl } from '../../utils';
import './Testimonial.scss';

// Not rendered at the moment (see App.js) — kept ready for when there are
// testimonials in Sanity.
const Testimonial = () => {
  const { data: testimonials } = useSanityQuery(TESTIMONIALS_QUERY);
  const { data: brands } = useSanityQuery(BRANDS_QUERY);
  const [index, setIndex] = useState(0);

  if (!testimonials?.length && !brands?.length) return null;
  const current = testimonials?.[index];
  const step = (n) => setIndex((i) => (i + n + testimonials.length) % testimonials.length);

  return (
    <section id="testimonial" className="section testimonial">
      <div className="container">
        <SectionHeading index="—" label="Kind words" title="What people *say*" />

        {current && (
          <div className="testimonial__card card">
            <AnimatePresence mode="wait">
              <motion.figure
                key={index}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35 }}
              >
                <blockquote>“{current.feedback}”</blockquote>
                <figcaption>
                  {current.imgurl && <img src={imageUrl(current.imgurl, 160)} alt="" />}
                  <span>
                    <strong>{current.name}</strong>
                    <small>{current.company}</small>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
            {testimonials.length > 1 && (
              <div className="testimonial__controls">
                <button type="button" className="icon-btn" onClick={() => step(-1)} aria-label="Previous testimonial"><FiArrowLeft /></button>
                <button type="button" className="icon-btn" onClick={() => step(1)} aria-label="Next testimonial"><FiArrowRight /></button>
              </div>
            )}
          </div>
        )}

        {brands?.length > 0 && (
          <ul className="testimonial__brands">
            {brands.map((brand) => (
              <li key={brand._id}>
                <img src={imageUrl(brand.imgUrl, 300)} alt={brand.name} loading="lazy" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default Testimonial;
