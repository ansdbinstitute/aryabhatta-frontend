import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import usePermission from '../../hooks/usePermission';
import useToast from '../../hooks/useToast';
import { coursesApi } from '../../api/courses';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import LoadingScreen from '../../components/common/LoadingScreen';
import DataTable from '../../components/ui/DataTable';
import { Clock, CreditCard, Users } from 'lucide-react';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { can } = usePermission();
  
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      const res = await coursesApi.getById(id, {
        populate: ['batches.teacher']
      });
      setCourse({ id: res.data.data.id, ...res.data.data }); // Strapi unwrapping
    } catch {
      toast.error('Failed to load course details');
      navigate('/erp/courses');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !course) return <LoadingScreen />;

  const batchColumns = [
    { key: 'name', label: 'Batch Name', render: (val) => <span className="font-semibold text-slate-800">{val}</span> },
    { key: 'teacher', label: 'Assigned Teacher', render: (_, row) => 
      row.teacher ? `${row.teacher.firstName} ${row.teacher.lastName}` : <span className="text-slate-400 italic">Unassigned</span>
    },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'actions', label: '', align: 'right', render: (_, row) => (
      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/erp/batches/${row.id}`); }}>
        View
      </Button>
    )}
  ];

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <PageHeader
        title={course.title}
        subtitle={`Course Code: ${course.code}`}
        actions={
          can('update', 'courses') && (
            <Button icon="edit" onClick={() => navigate(`/erp/courses/${id}/edit`)}>
              Edit Course
            </Button>
          )
        }
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-erp-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex justify-center items-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Duration</p>
            <p className="text-lg font-bold text-slate-800">{course.durationValue} {course.durationUnit}</p>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-erp-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex justify-center items-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Status</p>
            <div className="mt-0.5"><StatusBadge status={course.isActive ? 'active' : 'inactive'} /></div>
          </div>
        </div>
      </div>

      {course.description && (
        <div className="bg-white p-6 rounded-xl border border-erp-border shadow-sm mb-8">
          <h3 className="font-semibold text-slate-800 mb-2">Description</h3>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{course.description}</p>
        </div>
      )}

      {/* Batches Sub-list */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800 text-lg">Course Batches</h3>
        {can('create', 'batches') && (
          <Button variant="outline" size="sm" icon="add" onClick={() => navigate(`/erp/batches/new?course=${course.id}`)}>
            Add Batch
          </Button>
        )}
      </div>
      
      <DataTable
        columns={batchColumns}
        data={course.batches || []}
        emptyMessage="No batches currently exist for this course."
        onRowClick={(row) => navigate(`/erp/batches/${row.id}`)}
      />
    </div>
  );
};

export default CourseDetailPage;
