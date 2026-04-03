import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CreditCard, FileText, Search, Upload, X } from 'lucide-react';
import useFinanceStore from '../../stores/financeStore';
import useStudentStore from '../../stores/studentStore';
import PageHeader from '../../components/common/PageHeader';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import client from '../../api/client';
import { PDF_MIME_TYPES, validateUploadFile } from '../../utils/helpers';

const RecordPaymentPage = () => {
  const navigate = useNavigate();
  const { students, fetchStudents, isLoading: studentsLoading } = useStudentStore();
  const { recordPayment, isLoading } = useFinanceStore();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentSearch, setStudentSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      studentId: '',
      amount: '',
      paymentMethod: 'cash',
      referenceNumber: '',
      paymentDate: new Date().toISOString().split('T')[0]
    }
  });

  const studentId = watch('studentId');

  useEffect(() => {
    fetchStudents({ status: 'active' });
  }, [fetchStudents]);

  useEffect(() => {
    if (studentId && students.length > 0) {
      // Match on integerId (real DB integer stored by extractData)
      const found = students.find(
        (student) => (student.integerId || student.id).toString() === studentId.toString()
      );
      setSelectedStudent(found || null);
    } else {
      setSelectedStudent(null);
    }
  }, [studentId, students]);

  const courseOptions = [...new Map(
    students
      .filter((student) => student.course?.id)
      .map((student) => [student.course.id, student.course])
  ).values()];

  const filteredStudents = students.filter((student) => {
    const search = studentSearch.trim().toLowerCase();
    const matchesSearch =
      !search ||
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(search) ||
      (student.uid || '').toLowerCase().includes(search) ||
      (student.email || '').toLowerCase().includes(search);

    const matchesCourse =
      !courseFilter || student.course?.id?.toString() === courseFilter.toString();

    return matchesSearch && matchesCourse;
  });

  const validateFile = (file) => {
    setUploadError(null);
    const validationError = validateUploadFile(file, {
      allowedTypes: PDF_MIME_TYPES,
      label: 'Payment slip',
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
      setPaymentSlip(file);
    }
  };

  const uploadPaymentSlip = async (file) => {
    try {
      const formData = new FormData();
      formData.append('files', file);
      const response = await client.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data[0].id;
    } catch (err) {
      throw new Error(err.response?.data?.error?.message || err.message);
    }
  };

  const onSubmit = async (data) => {
    try {
      let paymentSlipId = null;

      if (paymentSlip) {
        paymentSlipId = await uploadPaymentSlip(paymentSlip);
      }

      const payload = {
        // Use the integer DB id for the relation — not the documentId string
        student: data.studentId,
        amount: parseFloat(data.amount),
        paymentMethod: data.paymentMethod,
        paymentDate: data.paymentDate,
        referenceNumber: data.referenceNumber,
        status: 'completed',
      };

      if (paymentSlipId) {
        payload.paymentSlip = paymentSlipId;
      }

      const res = await recordPayment(payload);
      if (res?.data) {
        navigate(`/erp/payments/${res.data.documentId || res.data.id}/receipt`);
      }
    } catch (err) {
      setUploadError(err.message || 'Failed to record payment');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Record Payment"
        subtitle="Add manual payment details by student name, UID, and course, with an optional PDF payment slip"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Find Student
            </h3>

            <div className="space-y-4 mb-4">
              <Input
                label="Search Student"
                icon="search"
                placeholder="Name, UID, or email"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
              />
              <Select
                label="Filter By Course"
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                options={courseOptions.map((course) => ({
                  label: course.title,
                  value: course.id,
                }))}
                placeholder="All courses"
              />
            </div>

            <Select
              label="Student"
              {...register('studentId', { required: 'Student is required' })}
              error={errors.studentId?.message}
              options={filteredStudents.map((student) => ({
                label: `${student.firstName} ${student.lastName} | ${student.uid || 'Pending UID'} | ${student.course?.title || 'No course'}`,
                // Use integerId (real integer FK) — not the documentId string
                value: student.integerId || student.id
              }))}
              placeholder={filteredStudents.length ? 'Select student...' : 'No students match filters'}
              disabled={studentsLoading}
            />

            {selectedStudent && (
              <div className="mt-6 pt-6 border-t animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-400">
                    {selectedStudent.firstName[0]}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">
                      {selectedStudent.firstName} {selectedStudent.lastName}
                    </p>
                    <p className="text-sm text-slate-500 font-mono">{selectedStudent.uid}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm bg-slate-50 p-4 rounded-lg border">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Course:</span>
                    <span className="font-medium text-slate-800 text-right">{selectedStudent.course?.title || 'None'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">UID:</span>
                    <span className="font-mono text-slate-800">{selectedStudent.uid || 'Pending'}</span>
                  </div>
                  <div className="flex justify-between mt-2 pt-2 border-t">
                    <span className="text-slate-500">Total Fees:</span>
                    <span className="font-bold text-slate-800">₹{Number(selectedStudent.totalFee || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Payment Slip (Optional)
            </h3>
            <p className="text-sm text-slate-500 mb-4">Upload a PDF copy of the payment slip or receipt</p>

            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                paymentSlip ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary/50'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              {paymentSlip ? (
                <div>
                  <FileText className="w-10 h-10 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-800">{paymentSlip.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{(paymentSlip.size / 1024 / 1024).toFixed(2)} MB</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPaymentSlip(null);
                    }}
                    className="mt-2 text-xs text-red-500 hover:text-red-600 flex items-center gap-1 mx-auto"
                  >
                    <X className="w-3 h-3" />
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Click to select PDF</p>
                  <p className="text-xs text-slate-400 mt-1">Maximum file size: 10MB</p>
                </div>
              )}
            </div>

            {uploadError && (
              <div className="mt-3 px-3 py-2 bg-red-50 text-red-600 text-xs rounded-lg">
                {uploadError}
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Payment Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Amount (₹)"
                type="number"
                placeholder="0.00"
                min="1"
                {...register('amount', { required: 'Amount is required', min: 1 })}
                error={errors.amount?.message}
              />
              <Input
                label="Payment Date"
                type="date"
                {...register('paymentDate', { required: 'Date is required' })}
                error={errors.paymentDate?.message}
              />

              <Select
                label="Payment Method"
                {...register('paymentMethod')}
                options={[
                  { label: 'Cash', value: 'cash' },
                  { label: 'Bank Transfer (NEFT/RTGS)', value: 'bank_transfer' },
                  { label: 'UPI', value: 'upi' },
                  { label: 'Credit/Debit Card', value: 'card' }
                ]}
              />

              <Input
                label="Reference / Transaction No. (Optional)"
                placeholder="e.g. UPI Ref # or cheque details"
                {...register('referenceNumber')}
              />
            </div>

            <div className="mt-8 pt-6 border-t flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => navigate('/erp/payments')}>
                Cancel
              </Button>
              <Button type="submit" loading={isLoading} disabled={!selectedStudent} icon="payment">
                Record Payment & Generate TXN
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RecordPaymentPage;
