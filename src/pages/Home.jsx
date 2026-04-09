import React from 'react';
import { Link } from 'react-router-dom';
import {
  Hero,
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
import Seo from '../components/common/Seo';

const Home = () => {
  return (
    <div className="flex flex-col overflow-hidden">
      <Seo
        title="Skill Development Institute in Bolpur | ANSDB"
        description="ANSDB is a leading skill development institute in Bolpur offering practical, career-focused training. Explore courses and start your journey today."
        path="/"
        keywords={[
          'Aryabhatta National Skill Development Board',
          'ANSDB',
          'skill development institute in Bolpur',
          'vocational training in Bolpur',
          'best institute in Bolpur',
        ]}
      />
      <Hero />
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
