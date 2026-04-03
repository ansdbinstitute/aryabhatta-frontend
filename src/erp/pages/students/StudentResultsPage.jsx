import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useStudentStore from '../../stores/studentStore';
import useResultStore from '../../stores/resultStore';
import useExamStore from '../../stores/examStore';
import PageHeader from '../../components/common/PageHeader';
import { Award, Search, Filter, FileText, Eye, Plus, X, Paperclip, Upload, Download, Save } from 'lucide-react';

const StudentResultsPage = () => {
  const { students, isLoading: studentsLoading, fetchStudents } = useStudentStore();
  const { results, isLoading: resultsLoading, fetchResults, uploadMarksheet } = useResultStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBatch, setFilterBatch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const { exams, fetchExams } = useExamStore();
  const { createResultWithMarksheet } = useResultStore();

  useEffect(() => {
    fetchStudents();
    fetchResults();
    fetchExams();
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.uid?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBatch = !filterBatch || String(student.batch?.id) === String(filterBatch);
    
    return matchesSearch && matchesBatch;
  });

  const batches = [...new Set(students.map(s => s.batch).filter(Boolean))];

  const getStudentResults = (studentId) => {
    return results.filter(r => {
        const rStudentId = r.student?.id || r.attributes?.student?.data?.id || r.attributes?.student?.id;
        return String(rStudentId) === String(studentId);
    });
  };

  const getLatestResult = (studentId) => {
    const studentResults = getStudentResults(studentId);
    if (studentResults.length === 0) return null;
    return studentResults.sort((a, b) => {
      const aDate = a.attributes?.createdAt || a.createdAt;
      const bDate = b.attributes?.createdAt || b.createdAt;
      return new Date(bDate) - new Date(aDate);
    })[0];
  };

  const getResultStatus = (result) => {
    if (!result) return null;
    const marks = parseFloat(result.attributes?.marksObtained || result.marksObtained);
    if (marks >= 60) return { label: 'Pass', color: 'emerald' };
    if (marks >= 40) return { label: 'Average', color: 'amber' };
    return { label: 'Fail', color: 'red' };
  };

  const handleViewResults = (student) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };

  const [uploadingResultId, setUploadingResultId] = useState(null);
  const resultFileInputRef = React.useRef(null);

  const handleResultFileChange = async (e, resultId) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingResultId(resultId);
    const res = await uploadMarksheet(resultId, file);
    setUploadingResultId(null);

    if (res.success) {
      fetchResults(); // Refresh data
    } else {
      alert(res.error || 'Upload failed');
    }
  };

  const isLoading = studentsLoading || resultsLoading;

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <PageHeader 
        title="Student Results" 
        subtitle="View and manage student examination results."
        actions={
          <button 
            onClick={() => {
                setAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Result
          </button>
        }
      />

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or UID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={filterBatch}
              onChange={(e) => setFilterBatch(e.target.value)}
              className="pl-10 pr-8 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50 appearance-none cursor-pointer"
            >
              <option value="">All Batches</option>
              {batches.map(batch => (
                <option key={batch.id} value={batch.id}>{batch.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/80 text-slate-500 text-xs font-medium">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">UID</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Batch</th>
                <th className="px-6 py-4">Results</th>
                <th className="px-6 py-4">Latest Result</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><div className="animate-pulse bg-slate-200 h-4 w-32 rounded"></div></td>
                    <td className="px-6 py-4"><div className="animate-pulse bg-slate-200 h-4 w-20 rounded"></div></td>
                    <td className="px-6 py-4"><div className="animate-pulse bg-slate-200 h-4 w-24 rounded"></div></td>
                    <td className="px-6 py-4"><div className="animate-pulse bg-slate-200 h-4 w-20 rounded"></div></td>
                    <td className="px-6 py-4"><div className="animate-pulse bg-slate-200 h-4 w-16 rounded"></div></td>
                    <td className="px-6 py-4"><div className="animate-pulse bg-slate-200 h-4 w-20 rounded"></div></td>
                    <td className="px-6 py-4"><div className="animate-pulse bg-slate-200 h-4 w-20 rounded ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No students found</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => {
                  const latestResult = getLatestResult(student.id);
                  const resultStatus = getResultStatus(latestResult);
                  const studentResults = getStudentResults(student.id);
                  
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {student.firstName?.charAt(0) || 'S'}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{student.firstName} {student.lastName}</p>
                            <p className="text-xs text-slate-400">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-slate-600">{student.uid || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">{student.course?.title || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">{student.batch?.name || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4">
                        {studentResults.length > 0 ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                            {studentResults.length} exam{studentResults.length !== 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">No results</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {latestResult ? (
                          <div>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              resultStatus?.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                              resultStatus?.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {resultStatus?.label}
                            </span>
                            <p className="text-xs text-slate-400 mt-1">
                              {latestResult.attributes?.marksObtained || latestResult.marksObtained} marks
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleViewResults(student)}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Results"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filteredStudents.length > 0 && (
          <div className="p-4 border-t border-slate-100 text-center text-sm text-slate-500">
            Showing {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* View Results Detail Modal */}
      {modalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl border border-slate-100 overflow-hidden max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Results for {selectedStudent.firstName} {selectedStudent.lastName}
                </h3>
                <p className="text-sm text-slate-500">UID: {selectedStudent.uid || 'N/A'}</p>
              </div>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-auto flex-1">
              {getStudentResults(selectedStudent.id).length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No results found for this student</p>
                </div>
              ) : (
                <div className="space-y-3">
                   {getStudentResults(selectedStudent.id).map((result) => {
                    const status = getResultStatus(result);
                    const marksheet = result.marksheet || result.attributes?.marksheet;
                    const marksheetUrl = marksheet?.url || marksheet?.data?.attributes?.url;

                    return (
                      <div key={result.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex-1">
                          <p className="font-medium text-slate-800">
                            {result.attributes?.exam?.data?.attributes?.title || result.exam?.title || 'Exam'}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-sm text-slate-500">
                              {new Date(result.createdAt || result.attributes?.createdAt).toLocaleDateString()}
                            </p>
                            {marksheetUrl && (
                              <button 
                                onClick={() => window.open(marksheetUrl, '_blank')}
                                className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                              >
                                <Eye className="w-3 h-3" />
                                View PDF
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                             <p className="text-2xl font-bold text-slate-800">
                               {result.marksObtained ?? result.attributes?.marksObtained}
                             </p>
                             <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                               status?.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                               status?.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                               'bg-red-100 text-red-700'
                             }`}>
                               {status?.label}
                             </span>
                          </div>
                          
                          <div className="relative">
                            <input
                              type="file"
                              accept=".pdf"
                              className="hidden"
                              id={`result-upload-${result.id}`}
                              onChange={(e) => handleResultFileChange(e, result.id)}
                            />
                            <button
                              disabled={uploadingResultId === result.id}
                              onClick={() => document.getElementById(`result-upload-${result.id}`).click()}
                              className={`p-2 rounded-lg transition-colors ${
                                marksheetUrl 
                                  ? 'text-emerald-500 hover:bg-emerald-50' 
                                  : 'text-slate-400 hover:text-primary hover:bg-slate-100'
                              }`}
                              title={marksheetUrl ? "Update Marksheet" : "Upload Marksheet"}
                            >
                              {uploadingResultId === result.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary/30 border-t-primary"></div>
                              ) : (
                                <Paperclip className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Result Entry Modal (Mirrored Certificate Logic) */}
      {addModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-100 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
               <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                 <Plus className="w-5 h-5 text-primary" />
                 Add Single Result
               </h3>
               <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                 <X className="w-5 h-5" />
               </button>
            </div>
            
            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const marksValue = formData.get('marks');
                const examValue = formData.get('examId');
                const studentValue = formData.get('studentId');
                const file = e.target.marksheet?.files?.[0];

                if (!marksValue || !examValue || !studentValue) {
                    alert('Please fill marks, exam and student fields.');
                    return;
                }

                // --- DUPLICATE CHECK: 1 result per student per exam ---
                const isDuplicate = results.some(r => {
                    const rStudentId = r.student?.id || r.attributes?.student?.data?.id || r.attributes?.student?.id;
                    const rExamId = r.exam?.id || r.attributes?.exam?.data?.id || r.attributes?.exam?.id;
                    return String(rStudentId) === String(studentValue) && String(rExamId) === String(examValue);
                });

                if (isDuplicate) {
                    alert('A result for this student and exam already exists. Please find and edit the existing result instead.');
                    return;
                }
                // ------------------------------------------------------

                setUploadingResultId('new');
                const result = await createResultWithMarksheet({
                    student: studentValue,
                    exam: examValue,
                    marksObtained: parseFloat(marksValue),
                    remarks: formData.get('remarks') || ''
                }, file);
                setUploadingResultId(null);

                if (result.success) {
                    setAddModalOpen(false);
                    fetchResults();
                } else {
                    alert(result.error || 'Failed to save result');
                }
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Student</label>
                <select name="studentId" defaultValue={selectedStudent?.id} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50 text-sm">
                   <option value="">Select Student...</option>
                   {students.map(s => (
                     <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.uid || 'No UID'})</option>
                   ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Examination</label>
                <select name="examId" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50 text-sm">
                   <option value="">Select Exam...</option>
                   {exams.filter(e => e.status !== 'cancelled').map(e => (
                     <option key={e.id} value={e.id}>{e.title} - {e.batch?.name || 'All Batch'}</option>
                   ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Marks Obtained</label>
                  <input type="number" step="0.01" name="marks" placeholder="00.0" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50 text-sm font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Academic Remarks</label>
                  <input type="text" name="remarks" placeholder="Optional comments..." className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50 text-sm italic" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Marksheet (PDF)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-xl hover:border-primary/50 transition-colors cursor-pointer group" onClick={() => document.getElementById('marksheet-input').click()}>
                   <input id="marksheet-input" type="file" name="marksheet" accept=".pdf" className="hidden" onChange={(e) => {
                     const fileName = e.target.files[0]?.name;
                     if (fileName) {
                       document.getElementById('file-name-display').textContent = fileName;
                     }
                   }} />
                   <div className="space-y-1 text-center">
                     <Upload className="mx-auto h-10 w-10 text-slate-300 group-hover:text-primary transition-colors" />
                     <div className="flex text-sm text-slate-600">
                       <span id="file-name-display">Click to upload marksheet PDF</span>
                     </div>
                   </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setAddModalOpen(false)} className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors">
                    Discard
                </button>
                <button 
                  type="submit" 
                  disabled={uploadingResultId === 'new'}
                  className="flex-[2] flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-secondary transition-colors disabled:opacity-50"
                >
                    {uploadingResultId === 'new' ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Commit Result
                      </>
                    )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentResultsPage;
