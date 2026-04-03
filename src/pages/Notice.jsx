import React from 'react';
import NoticeHero from '../components/notice/NoticeHero';
import NoticeListing from '../components/notice/NoticeListing';
import NoticeCTA from '../components/notice/NoticeCTA';

const Notice = () => {
  return (
    <div className="bg-white min-h-screen font-body text-slate-900">
      <NoticeHero />
      <NoticeListing />
      <NoticeCTA />
    </div>
  );
};

export default Notice;
