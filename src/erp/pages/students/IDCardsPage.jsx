import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import useStudentStore from '../../stores/studentStore';
import PageHeader from '../../components/common/PageHeader';
import { CreditCard, Upload, Download, Eye, Search, Filter, X, Image, CheckCircle } from 'lucide-react';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const IDCardsPage = () => {
  const { students, isLoading, fetchStudents, uploadIdCardFront, uploadIdCardBack } = useStudentStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBatch, setFilterBatch] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.uid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBatch = !filterBatch || student.batch?.id === parseInt(filterBatch);
    
    return matchesSearch && matchesBatch;
  });

  const batches = [...new Set(students.map(s => s.batch).filter(Boolean))];

  const handleOpenUpload = (student) => {
    setSelectedStudent(student);
    setFrontFile(null);
    setBackFile(null);
    setUploadError(null);
    setUploadModalOpen(true);
  };

  const handleOpenUploadByUid = () => {
    setSelectedStudent(null);
    setFrontFile(null);
    setBackFile(null);
    setUploadError(null);
    setUploadModalOpen(true);
  };

  const handleStudentSelect = (studentId) => {
    const student = students.find((entry) => entry.id === Number(studentId)) || null;
    setSelectedStudent(student);
    setUploadError(null);
  };

  const validateFile = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      setUploadError('File must be under 10MB');
      return false;
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Only JPEG and PNG files are allowed');
      return false;
    }
    return true;
  };

  const handleFrontFileChange = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      setFrontFile(file);
      setUploadError(null);
    }
  };

  const handleBackFileChange = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      setBackFile(file);
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedStudent) return;
    if (!frontFile && !backFile) {
      setUploadError('Please select at least one file to upload');
      return;
    }
    
    setUploading(true);
    setUploadError(null);

    try {
      if (frontFile) {
        const frontResult = await uploadIdCardFront(selectedStudent.id, frontFile);
        if (!frontResult.success) {
          throw new Error(frontResult.error || 'Failed to upload front image');
        }
      }

      if (backFile) {
        const backResult = await uploadIdCardBack(selectedStudent.id, backFile);
        if (!backResult.success) {
          throw new Error(backResult.error || 'Failed to upload back image');
        }
      }

      await fetchStudents();
      setUploadModalOpen(false);
    } catch (error) {
      setUploadError(error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handlePrintCard = (studentId) => {
    window.open(`/erp/students/${studentId}/id-card`, '_blank');
  };

  const handlePrintAll = () => {
    const studentsWithCards = filteredStudents.filter(s => s.idCardFront?.url || s.idCardBack?.url);
    studentsWithCards.forEach(student => {
      window.open(`/erp/students/${student.id}/id-card`, '_blank');
    });
  };

  const hasBothImages = (student) => {
    return !!(student.idCardFront?.url && student.idCardBack?.url);
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <PageHeader 
        title="Student ID Cards" 
        subtitle="View, upload, and print student ID cards with front/back images."
        actions={
          <>
            <div className="text-xs text-slate-500">
              Select a student card below or use `Upload By UID`.
            </div>
            <button
              onClick={handleOpenUploadByUid}
              disabled={students.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-primary rounded-lg font-semibold hover:opacity-90 transition-colors disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              Upload By UID
            </button>
            <button
              onClick={handlePrintAll}
              disabled={filteredStudents.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
            >
              <CreditCard className="w-4 h-4" />
              Print All Cards
            </button>
          </>
        }
      />

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, UID, or email..."
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-slate-200 rounded-xl h-48 mb-3"></div>
                <div className="bg-slate-200 h-4 w-3/4 rounded"></div>
              </div>
            ))
          ) : filteredStudents.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400">
              <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No students found</p>
              <button
                onClick={handleOpenUploadByUid}
                disabled={students.length === 0}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-accent text-primary rounded-lg font-semibold hover:opacity-90 transition-colors disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                Upload By UID
              </button>
            </div>
          ) : (
            filteredStudents.map(student => (
              <div key={student.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {student.firstName?.charAt(0) || 'S'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 truncate">
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">{student.uid || 'No UID'}</p>
                    <p className="text-xs text-slate-500 truncate">{student.batch?.name || 'No batch'}</p>
                  </div>
                </div>

                <div className="text-xs text-slate-500 mb-3">
                  <p>{student.email}</p>
                  <p>{student.phone || 'No phone'}</p>
                  <p className="font-mono text-slate-400">
                    ID Card UID: {student.idCardUid || student.uid || 'Not linked'}
                  </p>
                </div>

                <div className="flex gap-2 mb-3">
                  <div className={`flex-1 px-2 py-1.5 rounded-md text-xs flex items-center gap-1.5 ${
                    student.idCardFront?.url 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    <Image className="w-3.5 h-3.5" />
                    {student.idCardFront?.url ? 'Front' : 'No Front'}
                  </div>
                  <div className={`flex-1 px-2 py-1.5 rounded-md text-xs flex items-center gap-1.5 ${
                    student.idCardBack?.url 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    <Image className="w-3.5 h-3.5" />
                    {student.idCardBack?.url ? 'Back' : 'No Back'}
                  </div>
                </div>

                {hasBothImages(student) && (
                  <div className="mb-3 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-md flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    ID Card Complete
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenUpload(student)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-accent text-primary rounded-lg text-xs font-semibold hover:opacity-90 transition-colors"
                    title="Upload ID Card Images"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload
                  </button>
                  <Link
                    to={`/erp/students/${student.id}/id-card`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-primary hover:text-white hover:border-primary transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </Link>
                  <button
                    onClick={() => handlePrintCard(student.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-secondary transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Print
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {filteredStudents.length > 0 && (
          <div className="p-4 border-t border-slate-100 text-center text-sm text-slate-500">
            Showing {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-100 overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Upload ID Card Images
              </h3>
              <button 
                onClick={() => setUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Student <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedStudent?.id || ''}
                  onChange={(e) => handleStudentSelect(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-white"
                >
                  <option value="">Choose a student by UID...</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.uid || 'NO-UID'} - {student.firstName} {student.lastName}
                    </option>
                  ))}
                </select>
              </div>

              {selectedStudent?.idCardFront && (
                <div className="mb-4 px-3 py-2 bg-amber-50 text-amber-700 text-xs rounded-lg flex items-center gap-2">
                  <CreditCard className="w-4 h-4 shrink-0" />
                  <span>ID Card images already exist. New uploads will replace current ones.</span>
                </div>
              )}

              {!selectedStudent && (
                <div className="mb-4 px-3 py-2 bg-amber-50 text-amber-700 text-sm rounded-lg">
                  Select a student first. The uploaded images will be assigned to that student's UID.
                </div>
              )}

              <p className="text-sm text-slate-600 mb-4">
                Upload ID card images for <strong>{selectedStudent?.firstName || 'selected student'} {selectedStudent?.lastName || ''}</strong>
              </p>
              <p className="text-xs text-slate-500 mb-4">
                UID: <span className="font-mono font-medium">{selectedStudent?.uid || 'Not assigned'}</span>
              </p>
              <p className="text-xs text-slate-500 mb-4">
                Uploaded images will be linked to this UID automatically.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Front Side</label>
                  <div 
                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                      frontFile ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary/50'
                    }`}
                    onClick={() => selectedStudent && frontInputRef.current?.click()}
                  >
                    <input
                      ref={frontInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFrontFileChange}
                      className="hidden"
                    />
                    {frontFile ? (
                      <div>
                        <CheckCircle className="w-8 h-8 text-primary mx-auto mb-1" />
                        <p className="text-xs font-medium text-slate-800 truncate">{frontFile.name}</p>
                        <p className="text-xs text-slate-500">{(frontFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    ) : selectedStudent?.idCardFront?.url ? (
                      <div>
                        <Image className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
                        <p className="text-xs text-emerald-600">Front uploaded</p>
                        <p className="text-xs text-slate-400 mt-1">Click to replace</p>
                      </div>
                    ) : (
                      <div>
                        <Image className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                        <p className="text-xs text-slate-500">Click to select</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Back Side</label>
                  <div 
                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                      backFile ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary/50'
                    }`}
                    onClick={() => selectedStudent && backInputRef.current?.click()}
                  >
                    <input
                      ref={backInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleBackFileChange}
                      className="hidden"
                    />
                    {backFile ? (
                      <div>
                        <CheckCircle className="w-8 h-8 text-primary mx-auto mb-1" />
                        <p className="text-xs font-medium text-slate-800 truncate">{backFile.name}</p>
                        <p className="text-xs text-slate-500">{(backFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    ) : selectedStudent?.idCardBack?.url ? (
                      <div>
                        <Image className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
                        <p className="text-xs text-emerald-600">Back uploaded</p>
                        <p className="text-xs text-slate-400 mt-1">Click to replace</p>
                      </div>
                    ) : (
                      <div>
                        <Image className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                        <p className="text-xs text-slate-500">Click to select</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {uploadError && (
                <div className="mb-4 px-3 py-2 bg-red-50 text-red-600 text-sm rounded-lg">
                  {uploadError}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setUploadModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!selectedStudent || (!frontFile && !backFile) || uploading}
                  className="flex-[2] flex justify-center items-center gap-2 px-4 py-2.5 bg-primary text-white font-medium rounded-xl transition-colors disabled:opacity-70"
                >
                  {uploading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IDCardsPage;
