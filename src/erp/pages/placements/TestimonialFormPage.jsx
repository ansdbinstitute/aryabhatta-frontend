import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import usePlacementStore from '../../stores/placementStore';
import PageHeader from '../../components/common/PageHeader';
import { Star, Save, User, Briefcase, ChevronDown } from 'lucide-react';
import useToast from '../../hooks/useToast';
import client from '../../api/client';

const TestimonialFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const isEdit = Boolean(id);
  
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  
  const { createTestimonial, updateTestimonial, fetchTestimonials, testimonials, isLoading } = usePlacementStore();

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      rating: 5,
      isActive: true,
      displayOrder: 0,
    }
  });

  const rating = watch('rating');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await client.get('/students', {
          params: {
            'sort': 'name:asc',
            'pagination[limit]': 100,
            'populate': ['course', 'profileImage', 'batch'],
          }
        });
        setStudents(response.data?.data || []);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchStudents();

    if (isEdit) {
      fetchTestimonials().then(() => {
        const testimonial = testimonials.find(t => t.documentId === id);
        if (testimonial) {
          reset({
            testimonialText: testimonial.testimonialText || '',
            rating: testimonial.rating || 5,
            placementCompany: testimonial.placementCompany || '',
            placementRole: testimonial.placementRole || '',
            isActive: testimonial.isActive ?? true,
            displayOrder: testimonial.displayOrder || 0,
          });
          setSelectedStudent(testimonial.student);
        }
      });
    }
  }, [isEdit, id]);

  const filteredStudents = students.filter(student => 
    student.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectStudent = (student) => {
    setSelectedStudent(student);
    setShowDropdown(false);
    setSearchQuery(student.name || '');
  };

  const onSubmit = async (data) => {
    if (!selectedStudent?.id && !selectedStudent?.documentId) {
      toast.error('Please select a student');
      return;
    }

    const studentId = selectedStudent.id || selectedStudent.documentId;

    const payload = {
      student: studentId,
      testimonialText: data.testimonialText,
      rating: parseInt(data.rating) || 5,
      placementCompany: data.placementCompany || null,
      placementRole: data.placementRole || null,
      isActive: data.isActive === true || data.isActive === 'true',
      displayOrder: parseInt(data.displayOrder) || 0,
    };

    const res = isEdit 
      ? await updateTestimonial(id, payload)
      : await createTestimonial(payload);

    if (res.success) {
      toast.success(isEdit ? 'Testimonial updated successfully' : 'Testimonial added successfully');
      navigate('/erp/placements/testimonials');
    } else {
      toast.error(res.error || 'Failed to save testimonial');
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <PageHeader
        title={isEdit ? 'Edit Testimonial' : 'Add Student Testimonial'}
        subtitle="Add a success story from a placed student."
        backTo="/erp/placements/testimonials"
      />

      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
              Student *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <User className="w-5 h-5 text-slate-300" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search student by name..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
              />
              
              {showDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                  {filteredStudents.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-slate-400">No students found</div>
                  ) : (
                    filteredStudents.map(student => (
                      <button
                        key={student.id || student.documentId}
                        type="button"
                        onClick={() => selectStudent(student)}
                        className="w-full px-4 py-3 text-left hover:bg-indigo-50 transition-colors flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                          {(student.name || 'A').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">{student.name}</p>
                          <p className="text-xs text-slate-400">{student.course?.name || student.course?.title || 'N/A'}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            
            {selectedStudent && (
              <div className="mt-2 flex items-center gap-2 p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                <User className="w-4 h-4 text-indigo-600" />
                <span className="text-sm text-indigo-700 font-medium">
                  Selected: {selectedStudent.name}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStudent(null);
                    setSearchQuery('');
                  }}
                  className="ml-auto text-indigo-600 hover:text-indigo-800 text-xs"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
              Testimonial Text *
            </label>
            <textarea
              {...register('testimonialText', { required: true })}
              rows="5"
              placeholder="What did the student say about their experience?..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
              Rating *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setValue('rating', value)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      value <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-slate-500">{rating} / 5</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                Placement Company
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                <input
                  {...register('placementCompany')}
                  type="text"
                  placeholder="Google, Microsoft, TCS, etc."
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                Placement Role
              </label>
              <input
                {...register('placementRole')}
                type="text"
                placeholder="Software Engineer, Analyst, etc."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                Display Order
              </label>
              <input
                {...register('displayOrder')}
                type="number"
                min="0"
                placeholder="0"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
              />
              <p className="text-xs text-slate-400 mt-1">Lower numbers appear first</p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('isActive')}
                defaultChecked={true}
                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-slate-700">
                Show on public website
              </span>
            </label>
          </div>

          <div className="pt-8 flex justify-end gap-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={() => navigate('/erp/placements/testimonials')}
              className="px-6 py-2.5 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="flex items-center gap-2 px-10 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:bg-slate-300"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {isEdit ? 'Update Testimonial' : 'Add Testimonial'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestimonialFormPage;
