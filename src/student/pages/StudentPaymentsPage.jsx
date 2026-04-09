import React, { useEffect, useState } from 'react';
import useCurrentStudent from '../hooks/useCurrentStudent';
import client, { extractData } from '../../erp/api/client';
import { 
  CreditCard, 
  Receipt, 
  Download, 
  Calendar, 
  Wallet, 
  CheckCircle, 
  ArrowUpRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { getMediaUrl } from '../../erp/utils/helpers';
import { format } from 'date-fns';

const StudentPaymentsPage = () => {
  const { student, isLoading: studentLoading } = useCurrentStudent();
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!student?.id) return;
      
      setIsLoading(true);
      try {
        const response = await client.get('/payments', {
          params: {
            filters: { student: student.id },
            populate: ['student', 'paymentSlip'],
            sort: 'paymentDate:desc',
          }
        });
        setPayments(extractData(response) || []);
      } catch (error) {
        console.error('Failed to fetch payments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (student) {
      fetchPayments();
    }
  }, [student]);

  if (studentLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] md:min-h-[400px]">
        <div className="w-10 md:w-12 h-10 md:h-12 rounded-full border-3 border-slate-100 border-t-blue-600 animate-spin" />
      </div>
    );
  }

  const totalPaid = payments.reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0);
  const pending = payments.filter(p => p.status === 'pending' || p.status === 'partial').length;

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:p-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2.5 md:p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Wallet className="w-5 md:w-6 h-5 md:h-6" />
            </div>
            <div>
              <p className="text-[10px] md:text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total Paid</p>
              <h3 className="text-xl md:text-2xl font-black text-slate-800">₹{totalPaid.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:p-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2.5 md:p-3 bg-amber-50 text-amber-600 rounded-xl">
              <CreditCard className="w-5 md:w-6 h-5 md:h-6" />
            </div>
            <div>
              <p className="text-[10px] md:text-[11px] font-medium text-slate-400 uppercase tracking-wider">Pending</p>
              <h3 className="text-xl md:text-2xl font-black text-slate-800">{pending}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:p-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2.5 md:p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Receipt className="w-5 md:w-6 h-5 md:h-6" />
            </div>
            <div>
              <p className="text-[10px] md:text-[11px] font-medium text-slate-400 uppercase tracking-wider">Transactions</p>
              <h3 className="text-xl md:text-2xl font-black text-slate-800">{payments.length}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 md:px-6 py-4 md:py-5 border-b border-slate-50">
          <h3 className="text-lg md:text-xl font-bold text-slate-800">Payment History</h3>
        </div>
        {payments.length === 0 ? (
          <div className="p-10 md:p-16 text-center">
            <Receipt className="w-10 md:w-12 h-10 md:h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-400">No payment records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-4 md:px-6 py-3 text-left text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="px-4 md:px-6 py-3 text-left text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="px-4 md:px-6 py-3 text-left text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mode</th>
                  <th className="px-4 md:px-6 py-3 text-left text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 md:px-6 py-3 text-left text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-wider">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <p className="text-xs md:text-sm font-bold text-slate-700">{payment.paymentDate ? format(new Date(payment.paymentDate), 'dd MMM yyyy') : '-'}</p>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <p className="text-sm md:text-base font-black text-slate-800">₹{parseFloat(payment.amount || 0).toLocaleString()}</p>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <span className="text-xs md:text-sm font-medium text-slate-600">{payment.paymentMode || 'Online'}</span>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] md:text-xs font-medium ${
                        payment.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                        payment.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                        'bg-slate-50 text-slate-500'
                      }`}>
                        {payment.status || 'completed'}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      {payment.paymentSlip?.url && (
                        <a href={getMediaUrl(payment.paymentSlip)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                          <Download className="w-4 md:w-5 h-4 md:h-5" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    );

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3 uppercase">
             <CreditCard className="w-8 h-8 text-blue-600" />
             Payment History
          </h2>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1 opacity-70">
            Account Holder: <span className="text-blue-600 underline underline-offset-4 decoration-blue-200">{student?.uid}</span>
          </p>
        </div>
      </div>

      {/* Payment History Table / List */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden p-4 lg:p-8">
        <div className="px-6 py-6 border-b border-slate-50 flex items-center justify-between mb-6">
           <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight">
              <Receipt className="w-6 h-6 text-blue-500" />
              Transaction History
           </h3>
           <div className="px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
              {payments.length} SUCCESSFUL PAYMENTS
           </div>
        </div>

        {payments.length === 0 ? (
          <div className="py-24 text-center">
             <Wallet className="w-16 h-16 text-slate-200 mx-auto mb-4" />
             <h3 className="text-xl font-black text-slate-800 tracking-tight">No Transactions Found</h3>
             <p className="text-slate-400 font-medium text-sm mt-1">There are no recorded fee payments for this account yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-wrap items-center justify-between gap-6 hover:shadow-xl hover:border-blue-100 transition-all group overflow-hidden relative shadow-sm">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50/50 rounded-full blur-3xl -z-10 group-hover:scale-110 transition-transform" />
                 
                 <div className="flex items-center gap-4 flex-1">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border-2 border-white shadow-lg group-hover:scale-105 transition-transform flex-shrink-0">
                       <FileText className="w-6 h-6" />
                    </div>
                    <div>
                       <h4 className="text-lg font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
                          Receipt #{payment.receiptNo || payment.id}
                       </h4>
                       <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{payment.paymentDate ? format(new Date(payment.paymentDate), 'dd MMM yyyy') : '-'}</span>
                          <span className="flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" />{payment.paymentMethod || 'Cash'}</span>
                       </div>
                    </div>
                 </div>

                 <div className="flex items-center gap-8">
                    <div className="text-right">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Amount</p>
                       <p className="text-2xl font-black text-slate-800 tracking-tight">₹{(parseFloat(payment.amount) || 0).toLocaleString('en-IN')}</p>
                    </div>
                    {payment.paymentSlip ? (
                       <a 
                         href={getMediaUrl(payment.paymentSlip)} 
                         target="_blank" 
                         rel="noreferrer"
                         download
                         className="flex items-center gap-3 px-8 py-3.5 bg-slate-900 text-white font-black text-xs rounded-2xl hover:bg-blue-600 transition-all shadow-xl active:scale-95 uppercase tracking-widest group/dl"
                       >
                         Download Receipt
                         <Download className="w-4 h-4 group-hover/dl:translate-y-0.5 transition-transform" />
                       </a>
                    ) : (
                       <div className="px-8 py-3.5 bg-slate-100 text-slate-400 font-black text-xs rounded-2xl uppercase tracking-widest flex items-center gap-2">
                          <Wallet className="w-4 h-4 opacity-50" />
                          Logged
                       </div>
                    )}
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Important Notice Board Footer Style */}
      <div className="bg-blue-600 rounded-[40px] p-8 lg:p-12 text-white relative overflow-hidden flex flex-col md:flex-row md:items-center gap-10 shadow-2xl shadow-blue-900/40">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[100px] pointer-events-none opacity-50" />
         <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center rotate-12 shrink-0 border border-white/20">
            <CheckCircle className="w-10 h-10 text-white" />
         </div>
         <div className="flex-1 relative z-10">
            <h3 className="text-2xl font-black tracking-tight mb-2 uppercase tracking-wide">FEE CLEARANCE</h3>
            <p className="text-blue-100 font-medium text-sm leading-relaxed max-w-2xl opacity-90">
              Only successful payments verified by the administration are listed here. If you have made a payment that is not appearing after 24 hours, please submit your physical receipt at the main desk for manual entry.
            </p>
         </div>
         <div className="relative z-10">
            <button className="flex items-center gap-3 px-8 py-4 bg-white text-blue-600 font-black rounded-2xl hover:bg-slate-50 transition-all shadow-xl active:scale-95 group">
               Contact Accounts
               <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
         </div>
      </div>
    </div>
  );
};

export default StudentPaymentsPage;
