import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import PageHeader from '../../components/common/PageHeader';
import { ArrowLeft, Calendar, User, MapPin, Share, FileText, CheckCircle } from 'lucide-react';
import { getMediaUrl } from '../../utils/helpers';

const NoticeDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [notice, setNotice] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const res = await api.get(`/notices/${id}?populate=*`);
                setNotice(res.data?.data);
                setIsLoading(false);
            } catch (err) {
                console.error(err);
                setIsLoading(false);
            }
        };
        fetchNotice();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
            </div>
        );
    }

    if (!notice) {
        return (
            <div className="p-12 text-center text-slate-400">
                <p>Notice record could not be retrieved from the ledger.</p>
                <button onClick={() => navigate('/erp/notices')} className="text-rose-600 font-bold mt-4">Back to Board</button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-20 px-4">
            <button 
                onClick={() => navigate('/erp/notices')}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-600 mb-6 transition-colors group"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold text-sm">Return to Board</span>
            </button>

            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="bg-rose-600 p-8 text-white">
                    <div className="flex items-center gap-2 text-rose-100 text-xs font-bold uppercase tracking-widest mb-4">
                        <MapPin className="w-4 h-4" />
                        Official Institutional Release
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black mb-6 uppercase tracking-tight leading-tight">{notice.title}</h1>
                    
                    <div className="flex flex-wrap gap-6 text-sm font-medium text-rose-50 opacity-90">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Released: {new Date(notice.publishDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2">
                             <User className="w-4 h-4" />
                             By Institution Admin
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-12">
                    <div 
                        className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-lg mb-12"
                        dangerouslySetInnerHTML={{ __html: notice.content }}
                    />

                    {notice.attachments?.length > 0 && (
                        <div className="border-t border-slate-100 pt-8">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Official Attachments</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {notice.attachments.map(file => (
                                    <a 
                                        key={file.id}
                                        href={getMediaUrl(file)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-rose-200 hover:bg-rose-50/30 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-lg border border-slate-100">
                                                <FileText className="w-5 h-5 text-rose-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 line-clamp-1">{file.name}</p>
                                                <p className="text-[10px] text-slate-400 uppercase font-bold">{file.ext?.replace('.', '')} • {(file.size / 1024).toFixed(1)} MB</p>
                                            </div>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-100 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-sm">
                                            <FileText className="w-4 h-4" />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                             <p className="text-sm font-bold text-slate-800">Verified Release</p>
                             <p className="text-xs text-slate-400">Digitally signed for security.</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                         <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors">
                             <Share className="w-4 h-4" /> Share
                         </button>
                         <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 text-sm font-bold text-white rounded-xl hover:bg-slate-900 transition-colors shadow-lg">
                             <FileText className="w-4 h-4" /> Print PDF
                         </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoticeDetailPage;
