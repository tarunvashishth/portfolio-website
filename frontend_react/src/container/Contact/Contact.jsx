import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiArrowUpRight, FiCopy, FiMail, FiPhone, FiSend } from 'react-icons/fi';

import { Magnetic, RevealTitle, ScrambleText, SocialIcon, Spotlight, revealProps } from '../../components';
import { PROFILE, SOCIALS } from '../../constants';
import { copyToClipboard } from '../../utils';
import './Contact.scss';

// Optional: point this at a form backend (Formspree, Getform, a serverless
// function…) that accepts a JSON POST of { name, email, message }. Without it
// the form opens the visitor's email app with the message pre-filled.
const FORM_ENDPOINT = process.env.REACT_APP_CONTACT_FORM_ENDPOINT;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY = { name: '', email: '', message: '' };

const validate = ({ name, email, message }) => {
  const errors = {};
  if (!name.trim()) errors.name = 'Please tell me your name.';
  if (!EMAIL_RE.test(email.trim())) errors.email = 'That email doesn’t look quite right.';
  if (message.trim().length < 10) errors.message = 'A few more words, please (10+ characters).';
  return errors;
};

const Field = ({ id, label, error, multiline, ...props }) => {
  const Input = multiline ? 'textarea' : 'input';
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <Input
        id={id}
        name={id}
        placeholder=" "
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      <label htmlFor={id}>{label}</label>
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            className="field__error"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

const SuccessState = ({ name, viaEmailApp, onReset }) => (
  <motion.div
    className="contact__success"
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    role="status"
  >
    <svg className="contact__check" viewBox="0 0 52 52" aria-hidden="true">
      <motion.circle cx="26" cy="26" r="24" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
      <motion.path d="M15 27l7 7 15-16" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.45, duration: 0.4 }} />
    </svg>
    <h3>{viaEmailApp ? 'Almost there!' : `Thanks, ${name.split(' ')[0]}!`}</h3>
    <p>
      {viaEmailApp ? (
        <>
          Your email app should have opened with the message ready to send. Didn&apos;t open? Write to me at{' '}
          <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>.
        </>
      ) : (
        'Your message is on its way — I’ll get back to you soon.'
      )}
    </p>
    <button type="button" className="btn btn--ghost" onClick={onReset}>Send another</button>
  </motion.div>
);

const ContactForm = () => {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [viaEmailApp, setViaEmailApp] = useState(false);
  const formRef = useRef(null);

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((errs) => ({ ...errs, [name]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      formRef.current?.elements[firstInvalid]?.focus();
      return;
    }

    if (!FORM_ENDPOINT) {
      const subject = `Hello from ${values.name.trim()}`;
      const body = `${values.message.trim()}\n\n— ${values.name.trim()} (${values.email.trim()})`;
      window.location.href = `mailto:${PROFILE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setViaEmailApp(true);
      setStatus('sent');
      return;
    }

    setStatus('sending');
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      setViaEmailApp(false);
      setStatus('sent');
    } catch (err) {
      setStatus('error');
    }
  };

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setStatus('idle');
  };

  return (
    <Spotlight as={motion.div} className="contact__form-card" {...revealProps(0.15)}>
      <AnimatePresence mode="wait" initial={false}>
        {status === 'sent' ? (
          <SuccessState key="success" name={values.name} viaEmailApp={viaEmailApp} onReset={reset} />
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            className="contact__form"
            onSubmit={onSubmit}
            noValidate
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="contact__form-row">
              <Field id="name" label="Your name" value={values.name} onChange={onChange} error={errors.name} autoComplete="name" />
              <Field id="email" label="Your email" type="email" value={values.email} onChange={onChange} error={errors.email} autoComplete="email" />
            </div>
            <Field id="message" label="Tell me about your idea…" multiline rows={5} value={values.message} onChange={onChange} error={errors.message} />

            {status === 'error' && (
              <p className="contact__form-error" role="alert">
                Something went wrong sending that. Please try again, or email me directly at{' '}
                <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>.
              </p>
            )}

            <div className="contact__form-footer">
              <p className="contact__form-note">I read every message.</p>
              <Magnetic>
                <button type="submit" className="btn btn--primary" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Send message'}
                  <FiSend aria-hidden="true" />
                </button>
              </Magnetic>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </Spotlight>
  );
};

const Contact = () => (
  <section id="contact" className="section contact">
    <div className="contact__glow" aria-hidden="true" />
    <div className="container">
      <p className="contact__label mono">
        <span className="contact__index">04</span>
        <span className="contact__rule" />
        <ScrambleText text="Contact" />
      </p>
      <RevealTitle className="contact__title" text="Let’s build something *remarkable* together." />
      <motion.p className="contact__intro" {...revealProps(0.1)}>
        Grab a coffee ☕ and chat with me — whether it&apos;s a role, a project or just an idea worth exploring.
      </motion.p>

      <div className="contact__layout">
        <div className="contact__channels">
          <Spotlight as={motion.div} className="contact__channel contact__channel--email" {...revealProps(0)}>
            <span className="contact__channel-icon"><FiMail aria-hidden="true" /></span>
            <div className="contact__channel-body">
              <span className="mono">Email</span>
              <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
            </div>
            <button
              type="button"
              className="icon-btn contact__copy"
              onClick={() => copyToClipboard(PROFILE.email, 'Email copied to clipboard')}
              aria-label="Copy email address"
              title="Copy email"
            >
              <FiCopy />
            </button>
          </Spotlight>

          <Spotlight as={motion.div} className="contact__channel" {...revealProps(0.08)}>
            <span className="contact__channel-icon"><FiPhone aria-hidden="true" /></span>
            <div className="contact__channel-body">
              <span className="mono">Phone</span>
              <a href={PROFILE.phoneHref}>{PROFILE.phone}</a>
            </div>
          </Spotlight>

          <motion.ul className="contact__socials" {...revealProps(0.16)}>
            {SOCIALS.map((s) => (
              <li key={s.id}>
                <a href={s.href} target="_blank" rel="noreferrer">
                  <SocialIcon id={s.id} />
                  <span>{s.label}</span>
                  <FiArrowUpRight aria-hidden="true" />
                </a>
              </li>
            ))}
          </motion.ul>
        </div>

        <ContactForm />
      </div>
    </div>
  </section>
);

export default Contact;
