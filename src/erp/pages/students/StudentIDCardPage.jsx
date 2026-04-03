import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CreditCard, Download, Image as ImageIcon, Upload } from 'lucide-react';
import useStudentStore from '../../stores/studentStore';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/ui/Button';
import LoadingScreen from '../../components/common/LoadingScreen';
import { JPEG_MIME_TYPES, validateUploadFile } from '../../utils/helpers';

const StudentIDCardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentStudent,
    fetchStudentById,
    clearCurrentStudent,
    uploadIdCardFront,
    uploadIdCardBack,
    isLoading,
  } = useStudentStore();
  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);
  const [selectedFrontFile, setSelectedFrontFile] = useState(null);
  const [selectedBackFile, setSelectedBackFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchStudentById(id);
    }
    return () => clearCurrentStudent();
  }, [id, fetchStudentById, clearCurrentStudent]);

  if (isLoading || !currentStudent) return <LoadingScreen />;

  const frontImageUrl = currentStudent.idCardFront?.url || null;
  const backImageUrl = currentStudent.idCardBack?.url || null;
  const hasUploadedIdCard = !!(frontImageUrl || backImageUrl);

  const validateFile = (file) => {
    setError(null);
    const validationError = validateUploadFile(file, {
      allowedTypes: JPEG_MIME_TYPES,
      label: 'ID card image',
      allowedLabel: 'a JPEG image',
    });
    if (validationError) {
      setError(validationError);
      return false;
    }
    return true;
  };

  const handleFrontFileChange = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      setSelectedFrontFile(file);
    }
  };

  const handleBackFileChange = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      setSelectedBackFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFrontFile && !selectedBackFile) return;

    setUploading(true);
    setError(null);

    if (selectedFrontFile) {
      const frontResult = await uploadIdCardFront(currentStudent.id, selectedFrontFile);
      if (!frontResult.success) {
        setUploading(false);
        setError(frontResult.error || 'Front image upload failed');
        return;
      }
    }

    if (selectedBackFile) {
      const backResult = await uploadIdCardBack(currentStudent.id, selectedBackFile);
      if (!backResult.success) {
        setUploading(false);
        setError(backResult.error || 'Back image upload failed');
        return;
      }
    }

    setSelectedFrontFile(null);
    setSelectedBackFile(null);
    setUploading(false);
    fetchStudentById(id);
  };

  const handleDownload = (url, suffix) => {
    if (!url) return;

    const link = document.createElement('a');
    link.href = url;
    link.download = `id_card_${currentStudent.uid || currentStudent.id}_${suffix}.jpg`;
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="print:hidden">
        <PageHeader
          title="Student ID Card"
          subtitle="Upload and manage front and back ID card images linked to the student's UID."
          actions={
            <>
              <Button variant="accent" onClick={() => frontInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Front
              </Button>
              <Button variant="accent" onClick={() => backInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Back
              </Button>
            </>
          }
        />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      <div className="bg-slate-50 rounded-xl p-4 mb-6 text-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-slate-500">Student:</span>
            <span className="ml-2 font-medium text-slate-800">
              {currentStudent.firstName} {currentStudent.lastName}
            </span>
          </div>
          <div>
            <span className="text-slate-500">UID:</span>
            <span className="ml-2 font-mono text-slate-800">
              {currentStudent.uid || 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-slate-500">Linked ID Card UID:</span>
            <span className="ml-2 font-mono text-slate-800">
              {currentStudent.idCardUid || currentStudent.uid || 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-slate-500">Batch:</span>
            <span className="ml-2 text-slate-800">
              {currentStudent.batch?.name || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {hasUploadedIdCard ? (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-700">Front Side</h3>
              {frontImageUrl ? (
                <img
                  src={frontImageUrl}
                  alt="Student ID Card Front"
                  className="w-full rounded-xl shadow-xl border border-slate-200"
                />
              ) : (
                <div className="min-h-72 rounded-xl border border-dashed border-slate-200 bg-white flex items-center justify-center text-slate-400">
                  Front image not uploaded
                </div>
              )}
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-700">Back Side</h3>
              {backImageUrl ? (
                <img
                  src={backImageUrl}
                  alt="Student ID Card Back"
                  className="w-full rounded-xl shadow-xl border border-slate-200"
                />
              ) : (
                <div className="min-h-72 rounded-xl border border-dashed border-slate-200 bg-white flex items-center justify-center text-slate-400">
                  Back image not uploaded
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 print:hidden">
            {frontImageUrl && (
              <Button variant="primary" icon="download" onClick={() => handleDownload(frontImageUrl, 'front')}>
                Download Front
              </Button>
            )}
            {backImageUrl && (
              <Button variant="primary" icon="download" onClick={() => handleDownload(backImageUrl, 'back')}>
                Download Back
              </Button>
            )}
            <Button variant="ghost" icon="print" onClick={handlePrint}>
              Print
            </Button>
            <Button variant="ghost" onClick={() => frontInputRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Front
            </Button>
            <Button variant="ghost" onClick={() => backInputRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Back
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              No ID Card Images Uploaded
            </h3>
            <p className="text-sm text-slate-500">
              Upload front and back images. They will be linked to the student's UID automatically.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mt-6 print:hidden">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-slate-800">Upload Or Replace ID Card Images</h3>
          <p className="text-sm text-slate-500">
            Front and back images uploaded here will be assigned to student UID
            <span className="ml-1 font-mono">{currentStudent.idCardUid || currentStudent.uid || 'N/A'}</span>.
          </p>
        </div>
        <div className="space-y-4">
          <input
            ref={frontInputRef}
            type="file"
            accept=".jpg,.jpeg,image/jpeg"
            onChange={handleFrontFileChange}
            className="hidden"
          />
          <input
            ref={backInputRef}
            type="file"
            accept=".jpg,.jpeg,image/jpeg"
            onChange={handleBackFileChange}
            className="hidden"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <button
              onClick={() => frontInputRef.current?.click()}
              className="w-full border-2 border-dashed border-slate-200 rounded-xl p-8 hover:border-primary/50 transition-colors"
            >
              <div className="text-center">
                <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 font-medium">
                  {selectedFrontFile ? selectedFrontFile.name : 'Select front image'}
                </p>
                <p className="text-xs text-slate-400 mt-1">JPEG only, max 10MB</p>
              </div>
            </button>

            <button
              onClick={() => backInputRef.current?.click()}
              className="w-full border-2 border-dashed border-slate-200 rounded-xl p-8 hover:border-primary/50 transition-colors"
            >
              <div className="text-center">
                <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 font-medium">
                  {selectedBackFile ? selectedBackFile.name : 'Select back image'}
                </p>
                <p className="text-xs text-slate-400 mt-1">JPEG only, max 10MB</p>
              </div>
            </button>
          </div>

          {(selectedFrontFile || selectedBackFile) && (
            <Button
              variant="primary"
              onClick={handleUpload}
              loading={uploading}
              className="w-full"
              icon="upload"
            >
              Upload ID Card Images
            </Button>
          )}
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          img { visibility: visible; }
        }
      `}</style>
    </div>
  );
};

export default StudentIDCardPage;
