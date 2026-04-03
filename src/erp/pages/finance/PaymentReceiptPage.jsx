import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/ui/Button';
import { Upload, Download, FileText, File } from 'lucide-react';
import { paymentsApi } from '../../api/fees';
import client from '../../api/client';
import { getMediaUrl, PDF_MIME_TYPES, validateUploadFile } from '../../utils/helpers';

const PaymentReceiptPage = () => {
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const [payment, setPayment] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const loadPayment = async () => {
    try {
      const response = await paymentsApi.getById(id, {
        populate: {
          student: true,
          paymentSlip: true,
        },
      });
      setPayment(response.data?.data || null);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load payment receipt');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayment();
  }, [id]);

  const validateFile = (file) => {
    setError(null);
    const validationError = validateUploadFile(file, {
      allowedTypes: PDF_MIME_TYPES,
      label: 'Payment receipt',
      allowedLabel: 'a PDF file',
    });
    if (validationError) {
      setError(validationError);
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('files', selectedFile);

      const uploadResponse = await client.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const fileId = uploadResponse.data?.[0]?.id;
      await paymentsApi.update(id, { paymentSlip: fileId });
      setSelectedFile(null);
      await loadPayment();
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to upload receipt');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = () => {
    const receiptUrl = getMediaUrl(payment?.paymentSlip);
    if (!receiptUrl) return;

    const link = document.createElement('a');
    link.href = receiptUrl;
    link.download = payment?.paymentSlip?.name || `receipt_${payment?.receiptNumber || id}`;
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const receiptUrl = getMediaUrl(payment?.paymentSlip);
  const isPdf = payment?.paymentSlip?.mime?.includes('pdf');

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="print:hidden">
        <PageHeader
          title="Payment Receipt"
          subtitle="Upload, preview, and manage receipt files saved directly against the payment record in Strapi."
          backTo="/erp/payments"
        />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : receiptUrl ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <File className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-slate-800">Receipt Uploaded</p>
                <p className="text-sm text-slate-500">
                  Receipt #{payment?.receiptNumber || id}
                </p>
                <p className="text-xs text-slate-400">
                  {payment?.student?.firstName} {payment?.student?.lastName}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" icon="download" onClick={handleDownload}>
                Download
              </Button>
              <Button variant="ghost" icon="print" onClick={handlePrint}>
                Print
              </Button>
              <Button variant="ghost" onClick={() => fileInputRef.current?.click()}>
                Replace
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-4">
            {isPdf ? (
              <iframe
                src={receiptUrl}
                className="w-full h-[600px] rounded-lg"
                title="Receipt"
              />
            ) : (
              <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-12 text-center text-slate-500">
                Receipt preview is available for PDF files only.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <File className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              No Receipt Uploaded
            </h3>
            <p className="text-sm text-slate-500">
              Upload a PDF file. It will be saved directly to the payment in Strapi.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
              <span className="text-slate-500">Receipt Number:</span>
              <span className="font-mono font-medium text-slate-800">
                #{payment?.receiptNumber || id}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {selectedFile ? (
              <div className="border-2 border-dashed border-primary bg-primary/5 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium text-slate-800">{selectedFile.name}</p>
                      <p className="text-sm text-slate-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="text-slate-400 hover:text-red-500 text-2xl"
                  >
                    x
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-slate-200 rounded-xl p-8 hover:border-primary/50 transition-colors"
              >
                <div className="text-center">
                  <Upload className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600 font-medium">Click to select file</p>
                  <p className="text-xs text-slate-400 mt-1">PDF only, max 10MB</p>
                </div>
              </button>
            )}

            {selectedFile && (
              <Button
                variant="primary"
                onClick={handleUpload}
                loading={uploading}
                className="w-full"
                icon="upload"
              >
                Upload Receipt
              </Button>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media print {
          body * { visibility: hidden; }
          iframe, img, iframe *, img * { visibility: visible; }
          iframe, img { position: absolute; left: 0; top: 0; width: 100%; height: 100%; }
        }
      `}</style>
    </div>
  );
};

export default PaymentReceiptPage;
