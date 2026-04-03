import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApiBaseUrl } from '../../erp/utils/helpers';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const url = `${getApiBaseUrl()}/api/notices?sort[0]=publishDate:desc&pagination[pageSize]=50&filters[isPublic][$eq]=true`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to load notices');
        }
        
        const data = await response.json();
        const allNotices = data.data || [];
        
        const now = new Date();
        const recentNotices = allNotices
          .filter(n => {
            const pubDate = new Date(n.publishDate);
            const diffDays = (now - pubDate) / (1000 * 60 * 60 * 24);
            return diffDays <= 7;
          })
          .slice(0, 3);
        
        setNotices(recentNotices);
      } catch (error) {
        console.error('Error fetching notices:', error);
        setNotices([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotices();
  }, []);

  const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  if (notices.length === 0 && !isLoading) return null;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-10 text-center">
        <h2 className="text-4xl md:text-[2.75rem] font-bold font-heading text-primary mb-4">Latest Notices & Announcements</h2>
        <div className="w-20 h-1 bg-secondary mx-auto mb-16"></div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col items-start p-8 text-left animate-pulse">
                <div className="h-4 w-24 bg-slate-200 rounded mb-4"></div>
                <div className="h-6 w-full bg-slate-200 rounded mb-4"></div>
                <div className="h-20 w-full bg-slate-200 rounded mb-6"></div>
                <div className="h-4 w-32 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {notices.map((notice, idx) => (
                <div key={notice.id || idx} className="bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col items-start p-8 text-left transition-all duration-300 hover:shadow-xl relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-accent"></div>
                  
                  <div className="mb-4">
                    <span className="text-slate-400 text-sm font-medium">
                      {new Date(notice.publishDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <h4 className="text-primary text-[1.35rem] leading-tight mt-2 mb-4 font-bold font-heading">
                      {notice.title}
                    </h4>
                    <p className="text-slate-500 text-[0.95rem] leading-relaxed mb-6">
                      {stripHtml(notice.content).slice(0, 150)}
                      {stripHtml(notice.content).length > 150 ? '...' : ''}
                    </p>
                  </div>
                  
                  <Link to="/notice" className="mt-auto text-primary hover:opacity-70 transition-opacity">
                    View Full Notice
                    <span className="ml-1 text-secondary text-lg">→</span>
                  </Link>
                </div>
              ))}
            </div>
            
            <div className="mt-16">
              <Link to="/notice" className="inline-block border-2 border-primary text-primary hover:bg-primary hover:text-white py-3.5 px-10 rounded-lg font-bold text-[0.95rem] transition-all hover:scale-105 active:scale-95">
                View All Public Notices
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Notices;
