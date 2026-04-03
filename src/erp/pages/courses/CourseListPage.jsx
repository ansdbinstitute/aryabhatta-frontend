import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCourseStore from '../../stores/courseStore';
import usePermission from '../../hooks/usePermission';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import useDebounce from '../../hooks/useDebounce';

const CourseListPage = () => {
  const navigate = useNavigate();
  const { can } = usePermission();
  const { courses, isLoadingCourses, fetchCourses } = useCourseStore();
  
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    const params = {
      populate: ['batches'], // Check how many active batches are there
      sort: 'sortOrder:asc',
    };

    if (debouncedSearch) {
      params.filters = {
        $or: [
          { title: { $containsi: debouncedSearch } },
          { code: { $containsi: debouncedSearch } }
        ]
      };
    }

    fetchCourses(params);
  }, [debouncedSearch, fetchCourses]);

  const columns = [
    {
      key: 'code', label: 'Code',
      render: (val) => <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">{val}</span>
    },
    {
      key: 'title', label: 'Course Title',
      render: (val, row) => (
        <div>
          <p className="font-semibold text-slate-800">{val}</p>
          <p className="text-xs text-slate-500">{row.durationValue} {row.durationUnit}</p>
        </div>
      )
    },
    {
      key: 'batches', label: 'Batches', align: 'center',
      render: (_, row) => {
        const count = row.batches?.length || 0;
        return <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-xs font-bold text-slate-600">{count}</span>;
      }
    },
    {
      key: 'isActive', label: 'Status',
      render: (val) => <StatusBadge status={val ? 'active' : 'inactive'} />
    },
    {
      key: 'actions', label: '', align: 'right',
      render: (_, row) => (
        <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            icon="visibility"
            className="text-slate-400 hover:text-primary"
            onClick={() => navigate(`/erp/courses/${row.id}`)}
          />
          {can('update', 'courses') && (
            <Button
              variant="ghost"
              size="sm"
              icon="edit"
              className="text-slate-400 hover:text-accent"
              onClick={() => navigate(`/erp/courses/${row.id}/edit`)}
            />
          )}
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Courses"
        subtitle="Manage academic programs and courses."
        actions={
          can('create', 'courses') && (
            <Button icon="add" onClick={() => navigate('/erp/courses/new')}>
              Add Course
            </Button>
          )
        }
      />

      <div className="bg-white p-4 rounded-xl border border-erp-border mb-6 shadow-sm flex items-center">
        <div className="w-full max-w-sm relative">
          <Input 
            icon="search"
            placeholder="Search courses..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={courses}
        loading={isLoadingCourses}
        onRowClick={(row) => navigate(`/erp/courses/${row.id}`)}
      />
    </div>
  );
};

export default CourseListPage;
