import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { batchesApi } from '../../api/batches';
import { usersApi } from '../../api/users';
import useToast from '../../hooks/useToast';
import useCourseStore from '../../stores/courseStore';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { classNames } from '../../utils/helpers';
import { BATCH_STATUS } from '../../utils/constants';

const BatchFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const defaultCourse = searchParams.get('course');
  
  const [teachers, setTeachers] = useState([]);
  const { courses, fetchCourses } = useCourseStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitLoading, setSubmitLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      status: BATCH_STATUS.UPCOMING,
      capacity: 30,
      course: defaultCourse || '',
    }
  });

  useEffect(() => {
    fetchCourses();
    loadTeachers();
    
    if (isEdit) {
      loadBatch();
    }
  }, [id, isEdit]);

  const loadTeachers = async () => {
    try {
      // Typically fetch users with role 'Teacher'
      const res = await usersApi.list({
        filters: { role: { type: { $eq: 'Teacher' } } },
      });
      setTeachers(res.data || []);
    } catch {
      toast.error('Failed to load teachers.');
    }
  };

  const loadBatch = async () => {
    setIsLoading(true);
    try {
      const res = await batchesApi.getById(id, { populate: ['course', 'teacher'] });
      const data = res.data.data;
      reset({
        name: data.name,
        course: data.course?.id || '',
        teacher: data.teacher?.id || '',
        startDate: data.startDate ? data.startDate.split('T')[0] : '',
        endDate: data.endDate ? data.endDate.split('T')[0] : '',
        capacity: data.capacity,
        status: data.status,
      });
    } catch (err) {
      toast.error('Failed to load batch details.');
      navigate('/erp/batches');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSubmitLoading(true);
    try {
      const payload = {
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        capacity: Number(data.capacity),
        status: data.status,
        // Course uses Document ID in Strapi 5
        course: (data.course && data.course !== '') ? { documentId: data.course } : null,
      };

      // Conditionally add teacher only if selected to avoid "Invalid key teacher" validation errors with null values
      if (data.teacher && data.teacher !== '') {
        payload.teacher = Number(data.teacher);
      }

      if (isEdit) {
        await batchesApi.update(id, payload);
        toast.success('Batch updated successfully');
      } else {
        await batchesApi.create(payload);
        toast.success('Batch created successfully');
      }
      navigate('/erp/batches');
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to save batch.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (isLoading) return null;

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <PageHeader
        title={isEdit ? 'Edit Batch' : 'Create New Batch'}
        subtitle="Manage this cohort and its assignment."
        actions={
          <Button variant="ghost" onClick={() => navigate('/erp/batches')}>Cancel</Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl border border-erp-border shadow-sm space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Batch Name"
            placeholder="e.g. WD-2026-Batch-01"
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
            required
            helperText="Internal identifier for this specific class"
          />
          <Select
            label="Course"
            options={courses.map(c => ({ value: c.id, label: c.code + ' - ' + c.title }))}
            {...register('course', { required: 'Course is required' })}
            error={errors.course?.message}
            required
            disabled={isEdit} // Generally shouldn't change the course of an existing batch
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-slate-100 pt-5">
           <Input
            type="date"
            label="Start Date"
            {...register('startDate', { required: 'Start date is required' })}
            error={errors.startDate?.message}
            required
          />
          <Input
            type="date"
            label="End Date"
            {...register('endDate', { required: 'End date is required' })}
            error={errors.endDate?.message}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 border-t border-slate-100 pt-5">
          <Input
            label="Max Capacity"
            type="number"
            min="1"
            {...register('capacity', { required: 'Capacity is required', min: 1 })}
            error={errors.capacity?.message}
            required
          />
          <Select
            label="Primary Teacher (Optional)"
            placeholder="Unassigned"
            options={teachers.map(t => ({ value: t.id, label: t.firstName + ' ' + t.lastName }))}
            {...register('teacher')}
          />
          <Select
            label="Status"
            options={Object.values(BATCH_STATUS).map(s => ({ value: s, label: s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }))}
            {...register('status', { required: 'Status is required' })}
            error={errors.status?.message}
            required
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <Button type="submit" variant="primary" loading={isSubmitLoading} icon="save" disabled={!isDirty && isEdit}>
            {isEdit ? 'Save Changes' : 'Create Batch'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BatchFormPage;
