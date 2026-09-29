import React from 'react';
import { MotionConfig } from 'framer-motion';

import { About, Footer, Header, MsocialMedia, Skills, Testimonial, Warp, Work } from './container';
import { Marquee, Navbar, NavigationDots, ScrollProgress, SocialMedia } from './components';
import './App.scss';

const App = () => (
  // honour the OS "reduce motion" setting for every framer-motion animation
  <MotionConfig reducedMotion="user">
    <div className="app">
      <ScrollProgress />
      <Navbar />
      {/* fixed to the viewport so they float over every section */}
      <SocialMedia />
      <NavigationDots />
      <Header />
      <Warp />
      <About />
      <Marquee top="AI Apps ✦ Web Apps ✦ Software Engineer ✦" bottom="Scroll faster ✦ Scroll faster ✦ Scroll faster ✦" />
      <Work />
      <Skills />
      {/* <Testimonial /> */}
      <Marquee top="Let's build something ✦ Say hello ✦" bottom="Ideas → Code → Shipped ✦ Ideas → Code → Shipped ✦" />
      <Footer />
      <MsocialMedia />
    </div>
  </MotionConfig>
);

export default App;
