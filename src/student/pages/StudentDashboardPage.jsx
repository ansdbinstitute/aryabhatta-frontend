import React, { useEffect, useState } from 'react';
import useCurrentStudent from '../hooks/useCurrentStudent';
import client, { extractData } from '../../erp/api/client';
import { 
  BookOpen, 
  Award, 
  CreditCard, 
  Bell, 
  Calendar,
  CheckCircle,
  Clock,
  ArrowRight,
  Download,
  Fingerprint,
  Megaphone
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ icon: Icon, title, value, subtitle, color, path }) => (
  <Link to={path} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:p-6 hover:shadow-lg hover:border-slate-200 transition-all group overflow-hidden relative">
    <div className={`absolute top-0 right-0 w-20 h-20 ${color} opacity-5 -mr-6 -mt-6 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700`} />
    <div className="flex items-center gap-3 md:gap-4">
      <div className={`p-2.5 md:p-3.5 rounded-xl ${color.replace('bg-', 'bg-opacity-10 ')} ${color.replace('bg-', 'text-')} transition-all group-hover:scale-110`}>
        <Icon className="w-5 md:w-6 h-5 md:h-6" />
      </div>
      <div>
        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
        <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight mt-0.5 md:mt-1">{value}</h3>
        <p className="text-[10px] md:text-[11px] font-bold text-slate-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  </Link>
);

