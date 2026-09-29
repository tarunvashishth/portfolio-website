import React from 'react';
import { MotionConfig } from 'framer-motion';

import { About, Contact, Header, Skills, SiteFooter, Work } from './container';
import {
  CommandPalette,
  Cursor,
  Marquee,
  Navbar,
  ScrollProgress,
  SocialRail,
  Toaster,
} from './components';
import { ThemeProvider } from './hooks';

const App = () => (
  <ThemeProvider>
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip-link">Skip to content</a>
      <ScrollProgress />
      <Navbar />
      <SocialRail />

      <main id="main">
        <Header />
        <Marquee />
        <About />
        <Work />
        <Skills />
        {/* <Testimonial /> — re-enable once there are testimonials in Sanity */}
        <Contact />
      </main>

      <SiteFooter />
      <CommandPalette />
      <Toaster />
      <Cursor />
    </MotionConfig>
  </ThemeProvider>
);

export default App;
