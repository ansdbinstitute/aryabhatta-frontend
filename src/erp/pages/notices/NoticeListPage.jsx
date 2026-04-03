import React, { useEffect, useState } from 'react';
import useNoticeStore from '../../stores/noticeStore';
import PageHeader from '../../components/common/PageHeader';
import useAuthStore from '../../stores/authStore';
import { Bell, Plus, Trash2, Calendar, Users, Eye, MapPin, Clock, MoreHorizontal, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const NoticeListPage = () => {
  const { notices, fetchNotices, deleteNotice, isLoading } = useNoticeStore();
  const user = useAuthStore((s) => s.user);
  const isStudent = user?.roleType === 'student';

  useEffect(() => {
    fetchNotices(isStudent ? { 'filters[isPublic][$eq]': true } : {});
  }, [fetchNotices, isStudent]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      await deleteNotice(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <PageHeader
          title={isStudent ? 'Public Notice Board' : 'Institution Notice Board'}
          subtitle={
            isStudent
              ? 'Read the latest public announcements published from the institute ERP.'
              : 'Official broadcasts and bulletins for staff and students.'
          }
        />
        {!isStudent && (
          <Link 
            to="/erp/notices/new"
            className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Broadcast Notice
          </Link>
        )}
      </div>

      {isLoading && notices.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
        </div>
      ) : notices.length === 0 ? (
        <div className="bg-white border text-center border-slate-100 rounded-2xl p-16 shadow-sm">
          <Bell className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700">The board is currently empty.</h3>
          <p className="text-sm text-slate-400 mt-2">Publish an institutional policy or event update to notify everyone.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {notices.map(notice => (
            <div key={notice.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group">
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    <MapPin className="w-3 h-3 fill-rose-600" /> Public Website Notice
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                       {new Date(notice.publishDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </span>
                    {!isStudent && (
                      <button 
                        onClick={() => handleDelete(notice.documentId)}
                        className="p-1 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-3 group-hover:text-rose-600 transition-colors uppercase tracking-tight">{notice.title}</h3>
                
                <div 
                   className="text-sm text-slate-500 line-clamp-3 mb-6 prose prose-slate max-w-none"
                   dangerouslySetInnerHTML={{ __html: notice.content }}
                />

                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-tighter">
                        Visible On Website
                    </span>
                    {notice.attachments?.length > 0 && (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-tighter flex items-center gap-1">
                        <FileText className="w-3 h-3" /> PDF Attachment
                      </span>
                    )}
                    {notice.isPublic === false && (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 uppercase tracking-tighter">
                        ERP Only
                      </span>
                    )}
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center text-xs">
                <div className="flex items-center gap-4 text-slate-400">
                    <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Valid until {notice.expiryDate ? new Date(notice.expiryDate).toLocaleDateString() : 'Indefinite'}</span>
                    </div>
                </div>
                
                <Link 
                  to={`/erp/notices/${notice.documentId}`}
                  className="flex items-center gap-1 font-bold text-rose-600 hover:text-rose-800 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View Original
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoticeListPage;
