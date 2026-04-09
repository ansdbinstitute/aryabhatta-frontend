import React from 'react';
import NoticeHero from '../components/notice/NoticeHero';
import NoticeListing from '../components/notice/NoticeListing';
import NoticeCTA from '../components/notice/NoticeCTA';
import Seo from '../components/common/Seo';

const Notice = () => {
  return (
    <div className="bg-white min-h-screen font-body text-slate-900">
      <Seo
        title="ANSDB Notices | Training Updates in Bolpur"
        description="Read official ANSDB notices, announcements, and institute updates for students looking for trusted training information in Bolpur."
        path="/notice"
        keywords={[
          'ANSDB',
          'Aryabhatta National Skill Development Board',
          'skill development institute in Bolpur',
        ]}
      />
      <NoticeHero />
      <NoticeListing />
      <NoticeCTA />
    </div>
  );
};

export default Notice;
