import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCourseStore from '../../stores/courseStore';
import usePermission from '../../hooks/usePermission';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import FilterBar from '../../components/common/FilterBar';
import { StatusBadge } from '../../components/ui/Badge';
import { formatDate } from '../../utils/helpers';
import useDebounce from '../../hooks/useDebounce';

const BatchListPage = () => {
  const navigate = useNavigate();
  const { can } = usePermission();
  const { batches, courses, fetchBatches, fetchCourses, isLoadingBatches } = useCourseStore();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const [courseFilter, setCourseFilter] = useState('');
  
  useEffect(() => {
    fetchCourses(); // Needed for filters
  }, [fetchCourses]);

  useEffect(() => {
    const params = {
      populate: ['course', 'teacher', 'students'], // populate strictly for the count
      sort: 'startDate:desc',
      filters: {}
    };

    if (debouncedSearch) {
      params.filters.name = { $containsi: debouncedSearch };
    }

    if (courseFilter) {
      params.filters.course = { id: { $eq: courseFilter } };
    }

    fetchBatches(params);
  }, [debouncedSearch, courseFilter, fetchBatches]);

  const courseOptions = courses.map(c => ({ value: c.id, label: c.code + ' - ' + c.title }));

  const columns = [
    {
      key: 'name', label: 'Batch Name',
      render: (val, row) => (
        <div>
          <p className="font-semibold text-slate-800">{val}</p>
          <p className="text-xs text-slate-500 font-mono">ID: {row.id}</p>
        </div>
      )
    },
    {
      key: 'course', label: 'Course',
      render: (val, row) => (
        <span className="text-sm text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-100">{row.course?.code || '—'}</span>
      )
    },
    {
      key: 'dates', label: 'Duration',
      render: (_, row) => (
        <div>
          <p className="text-sm text-slate-800">{formatDate(row.startDate)}</p>
          <p className="text-xs text-slate-400">to {formatDate(row.endDate)}</p>
        </div>
      )
    },
    {
      key: 'students', label: 'Students', align: 'center',
      render: (_, row) => {
        const current = row.students?.length || 0;
        const max = row.capacity || 0;
        const isFull = current >= max && max > 0;
        return (
          <div className="flex flex-col items-center">
            <span className={`text-sm font-bold ${isFull ? 'text-red-500' : 'text-slate-700'}`}>
              {current} / {max}
            </span>
            {isFull && <span className="text-[10px] text-red-500 font-medium">FULL</span>}
          </div>
        );
      }
    },
    {
      key: 'status', label: 'Status',
      render: (val) => <StatusBadge status={val} />
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
            onClick={() => navigate(`/erp/batches/${row.id}`)}
          />
          {can('update', 'batches') && (
            <Button
              variant="ghost"
              size="sm"
              icon="edit"
              className="text-slate-400 hover:text-accent"
              onClick={() => navigate(`/erp/batches/${row.id}/edit`)}
            />
          )}
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Batches"
        subtitle="Manage course schedules, class assignments, and active cohorts."
        actions={
          can('create', 'batches') && (
            <Button icon="add" onClick={() => navigate('/erp/batches/new')}>
              Add Batch
            </Button>
          )
        }
      />

      <FilterBar
        searchPlaceholder="Search batch names..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          { key: 'course', label: 'All Courses', options: courseOptions }
        ]}
        filterValues={{ course: courseFilter }}
        onFilterChange={(_, val) => setCourseFilter(val)}
        onReset={() => { setSearch(''); setCourseFilter(''); }}
        hasActiveFilters={Boolean(search || courseFilter)}
      />

      <DataTable
        columns={columns}
        data={batches}
        loading={isLoadingBatches}
        onRowClick={(row) => navigate(`/erp/batches/${row.id}`)}
      />
    </div>
  );
};

export default BatchListPage;
