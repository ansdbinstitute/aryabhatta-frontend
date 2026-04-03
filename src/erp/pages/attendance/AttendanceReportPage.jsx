import React, { useState, useEffect } from 'react';
import useCourseStore from '../../stores/courseStore';
import useAttendanceStore from '../../stores/attendanceStore';
import PageHeader from '../../components/common/PageHeader';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { format } from 'date-fns';
import { FileText } from 'lucide-react';

const AttendanceReportPage = () => {
  const { batches, fetchBatches, isLoadingBatches: batchesLoading } = useCourseStore();
  const { attendances, fetchAttendances, isLoading } = useAttendanceStore();

  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedBatch, setSelectedBatch] = useState('');

  useEffect(() => {
    fetchBatches({ status: 'ongoing' });
  }, [fetchBatches]);

  useEffect(() => {
    if (selectedBatch && date) {
      fetchAttendances({ batch: selectedBatch, date });
    }
  }, [selectedBatch, date, fetchAttendances]);

  const columns = [
    {
      label: 'Student',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
            {row.student?.firstName?.[0] || '?'}
          </div>
          <div>
            <p className="font-medium text-slate-800">
              {row.student?.firstName} {row.student?.lastName}
            </p>
            <p className="text-xs text-slate-500">{row.student?.uid}</p>
          </div>
        </div>
      )
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
    { label: 'Remarks', key: 'remarks' },
    {
      label: 'Marked By',
      render: (_, row) => row.markedBy?.username || '-'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader 
          title="Attendance Report" 
          subtitle="View daily attendance logs"
        />
        <Button variant="outline" leftIcon="download">Export CSV</Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Select Batch"
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            disabled={batchesLoading}
            options={[
              { label: 'Choose a batch...', value: '' },
              ...batches.map(b => ({
                label: `${b.name} (${b.course?.title || 'Unknown'})`,
                value: b.id
              }))
            ]}
          />
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {selectedBatch ? (
        <DataTable
          columns={columns}
          data={attendances}
          isLoading={isLoading}
          emptyTitle="No Attendance Records"
          emptyDescription="No attendance was marked for this batch on the selected date."
        />
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-800">Select a Batch</h3>
          <p className="text-slate-500">Choose a batch and date to view its attendance report.</p>
        </div>
      )}
    </div>
  );
};

export default AttendanceReportPage;
