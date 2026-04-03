import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Download, Edit2, FileText, X } from 'lucide-react';
import useFinanceStore from '../../stores/financeStore';
import useStudentStore from '../../stores/studentStore';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const PaymentListPage = () => {
  const navigate = useNavigate();
  const { payments, fetchPayments, updatePayment, isLoading } = useFinanceStore();
  const { students, fetchStudents } = useStudentStore();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [searchUid, setSearchUid] = useState('');
  const [searchStudent, setSearchStudent] = useState('');
  const [courseFilter, setCourseFilter] = useState('');

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchPayments();
    fetchStudents();
  }, [fetchPayments, fetchStudents]);

  const courseOptions = [...new Map(
    students
      .filter((student) => student.course?.id)
      .map((student) => [student.course.id, student.course])
  ).values()];

  const filteredPayments = payments.filter((payment) => {
    const student = payment.student || {};
    const fullName = `${student.firstName || ''} ${student.lastName || ''}`.toLowerCase();
    const uid = (student.uid || '').toLowerCase();
    const courseName = (student.course?.title || '').toLowerCase();

    const matchesUid = !searchUid.trim() || uid.includes(searchUid.trim().toLowerCase());
    const matchesStudent =
      !searchStudent.trim() ||
      fullName.includes(searchStudent.trim().toLowerCase()) ||
      courseName.includes(searchStudent.trim().toLowerCase());
    const matchesCourse =
      !courseFilter || student.course?.id?.toString() === courseFilter.toString();

    return matchesUid && matchesStudent && matchesCourse;
  });

  const handleOpenEdit = (payment) => {
    setSelectedPayment(payment);
    setValue('amount', payment.amount);
    setValue('paymentDate', payment.paymentDate?.split('T')[0] || '');
    setValue('paymentMethod', payment.paymentMethod);
    setValue('status', payment.status);
    setValue('referenceNumber', payment.referenceNumber || '');
    setEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    setEditModalOpen(false);
    setSelectedPayment(null);
    reset();
  };

  const onEditSubmit = async (data) => {
    if (!selectedPayment) return;

    setUpdating(true);
    const payload = {
      amount: parseFloat(data.amount),
      paymentDate: data.paymentDate,
      paymentMethod: data.paymentMethod,
      status: data.status,
      referenceNumber: data.referenceNumber,
    };

    const result = await updatePayment(selectedPayment.id, payload);
    setUpdating(false);

    if (result.success) {
      handleCloseEdit();
      fetchPayments();
    }
  };

  const columns = [
    {
      label: 'Receipt No.',
      render: (_, row) => (
        <div>
          <p className="font-semibold text-primary">{row.receiptNumber || 'N/A'}</p>
          <p className="text-xs text-slate-500">
            {row.paymentDate ? format(new Date(row.paymentDate), 'dd MMM yyyy') : '-'}
          </p>
        </div>
      )
    },
    {
      label: 'Student',
      render: (_, row) => (
        <button
          type="button"
          onClick={() => navigate(`/erp/students/${row.student?.id}`)}
          className="text-left hover:text-primary"
        >
          <p className="font-medium text-slate-800">
            {row.student?.firstName} {row.student?.lastName}
          </p>
          <p className="text-xs text-slate-500">{row.student?.uid || 'No UID'}</p>
          <p className="text-xs text-slate-400">{row.student?.course?.title || 'No course'}</p>
        </button>
      )
    },
    {
      label: 'Amount',
      render: (_, row) => (
        <span className="font-bold text-slate-900">
          ₹{Number(row.amount).toLocaleString('en-IN')}
        </span>
      )
    },
    {
      label: 'Method',
      render: (_, row) => (
        <Badge variant="outline" className="uppercase text-[10px]">
          {row.paymentMethod?.replace('_', ' ')}
        </Badge>
      )
    },
    {
      label: 'Status',
      render: (_, row) => {
        const variants = {
          completed: 'success',
          pending: 'warning',
          failed: 'danger',
          refunded: 'default'
        };
        return (
          <Badge variant={variants[row.status] || 'default'}>
            {row.status?.toUpperCase()}
          </Badge>
        );
      }
    },
    {
      label: 'Actions',
      align: 'right',
      render: (_, row) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-2 text-slate-400 hover:text-primary transition-colors hover:bg-primary/10 rounded-lg"
            title="Edit Payment"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          {row.paymentSlip?.url && (
            <a
              href={row.paymentSlip.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-emerald-600 transition-colors hover:bg-emerald-50 rounded-lg"
              title="View Payment Slip"
            >
              <FileText className="w-4 h-4" />
            </a>
          )}
          <Link
            to={`/erp/payments/${row.documentId || row.id}/receipt`}
            className="p-2 text-slate-400 hover:text-primary transition-colors hover:bg-primary/10 rounded-lg"
            title="Download Receipt"
          >
            <Download className="w-4 h-4" />
          </Link>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Ledger"
        subtitle="Search by student name or UID, filter by course, and open the student's full profile from each payment"
        actions={
          <Link
            to="/erp/payments/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium bg-primary text-white hover:bg-primary/90"
          >
            Record Payment
          </Link>
        }
      />

      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Search Student"
            icon="search"
            placeholder="Name or course"
            value={searchStudent}
            onChange={(e) => setSearchStudent(e.target.value)}
          />
          <Input
            label="Search UID"
            icon="search"
            placeholder="Student UID"
            value={searchUid}
            onChange={(e) => setSearchUid(e.target.value)}
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
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredPayments}
          loading={isLoading}
          emptyMessage="No payments found for the selected filters."
        />
      </div>

      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-100 overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-primary" />
                Edit Payment
              </h3>
              <button
                onClick={handleCloseEdit}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onEditSubmit)} className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {selectedPayment?.student?.firstName?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">
                      {selectedPayment?.student?.firstName} {selectedPayment?.student?.lastName}
                    </p>
                    <p className="text-xs text-slate-500 font-mono">{selectedPayment?.student?.uid}</p>
                  </div>
                </div>

                <Input
                  label="Amount (₹)"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('amount', { required: 'Amount is required', min: 0 })}
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

                <Select
                  label="Status"
                  {...register('status')}
                  options={[
                    { label: 'Completed', value: 'completed' },
                    { label: 'Pending', value: 'pending' },
                    { label: 'Failed', value: 'failed' },
                    { label: 'Refunded', value: 'refunded' }
                  ]}
                />

                <Input
                  label="Reference / Transaction No."
                  placeholder="e.g. UPI Ref # or cheque details"
                  {...register('referenceNumber')}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseEdit}
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <Button type="submit" loading={updating} className="flex-1">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentListPage;
