import React, { useEffect, useMemo, useState } from 'react';
import { Search, ChevronRight, ChevronLeft, Calendar, ArrowRight, List, Globe, AlertCircle, Loader2 } from 'lucide-react';
import { getApiBaseUrl, getMediaUrl } from '../../erp/utils/helpers';

const PUBLIC_NOTICE_BADGE = 'bg-primary text-white';

const NoticeListing = () => {
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        setError('');

        const params = new URLSearchParams({
          'sort[0]': 'publishDate:desc',
          'pagination[pageSize]': '16',
          'populate[0]': 'attachments',
          'populate[1]': 'targetBatches',
        });

        const response = await fetch(`${getApiBaseUrl()}/api/notices?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to load public notices');
        }

        const payload = await response.json();
        setNotices(payload?.data || []);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const isNew = (publishDate) => {
    const pubDate = new Date(publishDate);
    const now = new Date();
    const diffTime = Math.abs(now - pubDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const filteredNotices = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();

    return notices.filter((notice) => {
      const isPublic = notice.isPublic === true;
      const matchesSearch = !searchTerm
        || notice.title?.toLowerCase().includes(searchTerm)
        || notice.content?.toLowerCase().includes(searchTerm);

      const matchesFilter = filter === 'All'
        || (filter === 'Public' && isPublic)
        || (filter === 'Latest' && isNew(notice.publishDate));

      return matchesSearch && matchesFilter && isPublic;
    });
  }, [filter, notices, query]);

  return (
    <main className="max-w-7xl mx-auto px-6 relative z-20 pb-24 -mt-12 text-left">
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          <div className="w-full lg:flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-accent focus:border-accent text-slate-900 outline-none transition"
              placeholder="Search public notices by keyword..."
              type="text"
            />
          </div>
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            {[
              { id: 'All', Icon: List },
              { id: 'Public', Icon: Globe },
              { id: 'Latest', Icon: AlertCircle },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-colors ${
                  filter === cat.id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-[#EEF4FF] text-primary hover:bg-[#1248BB]/10'
                }`}
              >
                <cat.Icon className={`w-5 h-5 ${filter === cat.id ? 'text-white' : 'text-primary'}`} />
                {cat.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-display font-black text-primary flex items-center gap-3">
            Important Notices
            <span className="bg-danger/10 text-danger text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">Live from ERP</span>
          </h2>
        </div>

        {loading ? (
          <div className="rounded-3xl bg-white border border-slate-200 p-16 text-center shadow-lg">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
            <p className="mt-4 text-sm font-medium text-slate-500">Connecting to ERP...</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl bg-white border border-rose-200 p-16 text-center shadow-lg">
            <AlertCircle className="mx-auto h-10 w-10 text-rose-500" />
            <p className="mt-4 text-sm font-medium text-rose-600">{error}</p>
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="rounded-3xl bg-white border border-slate-200 p-16 text-center shadow-lg">
            <Globe className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-4 text-sm font-medium text-slate-500">No public notices found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredNotices.map((notice) => {
              const fresh = isNew(notice.publishDate);
              const attachment = notice.attachments?.[0];
              const downloadUrl = attachment ? getMediaUrl(attachment) : null;

              return (
                <div 
                  key={notice.id} 
                  onClick={() => downloadUrl && window.open(downloadUrl, '_blank')}
                  className={`bg-white rounded-3xl shadow-md border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all group p-8 flex flex-col h-full relative overflow-hidden ${downloadUrl ? 'cursor-pointer' : ''}`}
                >
                  {/* New/Recent Badge at top left */}
                  {fresh && (
                    <div className="absolute top-0 left-0 bg-danger text-white text-[10px] font-black px-4 py-1 rounded-br-xl uppercase tracking-tighter shadow-lg z-10 animate-pulse">
                      New
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-6 pt-2">
                    <span className="text-slate-400 text-xs font-bold flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-accent" />
                      {new Date(notice.publishDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="bg-accent/10 text-accent text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-accent/20">
                      Public
                    </span>
                  </div>

                  <h3 className="text-xl font-display font-black text-primary group-hover:text-accent transition-colors mb-4 line-clamp-2">
                    {notice.title}
                  </h3>
                  
                  <div
                    className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow line-clamp-3 prose prose-sm max-w-none opacity-80"
                    dangerouslySetInnerHTML={{ __html: notice.content }}
                  />

                  <div className="pt-6 border-t border-slate-100 mt-auto flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Availability</span>
                      <span className="text-xs font-black text-primary">Open for all</span>
                    </div>
                    {downloadUrl ? (
                      <div
                        className="bg-primary group-hover:bg-accent text-white group-hover:text-primary px-5 py-3 rounded-xl font-black text-xs transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
                      >
                        Download <ArrowRight className="w-4 h-4" />
                      </div>
                    ) : (
                      <span className="bg-slate-100 text-slate-400 px-5 py-3 rounded-xl font-black text-xs flex items-center gap-2 cursor-not-allowed">
                        View Only
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-16 flex justify-center">
          <nav className="flex items-center gap-2">
            <button className="w-12 h-12 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary text-white font-bold">1</button>
            <button className="w-12 h-12 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </nav>
        </div>
      </div>
    </main>
  );
};

export default NoticeListing;
