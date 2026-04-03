import React, { useEffect, useState } from 'react';
import useCurrentStudent from '../hooks/useCurrentStudent';
import client, { extractData } from '../../erp/api/client';
import { 
  Award, 
  Trophy, 
  Target, 
  Calendar, 
  BarChart3, 
  CheckCircle, 
  ChevronRight,
  TrendingUp,
  Download
} from 'lucide-react';
import { format } from 'date-fns';
import Badge from '../../erp/components/ui/Badge';
import { getMediaUrl } from '../../erp/utils/helpers';

const StudentResultsPage = () => {
  const { student, isLoading: studentLoading } = useCurrentStudent();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!student?.id) return;
      
      setIsLoading(true);
      try {
        const response = await client.get('/results', {
            params: {
              filters: { 
                student: { documentId: { $eq: student.id } }
              },
              populate: ['exam', 'student', 'marksheet'],
            sort: 'createdAt:desc',
          }
        });
        setResults(extractData(response) || []);
      } catch (error) {
        console.error('Failed to fetch results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (student) {
      fetchResults();
    }
  }, [student]);

  if (studentLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin" />
      </div>
    );
  }

  const averageScore = results.length > 0 
    ? (results.reduce((acc, r) => acc + (parseFloat(r.marksObtained) || 0), 0) / results.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-10">
      {/* Header with Performance Summary */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
             <Award className="w-8 h-8 text-blue-600" />
             ACADEMIC PERFORMANCE
          </h2>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1 opacity-70">
            Student: <span className="text-blue-600 underline underline-offset-4 decoration-blue-200">{student?.uid}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           <div className="bg-emerald-50 border border-emerald-100 px-6 py-3 rounded-2xl flex items-center gap-3 group">
              <div className="p-2.5 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
                 <Trophy className="w-5 h-5" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Avg. Marks</p>
                 <h3 className="text-xl font-black text-emerald-700">{averageScore}%</h3>
              </div>
           </div>
           <div className="bg-blue-50 border border-blue-100 px-6 py-3 rounded-2xl flex items-center gap-3 group">
              <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                 <Target className="w-5 h-5" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Attempted</p>
                 <h3 className="text-xl font-black text-blue-700">{results.length} Exams</h3>
              </div>
           </div>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-6">
        {results.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
             <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
             <h3 className="text-xl font-black text-slate-800 tracking-tight">No Academic Records</h3>
             <p className="text-slate-500 font-medium text-sm mt-1">Once you complete exams and results are uploaded, they will appear here.</p>
          </div>
        ) : (
          results.map((result) => (
            <div key={result.id} className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 hover:shadow-xl hover:border-blue-100 transition-all group lg:flex items-center gap-10">
               {/* Grade Badge */}
               <div className="shrink-0 flex items-center justify-center w-24 h-24 rounded-[32px] bg-blue-50 text-blue-600 border-4 border-white shadow-xl group-hover:scale-105 transition-transform mb-6 lg:mb-0">
                  <span className="text-4xl font-black">{result.grade || '-'}</span>
               </div>

               {/* Exam Details */}
               <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Academic Examination</p>
                     <Badge variant="success">
                        <div className="flex items-center gap-1 py-0.5 px-0.5">
                           <CheckCircle className="w-3.5 h-3.5" />
                           PUBLISHED
                        </div>
                     </Badge>
                  </div>
                  <h4 className="text-2xl font-black text-slate-800 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                    {result.exam?.title || 'Unknown Exam'}
                  </h4>
                  <div className="flex items-center gap-6 mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                     <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                        {result.createdAt ? format(new Date(result.createdAt), 'dd MMM yyyy') : '-'}
                     </span>
                     <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                        Type: {result.exam?.type || 'Theory'}
                     </span>
                  </div>
               </div>

               {/* Score Visualization & Download */}
               <div className="shrink-0 flex items-center gap-8 mt-8 lg:mt-0">
                  <div className="text-center bg-slate-50 px-8 py-4 rounded-3xl border border-slate-100 shadow-inner">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Marks Obtained</p>
                     <p className="text-3xl font-black text-slate-800 tracking-tight">
                       {result.marksObtained}
                       <span className="text-base text-slate-400 font-bold ml-1">/ {result.exam?.maxMarks || 100}</span>
                     </p>
                  </div>
                  
                  {result.marksheet ? (
                    <a 
                      href={getMediaUrl(result.marksheet)} 
                      target="_blank" 
                      rel="noreferrer"
                      download
                      className="flex flex-col items-center gap-2 group/dl"
                    >
                      <div className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-blue-600 transition-all hover:scale-110 active:scale-95 shadow-xl shadow-slate-200">
                        <Download className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover/dl:text-blue-600 transition-colors">MARKSHEET</span>
                    </a>
                  ) : (
                    <div className="flex flex-col items-center gap-2 opacity-30 grayscale">
                      <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center cursor-not-allowed">
                        <Download className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest">PENDING</span>
                    </div>
                  )}
               </div>
            </div>
          ))
        )}
      </div>

      {/* Grading Scale Info */}
      <div className="bg-slate-900 rounded-[40px] px-8 py-10 lg:p-12 text-white relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
         <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-2">
               <h4 className="text-4xl font-black text-emerald-400">A+</h4>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest tracking-widest">Excellent (90-100%)</p>
            </div>
            <div className="space-y-2">
               <h4 className="text-4xl font-black text-blue-400">A</h4>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest tracking-widest">Very Good (80-89%)</p>
            </div>
            <div className="space-y-2">
               <h4 className="text-4xl font-black text-amber-400">B</h4>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest tracking-widest">Good (70-79%)</p>
            </div>
            <div className="space-y-2">
               <h4 className="text-4xl font-black text-slate-500">C</h4>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest tracking-widest">Average (60-69%)</p>
            </div>
         </div>
         <div className="mt-12 pt-8 border-t border-white/5 relative z-10">
            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-3xl">
              These marks reflect your performance in the academic criteria set by ANSDB. If you have any concerns regarding your final scores, please contact the coordinator within 7 business days of result publishing.
            </p>
         </div>
      </div>
    </div>
  );
};

export default StudentResultsPage;
