import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import useStudentStore from '../../stores/studentStore';
import PageHeader from '../../components/common/PageHeader';
import { Award, Upload, Download, Eye, Search, Filter, X, FileText } from 'lucide-react';
import { PDF_MIME_TYPES, validateUploadFile } from '../../utils/helpers';

const CertificatesPage = () => {
  const { students, isLoading, fetchStudents, uploadCertificate } = useStudentStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.uid?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filterStatus || student.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleOpenUpload = (student) => {
    setSelectedStudent(student);
    setSelectedFile(null);
    setUploadError(null);
    setUploadModalOpen(true);
  };

  const validateFile = (file) => {
    setUploadError(null);
    const validationError = validateUploadFile(file, {
      allowedTypes: PDF_MIME_TYPES,
      label: 'Certificate file',
      allowedLabel: 'a PDF file',
    });
    if (validationError) {
      setUploadError(validationError);
      return false;
    }
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedStudent) return;
    
    setUploading(true);
    setUploadError(null);
    const result = await uploadCertificate(selectedStudent.id, selectedFile);
    setUploading(false);
    
    if (result.success) {
      setUploadModalOpen(false);
      fetchStudents();
    } else {
      setUploadError(result.error || 'Upload failed');
    }
  };

  const handleViewCertificate = (student) => {
    if (student.certificate?.url) {
      window.open(student.certificate.url, '_blank');
    } else {
      window.open(`/erp/students/${student.id}/certificate`, '_blank');
    }
  };

  const handleDownloadCertificate = (student) => {
    if (student.certificate?.url) {
      const link = document.createElement('a');
      link.href = student.certificate.url;
      link.download = `certificate_${student.uid || student.id}.pdf`;
      link.click();
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <PageHeader 
        title="Student Certificates" 
        subtitle="View and manage student completion certificates. Upload PDF certificates for completed students."
        actions={
          <button
            onClick={() => handleOpenUpload(null)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Certificate
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
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50 appearance-none cursor-pointer"
            >
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="active">Active</option>
              <option value="dropped">Dropped</option>
              <option value="suspended">Suspended</option>
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
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Certificate</th>
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
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No students found</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
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
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        student.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                        student.status === 'active' ? 'bg-blue-100 text-blue-700' :
                        student.status === 'dropped' ? 'bg-red-100 text-red-700' :
                        student.status === 'suspended' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {student.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {student.certificate ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                          Uploaded
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700">
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {student.certificate ? (
                          <>
                            <button
                              onClick={() => handleViewCertificate(student)}
                              className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
                              title="View Certificate"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDownloadCertificate(student)}
                              className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
                              title="Download Certificate"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleOpenUpload(student)}
                            className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
                            title="Upload Certificate"
                          >
                            <Upload className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
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

      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-100 overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Upload Certificate
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Select Student</label>
                <select 
                  value={selectedStudent?.id || ''} 
                  onChange={(e) => setSelectedStudent(students.find(s => s.id === parseInt(e.target.value)))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-white"
                >
                  <option value="">Select a student...</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.uid || 'No UID'})</option>
                  ))}
                </select>
              </div>

              {selectedStudent?.certificate && (
                <div className="mb-4 px-3 py-2 bg-amber-50 text-amber-700 text-xs rounded-lg flex items-center gap-2">
                  <Award className="w-4 h-4 shrink-0" />
                  <span>This student already has a certificate. Uploading a new one will replace the existing file.</span>
                </div>
              )}

              <p className="text-sm text-slate-600 mb-4">
                Upload certificate for <strong>{selectedStudent ? `${selectedStudent.firstName} ${selectedStudent.lastName}` : 'selected student'}</strong>
              </p>
              
              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  selectedFile ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary/50'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {selectedFile ? (
                  <div>
                    <FileText className="w-12 h-12 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-800">{selectedFile.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">Click to select PDF file</p>
                  <p className="text-xs text-slate-400 mt-1">Only PDF files, max 10MB</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setUploadModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
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

export default CertificatesPage;
