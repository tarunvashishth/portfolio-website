import React, { useState } from 'react';

import { images } from '../../constants';
import { AppWrap, MotionWrap } from '../../wrapper';
import './Footer.scss';

const EMAIL = 'tarun.vashishth093@gmail.com';

// Optional form backend (e.g. Formspree) that accepts a JSON POST of
// { name, email, message }. Without it the form opens a pre-filled email.
const FORM_ENDPOINT = process.env.REACT_APP_CONTACT_FORM_ENDPOINT;

const validate = ({ username, email, message }) => {
  if (!username.trim()) return 'Please add your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Please add a valid email address.';
  if (!message.trim()) return 'Please write a short message.';
  return '';
};

const Footer = () => {
  const [formData, setFormData] = useState({ username: '', email: '', message: '' });
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { username, email, message } = formData;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const problem = validate(formData);
    if (problem) {
      setError(problem);
      return;
    }

    if (!FORM_ENDPOINT) {
      const subject = encodeURIComponent(`Hello from ${username.trim()}`);
      const body = encodeURIComponent(`${message.trim()}\n\n${username.trim()} (${email.trim()})`);
      window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
      setIsFormSubmitted(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name: username, email, message }),
      });
      if (!res.ok) throw new Error(res.statusText);
      setIsFormSubmitted(true);
    } catch (err) {
      setError(`Something went wrong. Please email me directly at ${EMAIL}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="head-text">Take a coffee & chat with me</h2>

      <div className="app__footer-cards">
        <a href={`mailto:${EMAIL}`} className="app__footer-card">
          <img src={images.email} alt="" />
          <p className="p-text">{EMAIL}</p>
        </a>
        <a href="tel:+919673228114" className="app__footer-card">
          <img src={images.mobile} alt="" />
          <p className="p-text">+91 9673-228114</p>
        </a>
      </div>
      {!isFormSubmitted ? (
        <form className="app__footer-form app__flex" onSubmit={handleSubmit} noValidate>
          <div className="app__flex">
            <input className="p-text" type="text" placeholder="Your Name" aria-label="Your name" name="username" value={username} onChange={handleChangeInput} autoComplete="name" />
          </div>
          <div className="app__flex">
            <input className="p-text" type="email" placeholder="Your Email" aria-label="Your email" name="email" value={email} onChange={handleChangeInput} autoComplete="email" />
          </div>
          <div>
            <textarea
              className="p-text"
              placeholder="Your Message"
              aria-label="Your message"
              value={message}
              name="message"
              onChange={handleChangeInput}
            />
          </div>
          {error && <p className="p-text app__footer-error" role="alert">{error}</p>}
          <button type="submit" className="p-text" disabled={loading}>{!loading ? 'Send Message' : 'Sending...'}</button>
        </form>
      ) : (
        <div>
          <h3 className="head-text">
            Thank you for getting in touch!
          </h3>
          {!FORM_ENDPOINT && (
            <p className="p-text app__footer-note">
              Your email app should open with the message ready to send.
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default AppWrap(
  MotionWrap(Footer, 'app__footer'),
  'contact',
  'app__whitebg',
);