const StudentDashboardPage = () => {
  const { student, isLoading: isProfileLoading } = useCurrentStudent();
  const [dashboardData, setDashboardData] = useState({
    materialsCount: '0 Files',
    examResult: 'N/A',
    examsCount: '0 New',
    notices: [],
    isLoading: true
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!student?.id) return;
      
      setDashboardData(prev => ({ ...prev, isLoading: true }));
      try {
        // 1. Fetch Materials Count
        const materialsRes = await client.get('/materials', {
          params: {
            filters: { course: student.course?.id },
            pagination: { pageSize: 1 }
          }
        });
        const mCount = materialsRes.data?.meta?.pagination?.total || 0;

        // 2. Fetch Latest Exam Result
        const resultsRes = await client.get('/results', {
          params: {
            filters: { student: student.id },
            sort: 'createdAt:desc',
            pagination: { pageSize: 1 }
          }
        });
        const latestResult = extractData(resultsRes)?.[0];
        const resValue = latestResult ? `${latestResult.marksObtained}%` : 'N/A';

        // 3. Fetch Exam Notices Count
        const examsRes = await client.get('/exams', {
          params: {
            filters: { course: student.course?.id },
            pagination: { pageSize: 1 }
          }
        });
        const eCount = examsRes.data?.meta?.pagination?.total || 0;

        // 4. Fetch Notices (Announcements)
        const noticesRes = await client.get('/notices', {
          params: {
            sort: 'createdAt:desc',
            pagination: { pageSize: 5 },
            populate: '*'
          }
        });
        const noticesList = extractData(noticesRes) || [];

        setDashboardData({
          materialsCount: `${mCount} ${mCount === 1 ? 'File' : 'Files'}`,
          examResult: resValue,
          examsCount: `${eCount} ${eCount === 1 ? 'Notice' : 'Notices'}`,
          notices: noticesList,
          isLoading: false
        });
      } catch (error) {
        console.error('Final Dashboard Fetch Error:', error);
        setDashboardData(prev => ({ ...prev, isLoading: false }));
      }
    };

    if (student) {
      fetchDashboardStats();
    }
  }, [student]);

  if (isProfileLoading || (student && dashboardData.isLoading)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl md:rounded-3xl px-5 md:px-8 py-6 md:py-10 text-white relative overflow-hidden shadow-xl shadow-indigo-900/20">
        <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-indigo-500/30 rounded-full -mr-16 md:-mr-32 -mt-16 md:-mt-32 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
          <div className="max-w-2xl">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight mb-2 md:mb-3 leading-tight">
              Your Academic Journey Continues
            </h1>
            <p className="text-indigo-200 text-xs md:text-sm font-medium flex items-center gap-2">
              <Calendar className="w-3.5 md:w-4 h-3.5 md:h-4" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 md:p-5 rounded-xl md:rounded-2xl shrink-0">
            <p className="text-[10px] md:text-[11px] font-bold text-indigo-200 uppercase tracking-widest mb-1">Primary Course</p>
            <h3 className="text-base md:text-lg font-black">{student?.course?.title || 'Not Enrolled'}</h3>
            <p className="text-xs font-medium text-indigo-300 mt-1 opacity-80">Batch: {student?.batch?.name || 'Pending'}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
        <StatCard 
          icon={BookOpen} 
          title="Study Materials" 
          value={dashboardData.materialsCount} 
          subtitle="Available for your course" 
          color="bg-blue-600" 
          path="/student/materials"
        />
        <StatCard 
          icon={Award} 
          title="Latest Result" 
          value={dashboardData.examResult} 
          subtitle="Score from final exam" 
          color="bg-emerald-500" 
          path="/student/results"
        />
        <StatCard 
          icon={Bell} 
          title="Active Exams" 
          value={dashboardData.examsCount} 
          subtitle="Schedule Overview" 
          color="bg-amber-500" 
          path="/student/exams"
        />
        <StatCard 
          icon={Fingerprint} 
          title="Identity Card" 
          value="Issued" 
          subtitle="Digital ID Active" 
          color="bg-indigo-600" 
          path="/student/id-card"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        {/* Official Announcements Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-lg md:text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <Megaphone className="w-5 md:w-6 h-5 md:h-6 text-blue-600" />
              Announcements
            </h3>
            <span className="px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-bold text-blue-600 uppercase tracking-widest">
              Live
            </span>
          </div>
          
          <div className="space-y-3">
            {dashboardData.notices.length === 0 ? (
              <div className="py-10 md:py-16 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                 <Bell className="w-8 md:w-10 h-8 md:h-10 text-slate-200 mx-auto mb-2" />
                 <p className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest">No Active Announcements</p>
              </div>
            ) : (
              dashboardData.notices.map((item) => (
                <div key={item.id} className="p-3.5 md:p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-blue-50 hover:border-blue-100 transition-colors flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 md:w-12 h-10 md:h-12 bg-white rounded-xl shadow-sm flex items-center justify-center font-bold text-blue-600 text-[10px] md:text-xs uppercase shadow-inner border border-slate-50">
                      {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-700 md:text-slate-800 text-sm md:text-base group-hover:text-blue-600 transition-colors">{item.title}</h4>
                      <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{item.type || 'NOTICE'}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 md:w-5 h-4 md:h-5 text-slate-300 group-hover:text-blue-600 transition-colors group-hover:translate-x-1" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-900 rounded-2xl p-5 md:p-6 text-white flex flex-col justify-between overflow-hidden relative group">
          <div className="absolute -bottom-8 -right-8 w-24 md:w-32 h-24 md:h-32 bg-blue-600/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10">
            <h3 className="text-base md:text-lg font-black tracking-tight mb-4 md:mb-5 uppercase">Quick Actions</h3>
            <div className="space-y-2.5 md:space-y-3">
              <Link to="/student/id-card" className="w-full flex items-center justify-between p-3 md:p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-blue-600 transition-all font-medium text-xs md:text-sm tracking-tight group/btn">
                <span>View ID Card</span>
                <Fingerprint className="w-4 h-4 text-blue-400 group-hover/btn:text-white transition-colors" />
              </Link>
              <Link to="/student/payments" className="w-full flex items-center justify-between p-3 md:p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-blue-600 transition-all font-medium text-xs md:text-sm tracking-tight group/btn">
                <span>Payment History</span>
                <CreditCard className="w-4 h-4 text-emerald-400 group-hover/btn:text-white transition-colors" />
              </Link>
              <Link to="/student/materials" className="w-full flex items-center justify-between p-3 md:p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-blue-600 transition-all font-medium text-xs md:text-sm tracking-tight group/btn">
                <span>Study Resources</span>
                <BookOpen className="w-4 h-4 text-amber-400 group-hover/btn:text-white transition-colors" />
              </Link>
            </div>
          </div>
          <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-white/10 relative z-10">
            <p className="text-[9px] md:text-[10px] font-medium text-slate-500 uppercase tracking-widest mb-1">Logged in as</p>
            <p className="font-bold text-xs md:text-sm tracking-tight text-blue-400">{student?.uid || 'STUDENT_ID'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
