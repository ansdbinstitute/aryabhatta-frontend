import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useStudentStore from '../../stores/studentStore';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/ui/Button';
import LoadingScreen from '../../components/common/LoadingScreen';
import { Download, Upload, FileText, Eye, X } from 'lucide-react';
import { PDF_MIME_TYPES, validateUploadFile } from '../../utils/helpers';

const CertificatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentStudent, fetchStudentById, clearCurrentStudent, uploadCertificate, isLoading } = useStudentStore();
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchStudentById(id);
    }
    return () => clearCurrentStudent();
  }, [id, fetchStudentById, clearCurrentStudent]);

  if (isLoading || !currentStudent) return <LoadingScreen />;

  const hasCertificate = currentStudent.certificate?.url;
  const certificateUrl = currentStudent.certificate?.url;

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
    if (!selectedFile) return;
    
    setUploading(true);
    setUploadError(null);
    const result = await uploadCertificate(currentStudent.id, selectedFile);
    setUploading(false);
    
    if (result.success) {
      setShowUpload(false);
      setSelectedFile(null);
    } else {
      setUploadError(result.error || 'Upload failed');
    }
  };

  const handleDownload = () => {
    if (certificateUrl) {
      const link = document.createElement('a');
      link.href = certificateUrl;
      link.download = `certificate_${currentStudent.uid || currentStudent.id}.pdf`;
      link.click();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="print:hidden">
        <PageHeader
          title="Student Certificate"
          subtitle="View and manage student completion certificate."
          actions={
            <div className="flex items-center gap-2">
              {hasCertificate ? (
                <>
                  <Button variant="ghost" icon="print" onClick={handlePrint}>
                    Print
                  </Button>
                  <Button variant="primary" icon="download" onClick={handleDownload}>
                    Download
                  </Button>
                </>
              ) : (
                <Button variant="primary" icon="upload" onClick={() => setShowUpload(true)}>
                  Upload Certificate
                </Button>
              )}
            </div>
          }
        />
      </div>

      {hasCertificate ? (
        <div className="flex justify-center mt-8 print:mt-0">
          <div className="w-full max-w-2xl">
            <iframe
              src={certificateUrl}
              className="w-full h-[600px] border border-slate-200 rounded-xl shadow-lg"
              title="Certificate"
            />
          </div>
        </div>
      ) : showUpload ? (
        <div className="mt-8 max-w-md mx-auto">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Upload Certificate for {currentStudent.firstName} {currentStudent.lastName}
            </h3>
            
            {uploadError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                {uploadError}
              </div>
            )}
            
            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                selectedFile ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary/50'
              }`}
              onClick={() => document.getElementById('cert-file')?.click()}
            >
              <input
                id="cert-file"
                type="file"
                accept=".pdf,application/pdf"
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
              <Button
                variant="ghost"
                onClick={() => {
                  setShowUpload(false);
                  setSelectedFile(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                loading={uploading}
                className="flex-1"
                icon="upload"
              >
                Upload
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-16 text-center">
          <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-12 h-12 text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">No Certificate Uploaded</h2>
          <p className="text-slate-500 mb-6">
            {currentStudent.firstName} {currentStudent.lastName} does not have a certificate uploaded yet.
          </p>
          <Button variant="primary" icon="upload" onClick={() => setShowUpload(true)}>
            Upload Certificate
          </Button>
        </div>
      )}

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          iframe, iframe * {
            visibility: visible;
          }
          iframe {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default CertificatePage;
