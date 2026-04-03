import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { coursesApi } from '../../api/courses';
import useToast from '../../hooks/useToast';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import { classNames } from '../../utils/helpers';
import { DURATION_UNIT } from '../../utils/constants';

const CourseFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitLoading, setSubmitLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      isActive: true,
      durationUnit: DURATION_UNIT.MONTHS,
      durationValue: 6,
      sortOrder: 0,
    }
  });

  useEffect(() => {
    if (isEdit) {
      loadCourse();
    }
  }, [id, isEdit]);

  const loadCourse = async () => {
    setIsLoading(true);
    try {
      const res = await coursesApi.getById(id);
      const data = res.data.data;
      reset({
        title: data.title,
        code: data.code,
        description: data.description || '',
        durationValue: data.durationValue,
        durationUnit: data.durationUnit,
        isActive: data.isActive,
        sortOrder: data.sortOrder || 0,
      });
    } catch (err) {
      toast.error('Failed to load course details.');
      navigate('/erp/courses');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSubmitLoading(true);
    try {
      const payload = {
        ...data,
        durationValue: Number(data.durationValue),
        sortOrder: Number(data.sortOrder),
        // Switch checkbox string back to boolean if needed
        isActive: data.isActive === 'true' || data.isActive === true,
      };

      if (isEdit) {
        await coursesApi.update(id, payload);
        toast.success('Course updated successfully');
      } else {
        await coursesApi.create(payload);
        toast.success('Course created successfully');
      }
      navigate('/erp/courses');
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to save course.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (isLoading) return null; // or spinner

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <PageHeader
        title={isEdit ? 'Edit Course' : 'Create New Course'}
        actions={
          <Button variant="ghost" onClick={() => navigate('/erp/courses')}>Cancel</Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl border border-erp-border shadow-sm space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Course Title"
            {...register('title', { required: 'Title is required' })}
            error={errors.title?.message}
            required
          />
          <Input
            label="Course Code"
            placeholder="e.g. WD"
            {...register('code', { required: 'Code is required' })}
            error={errors.code?.message}
            className="uppercase"
            required
            disabled={isEdit} // Don't change code after create
            helperText={isEdit ? 'Code cannot be changed' : 'Unique identifier used for UID generation'}
          />
        </div>

        <Textarea
          label="Description"
          rows={3}
          {...register('description')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 border-t border-slate-100 pt-5">
          <Input
            label="Duration Value"
            type="number"
            min="1"
            {...register('durationValue', { required: 'Duration is required' })}
            error={errors.durationValue?.message}
            required
          />
          <Select
            label="Duration Unit"
            options={Object.values(DURATION_UNIT).map(u => ({ value: u, label: u.charAt(0).toUpperCase() + u.slice(1) }))}
            {...register('durationUnit', { required: 'Unit is required' })}
            error={errors.durationUnit?.message}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-slate-100 pt-5">
          <Input
            label="Sort Order"
            type="number"
            {...register('sortOrder')}
            helperText="Display sequence in lists"
          />
          
          <div className="flex flex-col justify-center pt-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20"
                {...register('isActive')}
              />
              <div>
                <span className="text-sm font-semibold text-slate-800">Active Status</span>
                <p className="text-xs text-slate-400">Course is currently offered.</p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <Button type="submit" variant="primary" loading={isSubmitLoading} icon="save" disabled={!isDirty && isEdit}>
            {isEdit ? 'Save Changes' : 'Create Course'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CourseFormPage;
