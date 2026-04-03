import React from 'react';
import {
  Hero,
  StatsBar,
  AboutSection,
  CoursesSection,
  SecretaryMessage,
  WhyChoose,
  Gallery,
  Testimonials,
  EnrollCTA,
  ContactSection,
  Notices
} from '@/components/home';

const Home = () => {
  return (
    <div className="flex flex-col overflow-hidden">
      <Hero />
      <StatsBar />
      <AboutSection />
      <CoursesSection />
      <SecretaryMessage />
      <WhyChoose />
      <Gallery />
      <Notices />
      <Testimonials />
      <EnrollCTA />
      <ContactSection />
    </div>
  );
};

export default Home;
