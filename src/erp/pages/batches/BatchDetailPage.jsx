import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import usePermission from '../../hooks/usePermission';
import useToast from '../../hooks/useToast';
import { batchesApi } from '../../api/batches';
import useUIStore from '../../stores/uiStore';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import LoadingScreen from '../../components/common/LoadingScreen';
import { formatDate } from '../../utils/helpers';
import DataTable from '../../components/ui/DataTable';
import { Users, GraduationCap, Calendar, BookOpen, CreditCard } from 'lucide-react';

const BatchDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { can, isInstituteAdmin } = usePermission();
  const showConfirm = useUIStore(s => s.showConfirm);
  
  const [batch, setBatch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBatch();
  }, [id]);

  const loadBatch = async () => {
    try {
      const res = await batchesApi.getById(id, {
        populate: ['course', 'teacher', 'students']
      });
      setBatch({ id: res.data.data.id, ...res.data.data });
    } catch {
      toast.error('Failed to load batch details');
      navigate('/erp/batches');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    showConfirm(
      'Delete Batch',
      `Are you sure you want to delete ${batch.name}? This action cannot be undone and will orphan students unless reassigned.`,
      async () => {
        try {
          await batchesApi.delete(id);
          toast.success('Batch deleted successfully');
          navigate('/erp/batches');
        } catch (err) {
          toast.error(err.response?.data?.error?.message || 'Failed to delete batch');
        }
      }
    );
  };

  if (isLoading || !batch) return <LoadingScreen />;

  const currentStudents = batch.students?.length || 0;
  const isFull = currentStudents >= batch.capacity && batch.capacity > 0;

  const studentColumns = [
    { key: 'uid', label: 'UID', render: (val) => <span className="font-mono text-xs">{val}</span> },
    { key: 'name', label: 'Student', render: (_, row) => <span className="font-medium text-slate-800">{row.firstName} {row.lastName}</span> },
    { key: 'phone', label: 'Phone', render: (val) => <span className="text-slate-600">{val}</span> },
    { key: 'enrollmentDate', label: 'Enrolled', render: (val) => <span className="text-slate-600">{formatDate(val)}</span> },
    { key: 'actions', label: '', align: 'right', render: (_, row) => (
      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/erp/students/${row.id}`); }}>
        View
      </Button>
    )}
  ];

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <PageHeader
        title={batch.name}
        subtitle={`Course: ${batch.course?.title || 'Unknown'}`}
        actions={
          <>
            {can('update', 'batches') && (
              <Button variant="primary" icon="edit" onClick={() => navigate(`/erp/batches/${id}/edit`)}>
                Edit Batch
              </Button>
            )}
            {isInstituteAdmin && (
              <Button variant="danger" icon="delete" onClick={handleDelete}>
                Delete
              </Button>
            )}
          </>
        }
      />

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatDetail icon="event" title="Duration" value={`${formatDate(batch.startDate)} to ${formatDate(batch.endDate)}`} color="info" />
        <StatDetail icon="person" title="Teacher" value={batch.teacher ? `${batch.teacher.firstName} ${batch.teacher.lastName}` : 'Unassigned'} color="primary" />
        <StatDetail icon="groups" title="Capacity" value={`${currentStudents} / ${batch.capacity} Enrolled`} color={isFull ? 'danger' : 'success'} />
        <div className="bg-white p-5 rounded-xl border border-erp-border shadow-sm flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-600">Current Status</p>
          <StatusBadge status={batch.status} />
        </div>
      </div>

      {/* Students List Wrapper */}
      <div className="bg-white rounded-xl border border-erp-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-erp-border bg-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Enrolled Students</h3>
          {can('update', 'students') && (
            <Button variant="outline" size="sm" icon="person_add" onClick={() => navigate(`/erp/students/new?batch=${batch.id}&course=${batch.course?.id}`)}>
              Enroll New
            </Button>
          )}
        </div>
        
        <DataTable
          columns={studentColumns}
          data={batch.students || []}
          emptyMessage="No students are currently assigned to this batch."
          onRowClick={(row) => navigate(`/erp/students/${row.id}`)}
        />
      </div>
    </div>
  );
};

const StatDetail = ({ icon, title, value, color }) => {
  const bg = {
    primary: 'bg-primary/10 text-primary',
    info: 'bg-blue-50 text-blue-600',
    success: 'bg-green-50 text-green-600',
    danger: 'bg-red-50 text-red-600',
  }[color];

  const iconMap = {
    users: Users, graduation: GraduationCap, calendar: Calendar,
    book: BookOpen, payment: CreditCard,
  };
  const IconComponent = iconMap[icon] || Users;

  return (
    <div className="bg-white p-5 rounded-xl border border-erp-border shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
        <IconComponent className="w-6 h-6" />
      </div>
      <div className="truncate">
        <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">{title}</p>
        <p className="font-semibold text-slate-800 truncate">{value}</p>
      </div>
    </div>
  );
};

export default BatchDetailPage;
