import React from 'react';
import ReactDOM from 'react-dom/client';

import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/jetbrains-mono/wght';
import '@fontsource/instrument-serif/latin-400-italic';
import './index.css';
import './App.scss';
import App from './App';
import { PROFILE } from './constants';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// A little hello for anyone who opens devtools.
// eslint-disable-next-line no-console
console.log(
  `%c${PROFILE.firstName.toLowerCase()}.%c\n\nPoking around the source? I like you already.\nLet's talk → ${PROFILE.email}`,
  'font: 700 28px system-ui; color: #a594ff',
  'font: 13px ui-monospace, monospace; color: inherit',
);
