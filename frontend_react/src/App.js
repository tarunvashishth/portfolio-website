import React from 'react';
import { MotionConfig } from 'framer-motion';

import { About, Footer, Header, MsocialMedia, Skills, Testimonial, Work } from './container';
import { Navbar } from './components';
import './App.scss';

const App = () => (
  // honour the OS "reduce motion" setting for every framer-motion animation
  <MotionConfig reducedMotion="user">
    <div className="app">
      <Navbar />
      <Header />
      <About />
      <Work />
      <Skills />
      {/* <Testimonial /> */}
      <Footer />
      <MsocialMedia />
    </div>
  </MotionConfig>
);

export default App;
