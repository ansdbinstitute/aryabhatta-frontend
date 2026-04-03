import React from 'react';
import useCurrentStudent from '../hooks/useCurrentStudent';
import { 
  Fingerprint, 
  Download, 
  Eye, 
  CreditCard, 
  Printer,
  ShieldCheck
} from 'lucide-react';
import { getMediaUrl } from '../../erp/utils/helpers';

const StudentIDCardPage = () => {
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

  return (
    <div className="space-y-10 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3 uppercase">
             <Fingerprint className="w-8 h-8 text-blue-600" />
             My Identity Cards
          </h2>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1 opacity-70">
            Issued to UID: <span className="text-blue-600 underline underline-offset-4 decoration-blue-200">{student?.uid}</span>
          </p>
        </div>

        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all shadow-xl active:scale-95"
        >
          <Printer className="w-5 h-5" />
          Print ID Card
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* ID Card Front */}
        <div className="space-y-6">
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 group">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">Front Side View</h3>
              <div className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-widest">Official Representation</div>
            </div>
            
            <div className="aspect-[3/2] rounded-3xl bg-slate-50 border border-slate-200 shadow-lg overflow-hidden flex items-center justify-center relative group-hover:scale-[1.02] transition-transform duration-500">
              {idCardFrontUrl ? (
                <img src={idCardFrontUrl} alt="ID Card Front" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-12 grayscale opacity-20">
                  <CreditCard className="w-20 h-20 mx-auto mb-4" />
                  <p className="text-xs font-black uppercase tracking-widest">Front Not Generated</p>
                </div>
              )}
              {idCardFrontUrl && (
                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-sm">
                  <Eye className="w-12 h-12 text-white scale-75 group-hover:scale-100 transition-transform" />
                </div>
              )}
            </div>

            {idCardFrontUrl && (
              <div className="mt-8">
                <a 
                  href={idCardFrontUrl} 
                  download={`ID_Card_Front_${student?.uid}.jpg`}
                  className="flex items-center justify-center gap-3 w-full py-4 bg-blue-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-[0.98]"
                >
                  <Download className="w-5 h-5" />
                  Download Front Side
                </a>
              </div>
            )}
          </div>
        </div>

        {/* ID Card Back */}
        <div className="space-y-6">
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 group">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">Back Side View</h3>
              <div className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-black rounded-full uppercase tracking-widest">Verification Codes</div>
            </div>
            
            <div className="aspect-[3/2] rounded-3xl bg-slate-50 border border-slate-200 shadow-lg overflow-hidden flex items-center justify-center relative group-hover:scale-[1.02] transition-transform duration-500">
              {idCardBackUrl ? (
                <img src={idCardBackUrl} alt="ID Card Back" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-12 grayscale opacity-20">
                  <CreditCard className="w-20 h-20 mx-auto mb-4" />
                  <p className="text-xs font-black uppercase tracking-widest">Back Not Generated</p>
                </div>
              )}
              {idCardBackUrl && (
                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-sm">
                  <Eye className="w-12 h-12 text-white scale-75 group-hover:scale-100 transition-transform" />
                </div>
              )}
            </div>

            {idCardBackUrl && (
              <div className="mt-8">
                <a 
                  href={idCardBackUrl} 
                  download={`ID_Card_Back_${student?.uid}.jpg`}
                  className="flex items-center justify-center gap-3 w-full py-4 bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]"
                >
                  <Download className="w-5 h-5" />
                  Download Back Side
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-blue-600 rounded-[40px] p-8 lg:p-12 text-white relative overflow-hidden flex flex-col md:flex-row md:items-center gap-10 shadow-2xl shadow-blue-900/40">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[100px] pointer-events-none opacity-50" />
         <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center rotate-12 shrink-0 border border-white/20">
            <ShieldCheck className="w-10 h-10 text-white" />
         </div>
         <div className="flex-1 relative z-10">
            <h3 className="text-2xl font-black tracking-tight mb-2 uppercase tracking-wide">Secure Digital Identity</h3>
            <p className="text-blue-100 font-medium text-sm leading-relaxed max-w-2xl opacity-90">
              Only ID cards issued by the central ERP of ANSDB and linked to your UID are displayed here. If your ID Card is not appearing or contains incorrect information, please visit the administration office for data verification.
            </p>
         </div>
      </div>
    </div>
  );
};

export default StudentIDCardPage;
