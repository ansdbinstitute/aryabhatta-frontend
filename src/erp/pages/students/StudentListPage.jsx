import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useStudentStore from '../../stores/studentStore';
import useCourseStore from '../../stores/courseStore';
import usePagination from '../../hooks/usePagination';
import usePermission from '../../hooks/usePermission';
import useDebounce from '../../hooks/useDebounce';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import Pagination from '../../components/ui/Pagination';
import { StatusBadge } from '../../components/ui/Badge';
import FilterBar from '../../components/common/FilterBar';
import { formatDate, getMediaUrl } from '../../utils/helpers';

const StudentListPage = () => {
  const navigate = useNavigate();
  const { can, isTeacher } = usePermission();

  // Use individual selectors to prevent re-renders from global isLoading updates
  const students = useStudentStore((s) => s.students);
  const isLoading = useStudentStore((s) => s.isLoading);
  const storePagination = useStudentStore((s) => s.pagination);
  const fetchStudentsAction = useStudentStore((s) => s.fetchStudents);
  const resetStudents = useStudentStore((s) => s.resetStudents);

  const courses = useCourseStore((s) => s.courses);
  const batches = useCourseStore((s) => s.batches);
  const fetchCourses = useCourseStore((s) => s.fetchCourses);
  const fetchBatches = useCourseStore((s) => s.fetchBatches);

  // Track if we have fetched data at least once
  const hasFetchedRef = useRef(false);
  const fetchTriggerRef = useRef(0);

  // State
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue, 400);
  const [filters, setFilters] = useState({ course: '', batch: '', status: '' });
  
  // Custom Pagination hook
  const pagination = usePagination();

  // Reset store on mount
  useEffect(() => {
    resetStudents();
    hasFetchedRef.current = false;
  }, [resetStudents]);

  // Load courses and batches on mount
  useEffect(() => {
    fetchCourses();
    fetchBatches();
  }, [fetchCourses, fetchBatches]);

  // Sync component pagination state with store pagination metadata
  // Only sync when we receive actual pagination data from the store
  useEffect(() => {
    if (storePagination && Object.keys(storePagination).length > 0) {
      pagination.updateFromResponse({ pagination: storePagination });
    }
  }, [storePagination]);

  // Fetch students when search, filters, or pagination changes
  useEffect(() => {
    // Debounce the initial fetch to avoid double-fetching on mount
    const buildQueryParams = () => {
      const queryParams = {
        ...pagination.params,
        sort: 'updatedAt:desc',
        filters: {},
      };

      if (debouncedSearch) {
        queryParams.filters['$or'] = [
          { firstName: { $containsi: debouncedSearch } },
          { lastName: { $containsi: debouncedSearch } },
          { uid: { $containsi: debouncedSearch } },
        ];
      }

      if (filters.course) {
        queryParams.filters.course = { id: { $eq: filters.course } };
      }
      if (filters.batch) {
        queryParams.filters.batch = { id: { $eq: filters.batch } };
      }
      if (filters.status) {
        queryParams.filters.status = { $eq: filters.status };
      }

      return queryParams;
    };

    // Use getState to access stable fetch function
    // This prevents the effect from re-running when fetchStudents reference changes
    const doFetch = () => {
      useStudentStore.getState().fetchStudents(buildQueryParams());
      hasFetchedRef.current = true;
    };

    // Small delay on initial mount to let other effects settle
    if (!hasFetchedRef.current) {
      const timer = setTimeout(doFetch, 50);
      return () => clearTimeout(timer);
    } else {
      doFetch();
    }
  }, [debouncedSearch, filters, pagination.page, pagination.pageSize]);

  // Handlers
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    pagination.setPage(1); // Reset to first page
  };

  const handleResetFilters = () => {
    setSearchValue('');
    setFilters({ course: '', batch: '', status: '' });
    pagination.reset();
  };

  const hasActiveFilters = Boolean(searchValue || filters.course || filters.batch || filters.status);

  // Mappers for Select dropdowns
  const courseOptions = courses.map((c) => ({ value: c.id, label: c.title }));
  const batchOptions = batches
    .filter((b) => !filters.course || b.course?.id === Number(filters.course)) // cascade filter
    .map((b) => ({ value: b.id, label: b.name }));

  const filterConfig = [
    { key: 'course', label: 'All Courses', options: courseOptions },
    { key: 'batch', label: 'All Batches', options: batchOptions },
    {
      key: 'status', label: 'Any Status', options: [
        { value: 'active', label: 'Active' },
        { value: 'completed', label: 'Completed' },
        { value: 'dropped', label: 'Dropped' },
      ]
    },
  ];

  // Table Columns
  const columns = [
    {
      key: 'uid', label: 'UID',
      render: (val) => <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">{val || '—'}</span>
    },
    {
      key: 'name', label: 'Student',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0 overflow-hidden">
            {row.profileImage ? (
              <img src={getMediaUrl(row.profileImage)} alt={row.firstName} className="w-full h-full object-cover" />
            ) : (
              `${row.firstName?.[0]}${row.lastName?.[0]}`
            )}
          </div>
          <div>
            <p className="font-medium text-slate-800">{row.firstName} {row.lastName}</p>
            <p className="text-[11px] text-slate-400">{row.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'course', label: 'Course & Batch',
      render: (_, row) => (
        <div>
          <p className="text-sm text-slate-700">{row.course?.title || '—'}</p>
          <p className="text-xs text-slate-400">{row.batch?.name || '—'}</p>
        </div>
      )
    },
    { key: 'phone', label: 'Phone', render: (val) => <span className="text-slate-600">{val || '—'}</span> },
    { key: 'enrollmentDate', label: 'Enrolled', render: (val) => <span className="text-slate-600">{formatDate(val)}</span> },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    {
      key: 'actions', label: '', align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            icon="visibility"
            className="text-slate-400 hover:text-primary"
            onClick={() => navigate(`/erp/students/${row.id}`)}
          />
          {can('update', 'students') && (
            <Button
              variant="ghost"
              size="sm"
              icon="edit"
              className="text-slate-400 hover:text-accent"
              onClick={() => navigate(`/erp/students/${row.id}/edit`)}
            />
          )}
          {can('delete', 'students') && (
            <Button
              variant="ghost"
              size="sm"
              icon="delete"
              className="text-slate-400 hover:text-red-500"
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete ${row.firstName}? This action is permanent and will remove all student data from the database.`)) {
                  useStudentStore.getState().deleteStudent(row.id);
                }
              }}
            />
          )}
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Students"
        subtitle={isTeacher ? "Students in your assigned batches." : "Manage all institute students."}
        actions={
          can('create', 'students') && (
            <Button
              icon="add"
              onClick={() => navigate('/erp/students/new')}
            >
              Add Student
            </Button>
          )
        }
      />

      <FilterBar
        searchPlaceholder="Search by name, UID..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filters={filterConfig}
        filterValues={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <DataTable
        columns={columns}
        data={students}
        loading={isLoading}
        onRowClick={(row) => navigate(`/erp/students/${row.id}`)}
        emptyMessage="No students found matching the criteria."
      />

      <div className="mt-6">
        <Pagination
          page={pagination.page}
          pageSize={pagination.pageSize}
          total={pagination.total}
          pageCount={pagination.pageCount}
          onPageChange={pagination.setPage}
          onPageSizeChange={pagination.setPageSize}
        />
      </div>
    </div>
  );
};

export default StudentListPage;
