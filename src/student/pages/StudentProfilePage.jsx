import React from 'react';
import useCurrentStudent from '../hooks/useCurrentStudent';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  ShieldCheck, 
  FileText, 
  Download,
  Printer,
  Heart,
  Users
} from 'lucide-react';
import { getFullName, getMediaUrl } from '../../erp/utils/helpers';
import { format } from 'date-fns';

const InfoCard = ({ icon: Icon, title, children }) => (
  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
    <div className="px-8 py-5 border-b border-slate-50 bg-slate-50/30 flex items-center gap-3">
      <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">{title}</h3>
    </div>
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 flex-1">
      {children}
    </div>
  </div>
);

const Detail = ({ label, value, icon: Icon }) => (
  <div className="space-y-1.5">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
      {Icon && <Icon className="w-3 h-3" />}
      {label}
    </p>
    <p className="text-sm font-black text-slate-700 tracking-tight">{value || 'N/A'}</p>
  </div>
);

const StudentProfilePage = () => {
  const { student, isLoading, error } = useCurrentStudent();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-black text-slate-800">Profile Not Found</h2>
        <p className="text-slate-500 mt-2">We couldn't retrieve your profile data. Please contact administration.</p>
      </div>
    );
  }

  const fullName = getFullName(student.firstName, student.lastName);
  const profileImageUrl = getMediaUrl(student.profileImage);
  const idCardFrontUrl = getMediaUrl(student.idCardFront);
  const idCardBackUrl = getMediaUrl(student.idCardBack);
  const enrollmentDate = student.enrollmentDate ? format(new Date(student.enrollmentDate), 'dd MMMM yyyy') : 'N/A';
  const dob = student.dob ? format(new Date(student.dob), 'dd MMMM yyyy') : 'N/A';
  const registrationYear = student.enrollmentDate ? format(new Date(student.enrollmentDate), 'yyyy') : 'N/A';

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Header Card */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 lg:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full -mr-48 -mt-48 blur-3xl -z-10" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12">
          {/* Avatar Section */}
          <div className="relative group">
            <div className="w-40 h-40 lg:w-48 lg:h-48 rounded-[48px] bg-slate-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-500 ring-1 ring-slate-100">
              {profileImageUrl ? (
                <img src={profileImageUrl} alt={fullName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-black text-slate-300">
                  {student.firstName?.[0]}{student.lastName?.[0]}
                </span>
              )}
            </div>
            <div className="absolute bottom-4 right-4 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full shadow-lg" />
          </div>

          {/* Identity Section */}
          <div className="text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">{fullName}</h1>
              <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-black rounded-full border border-emerald-100 uppercase tracking-widest shadow-sm">
                Active
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-lg font-bold text-slate-500 flex items-center justify-center md:justify-start gap-2">
                ID: <span className="text-slate-800 font-black">{student.uid || 'PENDING'}</span>
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                <div className="px-4 py-2 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-900/20">
                  {student.course?.title || 'No Course Enrolled'}
                </div>
                <div className="px-4 py-2 bg-slate-100 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest border border-slate-200">
                  {student.batch?.name || 'No Batch'}
                </div>
              </div>
            </div>
          </div>

          {/* Information Notice */}
          <div className="shrink-0 hidden lg:block">
            <div className="px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Updated</p>
              <p className="text-sm font-black text-slate-700 tracking-tight">
                {student.updatedAt ? format(new Date(student.updatedAt), 'dd MMM yyyy') : 'Recently'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Details */}
        <InfoCard icon={User} title="Personal Information">
          <Detail label="Full Name" value={fullName} />
          <Detail label="Date of Birth" value={dob} />
          <Detail label="Gender" value={student.gender} />
          <Detail label="Blood Group" icon={Heart} value="O+" />
          <Detail label="Father's Name" value={student.fatherName} />
          <Detail label="Mother's Name" value={student.motherName} />
        </InfoCard>

        {/* Academic Details */}
        <InfoCard icon={Briefcase} title="Academic Information">
          <div className="md:col-span-2 p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2">Enrolled Course</p>
            <h4 className="text-xl font-black text-blue-700 tracking-tight">{student.course?.title || 'N/A'}</h4>
          </div>
          <Detail label="Batch ID" value={student.batch?.name} />
          <Detail label="Date of Joining" value={enrollmentDate} />
          <Detail label="Student Status" value={student.status} />
          <Detail label="Registration Year" value={registrationYear} />
        </InfoCard>

        {/* Contact Details */}
        <InfoCard icon={Phone} title="Contact Details">
          <Detail label="Phone Number" value={student.phone} icon={Phone} />
          <Detail label="Email Address" value={student.email} icon={Mail} />
          <Detail label="Emergency Contact" value={`${student.altPhone || student.phone} (Guardian)`} />
          <Detail label="Permanent Address" value={student.address} icon={MapPin} />
        </InfoCard>

        {/* Quick Actions (e.g. ID Card / Application) */}
        <div className="p-8 bg-slate-900 rounded-[40px] text-white flex flex-col justify-center space-y-8">
          <div>
            <h3 className="text-2xl font-black tracking-tight mb-2">Essential Documents</h3>
            <p className="text-slate-400 font-medium text-sm leading-relaxed">
              Access your digital credentials, identity cards, and academic application records instantly.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {idCardFrontUrl && (
              <a 
                href={idCardFrontUrl} 
                download="ID_Card_Front.jpg"
                className="flex items-center gap-3 px-8 py-4 bg-[#1E293B] text-white font-bold rounded-2xl hover:bg-blue-600 transition-all border border-slate-700 hover:border-blue-500 shadow-xl"
              >
                <Download className="w-5 h-5 text-blue-400" />
                ID Front
              </a>
            )}
            {idCardBackUrl && (
              <a 
                href={idCardBackUrl} 
                download="ID_Card_Back.jpg"
                className="flex items-center gap-3 px-8 py-4 bg-[#1E293B] text-white font-bold rounded-2xl hover:bg-blue-600 transition-all border border-slate-700 hover:border-blue-500 shadow-xl"
              >
                <Download className="w-5 h-5 text-blue-400" />
                ID Back
              </a>
            )}
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-3 px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition-all shadow-xl"
            >
              <Printer className="w-5 h-5" />
              Print Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
