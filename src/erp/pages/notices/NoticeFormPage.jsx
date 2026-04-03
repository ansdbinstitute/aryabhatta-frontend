import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useNoticeStore from '../../stores/noticeStore';
import PageHeader from '../../components/common/PageHeader';
import { Bell, Calendar, Globe, MapPin, Plus, FileText, Trash2 } from 'lucide-react';
import useToast from '../../hooks/useToast';

const NoticeFormPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [selectedFile, setSelectedFile] = React.useState(null);
  const fileInputRef = React.useRef();
  const { createNotice, uploadAttachment, isLoading } = useNoticeStore();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      publishDate: new Date().toISOString().split('T')[0],
      isPublic: true,
    }
  });

  const onSubmit = async (data) => {
    let attachmentIds = [];
    
    if (selectedFile) {
      const uploadRes = await uploadAttachment(selectedFile);
      if (uploadRes.success) {
        attachmentIds = [uploadRes.fileId];
      } else {
        toast.error('Failed to upload attachment: ' + uploadRes.error);
        return;
      }
    }

    const payload = {
        ...data,
        isPublic: true,
        targetRoles: [],
        targetBatches: [],
        attachments: attachmentIds
    };
    
    const res = await createNotice(payload);
    if (res.success) {
      toast.success('Notice broadcasted successfully');
      navigate('/erp/notices');
    } else {
      toast.error(res.error || 'Failed to broadcast notice');
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <PageHeader
        title="Broadcast New Notice"
        subtitle="Publish a public notice from the ERP that will be visible on the website notice page."
        backTo="/erp/notices"
      />

      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Notice Title *</label>
              <div className="relative">
                 <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                 <input
                   {...register('title', { required: true })}
                   type="text"
                   placeholder="Holiday Announcement / Policy Update 2026"
                   className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500 transition-all text-sm font-medium"
                 />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Notice Content *</label>
              <textarea
                {...register('content', { required: true })}
                rows="6"
                placeholder="Write your institutional announcement here (HTML/Markdown supported)..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500 transition-all text-sm font-medium"
              ></textarea>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Publish Date *</label>
              <div className="relative">
                 <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                 <input
                   {...register('publishDate', { required: true })}
                   type="date"
                   className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500 transition-all text-sm font-medium"
                 />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Expiry Date (Optional)</label>
              <div className="relative">
                 <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                 <input
                   {...register('expiryDate')}
                   type="date"
                   className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500 transition-all text-sm font-medium"
                 />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 mt-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Notice PDF / Attachment</h4>
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6 text-center">
                <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef}
                    accept=".pdf,.doc,.docx,image/*"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                />
                {!selectedFile ? (
                   <button 
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="flex flex-col items-center gap-2 mx-auto"
                   >
                      <div className="bg-white p-4 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                          <Plus className="w-8 h-8 text-rose-500" />
                      </div>
                      <p className="text-sm font-bold text-slate-600 mt-2">Click to select PDF or image</p>
                      <p className="text-xs text-slate-400">Max file size: 10MB</p>
                   </button>
                ) : (
                    <div className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-emerald-100">
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-slate-700 truncate max-w-[200px]">{selectedFile.name}</p>
                                <p className="text-[10px] text-slate-400 font-medium">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        </div>
                        <button 
                            type="button"
                            onClick={() => setSelectedFile(null)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
          </div>

          <div className="md:col-span-2 border-t border-slate-100 pt-6 mt-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Public Visibility</h4>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-white p-2 text-emerald-600 shadow-sm">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-900">This notice will be published publicly.</p>
                  <p className="mt-1 text-sm text-emerald-800">
                    ERP notices are now treated as public notices, so anyone visiting the website notice page will be able to read them.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 flex justify-end gap-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={() => navigate('/erp/notices')}
              className="px-6 py-2.5 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
              Discard Changes
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="flex items-center gap-2 px-10 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-200 transition-all active:scale-95 disabled:bg-slate-300"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Broadcasting...
                </>
              ) : (
                <>
                  <Bell className="w-5 h-5" />
                  Publish Broadcast
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoticeFormPage;
