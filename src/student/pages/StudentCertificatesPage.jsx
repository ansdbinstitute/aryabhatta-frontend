import React from 'react';
import useCurrentStudent from '../hooks/useCurrentStudent';
import { 
  ShieldCheck, 
  Download, 
  Eye, 
  Calendar, 
  FileCheck, 
  Fingerprint,
  Award,
  CreditCard,
  Printer
} from 'lucide-react';
import { getMediaUrl } from '../../erp/utils/helpers';
import { format } from 'date-fns';

const StudentCertificatesPage = () => {
  const { student, isLoading } = useCurrentStudent();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin" />
      </div>
    );
  }

  const idCardFrontUrl = getMediaUrl(student?.idCardFront);
  const idCardBackUrl = getMediaUrl(student?.idCardBack);
  const certificateUrl = getMediaUrl(student?.certificate);

  return (
    <div className="space-y-10 pb-12">
      <div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3 uppercase">
           <ShieldCheck className="w-8 h-8 text-blue-600" />
           Digital Credentials
        </h2>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1 opacity-70">
          Student ID: <span className="text-blue-600 underline underline-offset-4 decoration-blue-200">{student?.uid}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {/* Certificate Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
             <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight">
                <Award className="w-6 h-6 text-emerald-500" />
                Academic Certificate
             </h3>
             {certificateUrl && (
                <a
                  href={certificateUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-all shadow-lg active:scale-95 shadow-emerald-200"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download PDF
                </a>
             )}
          </div>

          <div className="p-10 bg-emerald-50 rounded-[40px] border border-emerald-100 shadow-inner flex items-center justify-center min-h-[300px]">
             {certificateUrl ? (
                <div className="text-center space-y-6 group">
                   <div className="w-32 h-32 bg-white rounded-[40px] shadow-2xl flex items-center justify-center border-4 border-emerald-100 group-hover:scale-110 transition-transform duration-500 mb-6">
                      <FileCheck className="w-16 h-16 text-emerald-500" />
                   </div>
                   <div className="space-y-1">
                      <h4 className="text-2xl font-black text-emerald-800 tracking-tight">Verified Digital Copy</h4>
                      <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Uploaded: {student?.updatedAt ? format(new Date(student.updatedAt), 'dd MMM yyyy') : 'TBA'}</p>
                   </div>
                   <a 
                     href={certificateUrl} 
                     target="_blank" 
                     rel="noreferrer"
                     className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all shadow-lg"
                   >
                     View Full Document
                   </a>
                </div>
             ) : (
                <div className="text-center p-12 max-w-sm">
                   <div className="w-20 h-20 bg-emerald-100 text-emerald-300 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                      <Award className="w-10 h-10" />
                   </div>
                   <h4 className="text-lg font-black text-emerald-800 uppercase tracking-tight">Not Available Yet</h4>
                   <p className="text-sm font-medium text-emerald-600 mt-2 leading-relaxed opacity-70">
                     Certificates are typically issued after successful course completion and final result verification.
                   </p>
                </div>
             )}
          </div>
        </div>
      </div>

      {/* Warning / Verification Info */}
      <div className="bg-slate-900 rounded-[40px] p-8 lg:p-12 text-white relative overflow-hidden flex flex-col md:flex-row md:items-center gap-10">
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />
         <div className="w-20 h-20 bg-[#1E293B] rounded-3xl flex items-center justify-center rotate-12 shrink-0 border border-slate-700">
            <ShieldCheck className="w-10 h-10 text-emerald-500" />
         </div>
         <div className="flex-1">
            <h3 className="text-2xl font-black tracking-tight mb-2 uppercase tracking-wide">SECURE CREDENTIALS</h3>
            <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-2xl">
              These documents are generated by the central ERP system of ANSDB. They contain unique tracking IDs used for third-party verification. Please ensure your personal information is correct on your profile before requesting a final certificate print.
            </p>
         </div>
      </div>
    </div>
  );
};

export default StudentCertificatesPage;
