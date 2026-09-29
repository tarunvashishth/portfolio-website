import React from 'react';
import { MotionConfig } from 'framer-motion';

import { About, Footer, Header, MsocialMedia, Skills, Testimonial, Work } from './container';
import { Navbar, NavigationDots, SocialMedia } from './components';
import './App.scss';

const App = () => (
  // honour the OS "reduce motion" setting for every framer-motion animation
  <MotionConfig reducedMotion="user">
    <div className="app">
      <Navbar />
      {/* fixed to the viewport so they float over every section */}
      <SocialMedia />
      <NavigationDots />
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
