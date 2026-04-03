import React, { useEffect, useMemo } from 'react';
import PageHeader from '../../erp/components/common/PageHeader';
import usePaymentStore from '../../erp/stores/paymentStore';
import useCurrentStudent from '../hooks/useCurrentStudent';
import { CreditCard, Receipt, Wallet } from 'lucide-react';
import { getMediaUrl } from '../../erp/utils/helpers';

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));

const StudentFeeSummaryPage = () => {
  const { payments, fetchPaymentsByStudent, isLoading } = usePaymentStore();
  const { student, isLoading: isStudentLoading } = useCurrentStudent();

  useEffect(() => {
    if (student?.id) {
      fetchPaymentsByStudent(student.id);
    }
  }, [student?.id, fetchPaymentsByStudent]);

  const completedPayments = useMemo(
    () => payments.filter((payment) => payment.status === 'completed'),
    [payments]
  );
  const amountPaid = completedPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const totalFee = Number(student?.totalFee || 0);
  const dueAmount = Math.max(totalFee - amountPaid, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Fees & Dues"
        subtitle="Track your total course fee, completed payments, balance due, and receipt slips from one place."
      />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-3 inline-flex rounded-2xl bg-blue-50 p-3 text-blue-700">
            <Wallet className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-slate-500">Total Fee</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">{formatCurrency(totalFee)}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-3 inline-flex rounded-2xl bg-emerald-50 p-3 text-emerald-700">
            <Receipt className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-slate-500">Amount Paid</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">{formatCurrency(amountPaid)}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-3 inline-flex rounded-2xl bg-amber-50 p-3 text-amber-700">
            <CreditCard className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-slate-500">Balance Due</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">{formatCurrency(dueAmount)}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-800">Payment History</h3>
          <p className="mt-1 text-sm text-slate-500">
            Receipts uploaded from the ERP will appear here for this student account.
          </p>
        </div>

        {isLoading || isStudentLoading ? (
          <div className="p-10 text-center text-slate-400">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          </div>
        ) : !student ? (
          <div className="p-10 text-center text-slate-500">
            Your student profile is not linked yet. Please contact the institute office.
          </div>
        ) : payments.length === 0 ? (
          <div className="p-10 text-center text-slate-500">No payment records are available yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  <th className="px-6 py-3">Receipt</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Mode</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Slip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((payment) => {
                  const slipUrl = getMediaUrl(payment.paymentSlip);
                  return (
                    <tr key={payment.id} className="text-sm text-slate-700">
                      <td className="px-6 py-4 font-medium">{payment.receiptNumber || `PMT-${payment.id}`}</td>
                      <td className="px-6 py-4">
                        {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString('en-IN') : '-'}
                      </td>
                      <td className="px-6 py-4 capitalize">{payment.paymentMethod?.replaceAll('_', ' ') || '-'}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            payment.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {payment.status || 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold">{formatCurrency(payment.amount)}</td>
                      <td className="px-6 py-4">
                        {slipUrl ? (
                          <a href={slipUrl} target="_blank" rel="noreferrer" className="font-medium text-primary hover:underline">
                            View Slip
                          </a>
                        ) : (
                          <span className="text-slate-400">Not uploaded</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentFeeSummaryPage;
