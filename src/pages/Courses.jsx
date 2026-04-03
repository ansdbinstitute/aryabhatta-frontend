import React from 'react';
import CoursesHero from '../components/courses/CoursesHero';
import CoursesListing from '../components/courses/CoursesListing';
import CoursesWhyStudy from '../components/courses/CoursesWhyStudy';
import CoursesCTA from '../components/courses/CoursesCTA';

const Courses = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-body text-slate-900 dark:text-slate-100">
      <CoursesHero />
      <CoursesListing />
      <CoursesWhyStudy />
      <CoursesCTA />
    </div>
  );
};

export default Courses;
