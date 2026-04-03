import React, { useEffect } from 'react';
import useAttendanceStore from '../../stores/attendanceStore';
import useAuthStore from '../../stores/authStore';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown } from 'lucide-react';

const AttendanceHistoryPage = () => {
  const { attendances, fetchAttendances, isLoading } = useAttendanceStore();
  const user = useAuthStore(s => s.user);

  useEffect(() => {
    // If the user's role is student, the backend middleware automatically scopes this query
    // But we query general attendances
    fetchAttendances({ 
      // Add explicit sort descending by date logic for Strapi v5
    }, { sort: ['date:desc'] });
  }, [fetchAttendances]);

  const columns = [
    {
      label: 'Date',
      render: (_, row) => format(new Date(row.date), 'dd MMM yyyy')
    },
    {
      label: 'Batch',
      render: (_, row) => `${row.batch?.name || ''} (${row.batch?.course?.code || ''})`
    },
    {
      label: 'Status',
      render: (_, row) => {
        const variants = {
          present: 'success',
          absent: 'danger',
          late: 'warning',
          half_day: 'info'
        };
        return (
          <Badge variant={variants[row.status] || 'default'}>
            {row.status?.replace('_', ' ').toUpperCase()}
          </Badge>
        );
      }
    },
    { label: 'Remarks', key: 'remarks' }
  ];

  // Calculate quick stats
  const total = attendances.length;
  const present = attendances.filter(a => ['present', 'late'].includes(a.status)).length;
  const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Attendance History" 
        subtitle="Track your daily attendance records"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col items-center justify-center text-center">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Classes</p>
          <p className="text-3xl font-bold text-slate-800">{total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col items-center justify-center text-center">
          <p className="text-sm font-medium text-slate-500 mb-1">Classes Attended</p>
          <p className="text-3xl font-bold text-primary">{present}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col items-center justify-center text-center">
          <p className="text-sm font-medium text-slate-500 mb-1">Attendance Rate</p>
          <div className="flex items-center gap-2">
            <p className={`text-3xl font-bold ${percentage >= 75 ? 'text-green-600' : 'text-red-500'}`}>
              {percentage}%
            </p>
            {percentage >= 75 ? (
              <TrendingUp className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-500" />
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <DataTable
          columns={columns}
          data={attendances}
          isLoading={isLoading}
          emptyTitle="No Attendance Records Found"
          emptyDescription="You do not have any attendance marked yet."
        />
      </div>
    </div>
  );
};

export default AttendanceHistoryPage;
