import React, { useEffect, useState } from 'react';
import useMaterialStore from '../../stores/materialStore';
import useCourseStore from '../../stores/courseStore';
import useAuthStore from '../../stores/authStore';
import useStudentAuthStore from '../../../student/stores/studentAuthStore';
import PageHeader from '../../components/common/PageHeader';
import useCurrentStudent from '../../../student/hooks/useCurrentStudent';
import { FileText, Link as LinkIcon, Download, Trash2, Link, Filter, Upload, X, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { getMediaUrl, PDF_MIME_TYPES, validateUploadFile } from '../../utils/helpers';

const StudyMaterialPage = () => {
  const { materials, fetchMaterials, uploadMaterial, createMaterial, deleteMaterial, isLoading } = useMaterialStore();
  const { courses, batches, fetchCourses, fetchBatches } = useCourseStore();
  const erpUser = useAuthStore(s => s.user);
  const studentUser = useStudentAuthStore(s => s.user);
  const isStudent = studentUser?.roleType === 'student' || window.location.pathname.startsWith('/student');
  const user = isStudent ? studentUser : erpUser;
  const { student, isLoading: studentLoading } = useCurrentStudent();

  const [activeCourse, setActiveCourse] = useState('');
  const [activeBatch, setActiveBatch] = useState('');
  const [activeType, setActiveType] = useState('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const { register, handleSubmit, watch, reset } = useForm({
    defaultValues: { type: 'document' }
  });

  const selectedType = watch('type');
  const selectedCourse = watch('course');

  useEffect(() => {
    fetchCourses();
    fetchBatches();
  }, []);

  useEffect(() => {
    if (isStudent) {
      if (studentLoading) return; // Wait for profile
      
      if (student?.course?.id) {
        console.log('[StudyMaterial] Fetching for Student:', { course: student.course.id, batch: student.batch?.id });
        fetchMaterials({
          course: student.course.id,
          batch: student.batch?.id || null,
          type: activeType,
          isStudentView: true
        });
      }
      return;
    }

    fetchMaterials({ course: activeCourse, batch: activeBatch, type: activeType });
  }, [activeCourse, activeBatch, activeType, isStudent, student?.course?.id, student?.batch?.id, fetchMaterials]);

  const filteredBatches = batches.filter(b => selectedCourse ? b.course?.documentId === selectedCourse : true);

  const onSubmit = async (data) => {
    setUploadError(null);
    setIsUploading(true);

    let fileId = null;

    if (data.type === 'document') {
      const file = data.fileList?.[0];
      if (!file) {
        setUploadError('Please select a file to upload.');
        setIsUploading(false);
        return;
      }
      const validationError = validateUploadFile(file, {
        allowedTypes: PDF_MIME_TYPES,
        label: 'Study material file',
        allowedLabel: 'a PDF file',
      });
      if (validationError) {
        setUploadError(validationError);
        setIsUploading(false);
        return;
      }

      const res = await uploadMaterial(file);
      if (!res.success) {
        setUploadError(res.error);
        setIsUploading(false);
        return;
      }
      fileId = res.fileId;
    }

      const payload = {
        title: data.title,
        description: data.description,
        type: data.type,
        course: data.course,
        batch: data.batch || null,
        uploadedBy: user?.id,
        url: data.type === 'link' ? data.url : null,
      file: fileId
    };

    const createRes = await createMaterial(payload);
    setIsUploading(false);

    if (createRes.success) {
      reset();
      setIsModalOpen(false);
    } else {
      setUploadError(createRes.error);
    }
  };

  const getTypeIcon = (type) => {
    if (type === 'document') return <FileText className="w-5 h-5 text-indigo-500" />;
    return <LinkIcon className="w-5 h-5 text-emerald-500" />;
  };

  const getMaterialUrl = (material) => (
    material.type === 'link' ? material.url : getMediaUrl(material.file)
  );

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <PageHeader
          title={isStudent ? 'Study Materials' : 'Study Materials DB'}
          subtitle={
            isStudent
              ? 'Open the learning files and links assigned to your course and batch.'
              : 'Upload course-specific study materials that students can access by their enrolled course.'
          }
        />
        {!isStudent && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-sm whitespace-nowrap"
          >
            <Upload className="w-5 h-5" />
            Upload Material
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-slate-500 mr-2">
          <Filter className="w-5 h-5" />
          <span className="font-semibold text-sm">Filters:</span>
        </div>
        
        <select 
          value={activeCourse} 
          onChange={(e) => setActiveCourse(e.target.value)}
          className="bg-white text-slate-800 border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">All Courses</option>
          {courses.map(c => <option key={c.documentId} value={c.documentId} className="bg-white text-slate-800">{c.title}</option>)}
        </select>

        <select 
          value={activeBatch} 
          onChange={(e) => setActiveBatch(e.target.value)}
          className="bg-white text-slate-800 border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">All Batches</option>
          {batches.map(b => <option key={b.documentId} value={b.documentId} className="bg-white text-slate-800">{b.name}</option>)}
        </select>

        <select 
          value={activeType} 
          onChange={(e) => setActiveType(e.target.value)}
          className="bg-white text-slate-800 border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="all" className="bg-white text-slate-800">All Types</option>
          <option value="document" className="bg-white text-slate-800">Documents / PDFs</option>
          <option value="link" className="bg-white text-slate-800">External Links</option>
        </select>
      </div>

      {(isLoading || (isStudent && studentLoading)) && materials.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="text-slate-500 text-sm font-medium">Loading materials...</p>
          </div>
        </div>
      ) : materials.length === 0 ? (
        <div className="bg-white border text-center border-slate-100 rounded-2xl p-16 shadow-sm">
          <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700">No materials found.</h3>
          <p className="text-sm text-slate-400 mt-2">Upload study materials to populate this course directory.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {materials.map(m => (
            <div key={m.id} className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col">
              <div className="p-5 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    {getTypeIcon(m.type)}
                  </div>
                  {/* Delete button (only show if uploaded by current user or admin - for simplicity, assuming active role can delete since they are looking at it) */}
                  {!isStudent && (
                    <button 
                      onClick={() => deleteMaterial(m.documentId)}
                      title="Delete Material"
                      className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <h3 className="font-bold text-slate-800 text-base mb-2 line-clamp-2" title={m.title}>{m.title}</h3>
                {m.description && <p className="text-sm text-slate-500 line-clamp-2 mb-4">{m.description}</p>}
                
                <div className="space-y-1.5 mt-auto">
                  <div className="text-xs font-semibold text-slate-600 bg-slate-50 px-2 py-1 rounded inline-block">
                    {m.course?.title || 'General Material'}
                  </div>
                  {m.batch && (
                    <div className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded inline-block ml-2">
                      {m.batch.name}
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-100 p-3 bg-slate-50/50 flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  By {m.uploadedBy?.username || 'System'}
                </span>
                
                <a 
                  href={getMaterialUrl(m)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm hover:border-indigo-200"
                >
                  {m.type === 'document' ? <Download className="w-3.5 h-3.5" /> : <Link className="w-3.5 h-3.5" />}
                  Open
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {!isStudent && isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Upload Study Material</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              {uploadError && (
                <div className="p-3 bg-red-50 text-red-700 text-sm font-semibold rounded-lg border border-red-200">
                  {uploadError}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Title *</label>
                <input
                  {...register('title', { required: true })}
                  type="text"
                  placeholder="e.g. Chapter 1: Foundations"
                  className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Description (Optional)</label>
                <textarea
                  {...register('description')}
                  rows="2"
                  className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Student Course Assignment *</label>
                  <select
                    {...register('course', { required: true })}
                    className="w-full bg-white text-slate-800 rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  >
                    <option value="" className="bg-white text-slate-800">Select student course</option>
                    {courses.map(c => <option key={c.documentId} value={c.documentId} className="bg-white text-slate-800">{c.title}</option>)}
                  </select>
                  <p className="mt-1 text-[11px] text-slate-400">Each material is attached to a course so only the relevant student group can receive it properly.</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Batch Assignment (Optional)</label>
                  <select
                    {...register('batch')}
                    className="w-full bg-white text-slate-800 rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm disabled:bg-slate-50 disabled:opacity-50"
                    disabled={!selectedCourse}
                  >
                    <option value="" className="bg-white text-slate-800">All Batches in Course</option>
                    {filteredBatches.map(b => <option key={b.documentId} value={b.documentId} className="bg-white text-slate-800">{b.name}</option>)}
                  </select>
                  <p className="mt-1 text-[11px] text-slate-400">Leave batch empty to make the material available to all students in the selected course.</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Material Type</label>
                <div className="grid grid-cols-3 gap-3">
                  <label className={`border rounded-lg p-3 text-center cursor-pointer transition-colors ${selectedType === 'document' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-slate-300'}`}>
                    <input type="radio" value="document" {...register('type')} className="sr-only" />
                    <FileText className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs font-bold block">Document</span>
                  </label>
                  <label className={`col-span-2 border rounded-lg p-3 text-center cursor-pointer transition-colors ${selectedType === 'link' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-slate-200 hover:border-slate-300'}`}>
                    <input type="radio" value="link" {...register('type')} className="sr-only" />
                    <LinkIcon className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs font-bold block">Ext. Link</span>
                  </label>
                </div>
              </div>

              {selectedType === 'document' ? (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                  <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-600 mb-1">Select file to upload</p>
                  <p className="text-xs text-slate-400 mb-4">Max file size: 10MB</p>
                  <input 
                    type="file" 
                    {...register('fileList')} 
                    accept=".pdf,application/pdf"
                    className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">URL Link *</label>
                  <input
                    {...register('url')}
                    type="url"
                    placeholder="https://..."
                    className="w-full rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                  />
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isUploading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold rounded-lg transition-colors shadow-sm"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Commit Material
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

export default StudyMaterialPage;
