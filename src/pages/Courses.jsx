import React from 'react';
import CoursesHero from '../components/courses/CoursesHero';
import CoursesListing from '../components/courses/CoursesListing';
import CoursesWhyStudy from '../components/courses/CoursesWhyStudy';
import CoursesCTA from '../components/courses/CoursesCTA';
import Seo from '../components/common/Seo';

const Courses = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-body text-slate-900 dark:text-slate-100 w-full overflow-x-hidden">
      <Seo
        title="Vocational Training in Bolpur | Computer Centre in Bolpur"
        description="Explore ANSDB courses for vocational training in Bolpur and practical computer education. Join a trusted computer centre in Bolpur today."
        path="/courses"
        keywords={[
          'Aryabhatta National Skill Development Board',
          'ANSDB',
          'vocational training in Bolpur',
          'computer centre in Bolpur',
          'skill development institute in Bolpur',
          'best institute in Bolpur',
          'best skill development institute',
          'Bolpur training courses',
          'professional education Bolpur',
        ]}
      />
      <CoursesHero />
      <CoursesListing />
      <CoursesWhyStudy />
      <CoursesCTA />
    </div>
  );
};

export default Courses;
