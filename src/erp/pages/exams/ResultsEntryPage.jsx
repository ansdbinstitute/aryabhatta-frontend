import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useExamStore from '../../stores/examStore';
import useStudentStore from '../../stores/studentStore';
import PageHeader from '../../components/common/PageHeader';
import { Save, User, AlertCircle, CheckCircle, ChevronRight, Hash } from 'lucide-react';

const ResultsEntryPage = () => {
  const { id } = useParams(); // examId
  const navigate = useNavigate();
  
  const { exams, results, isLoading: isExamLoading, fetchExamResults, saveResultsBatch } = useExamStore();
  const { students, fetchStudents, isLoading: isStudentLoading } = useStudentStore();
  
  const [marksData, setMarksData] = useState({}); // { studentId: { marks: number, remarks: string } }
  const [saveStatus, setSaveStatus] = useState(null); // 'saving' | 'success' | 'error'

  const exam = exams.find(e => e.documentId === id);

  useEffect(() => {
    fetchExamResults(id);
  }, [id]);

  useEffect(() => {
    if (exam?.batch?.documentId) {
      // Fetch students for this batch
      fetchStudents({ 
        filters: { batch: { documentId: { $eq: exam.batch.documentId } } } 
      });
    }
  }, [exam]);

  useEffect(() => {
    // Populate marksData from existing results
    if (results.length > 0) {
      const data = {};
      results.forEach(r => {
        if (r.student?.id) {
          data[r.student.id] = {
            marks: r.marksObtained,
            remarks: r.remarks || ''
          };
        }
      });
      setMarksData(data);
    }
  }, [results]);

  const handleMarksChange = (studentId, value) => {
    setMarksData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        marks: parseFloat(value) || 0
      }
    }));
  };

  const handleRemarksChange = (studentId, value) => {
    setMarksData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks: value
      }
    }));
  };

  const onSave = async () => {
    setSaveStatus('saving');
    const studentMarksPayload = students.map(s => ({
      studentId: s.id,
      marksObtained: marksData[s.id]?.marks || 0,
      remarks: marksData[s.id]?.remarks || ''
    }));

    const res = await saveResultsBatch(id, studentMarksPayload);
    if (res.success) {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } else {
      setSaveStatus('error');
    }
  };

  if (!exam && !isExamLoading) {
    return (
      <div className="p-12 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Exam record not found.</h2>
        <button onClick={() => navigate('/erp/exams')} className="mt-4 text-indigo-600 font-bold hover:underline">Return to Listing</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <PageHeader 
          title={`Enter Results: ${exam?.title || 'Loading...'}`} 
          subtitle={`Batch: ${exam?.batch?.name || 'All'} | Max Marks: ${exam?.maxMarks || '--'}`}
          backTo="/erp/exams"
        />

        <button 
          onClick={onSave}
          disabled={saveStatus === 'saving'}
          className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
        >
          {saveStatus === 'saving' ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Committing Grade Sheet...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Commit Marks to Ledger
            </>
          )}
        </button>
      </div>

      {saveStatus === 'success' && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <CheckCircle className="w-5 h-5" />
            <p className="font-bold">Result ledger successfully committed to database.</p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-12 gap-0 border-b border-slate-200 bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div className="col-span-1 p-4 text-center">UID</div>
          <div className="col-span-3 p-4">Student Name</div>
          <div className="col-span-2 p-4 text-center">Batch Position</div>
          <div className="col-span-2 p-4 text-center">Marks Obtained</div>
          <div className="col-span-4 p-4">Academic Remarks</div>
        </div>

        <div className="divide-y divide-slate-100">
          {(isStudentLoading || isExamLoading) && students.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            </div>
          ) : students.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
               <User className="w-12 h-12 mx-auto mb-3 opacity-20" />
               <p>No students enrolled in this batch for assessment.</p>
            </div>
          ) : students.map((student, idx) => (
            <div key={student.id} className="grid grid-cols-12 items-center group hover:bg-indigo-50/30 transition-colors">
              <div className="col-span-1 p-4 text-center text-xs font-mono text-slate-400">
                {student.regNo || (idx + 1).toString().padStart(3, '0')}
              </div>
              <div className="col-span-3 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                    {student.firstName[0]}{student.lastName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{student.firstName} {student.lastName}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Student ID: {student.id}</p>
                  </div>
                </div>
              </div>
              <div className="col-span-2 p-4 text-center">
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full whitespace-nowrap">
                  Rank {idx + 1}
                </span>
              </div>
              <div className="col-span-2 p-4 flex justify-center">
                <div className="relative max-w-[100px]">
                  <Hash className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                  <input
                    type="number"
                    max={exam?.maxMarks}
                    value={marksData[student.id]?.marks ?? ''}
                    onChange={(e) => handleMarksChange(student.id, e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-center"
                    placeholder="00.0"
                  />
                  {marksData[student.id]?.marks > exam?.maxMarks && (
                    <span className="absolute -bottom-5 left-0 right-0 text-[10px] text-rose-500 font-bold text-center">Exceeds Max</span>
                  )}
                </div>
              </div>
              <div className="col-span-4 p-4">
                <input
                  type="text"
                  value={marksData[student.id]?.remarks || ''}
                  onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-transparent rounded-lg text-sm text-slate-600 focus:bg-white focus:border-slate-200 transition-all italic"
                  placeholder="Incomplete submission / Outstanding performance..."
                />
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-indigo-900 text-indigo-100 flex justify-between items-center text-xs font-bold uppercase tracking-widest">
            <div className="flex gap-6">
                <span>Total Enrolled: {students.length}</span>
                <span>Average Performance: {
                    students.length > 0 
                    ? (Object.values(marksData).reduce((s, m) => s + (m.marks || 0), 0) / students.length).toFixed(1)
                    : '0.0'
                }%</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsEntryPage;
