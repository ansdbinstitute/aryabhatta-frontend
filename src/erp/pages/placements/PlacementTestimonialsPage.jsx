import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import usePlacementStore from '../../stores/placementStore';
import PageHeader from '../../components/common/PageHeader';
import { Plus, Trash2, Eye, EyeOff, Edit2, Star, MessageSquare, MapPin, GraduationCap } from 'lucide-react';

const PlacementTestimonialsPage = () => {
  const { testimonials, fetchTestimonials, deleteTestimonial, isLoading } = usePlacementStore();

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleDelete = async (id, studentName) => {
    if (window.confirm(`Are you sure you want to delete the testimonial from "${studentName}"?`)) {
      await deleteTestimonial(id);
    }
  };

  const toggleActive = async (testimonial) => {
    const { updateTestimonial } = usePlacementStore.getState();
    await updateTestimonial(testimonial.documentId, {
      student: testimonial.student?.id,
      testimonialText: testimonial.testimonialText,
      rating: testimonial.rating,
      placementCompany: testimonial.placementCompany,
      placementRole: testimonial.placementRole,
      isActive: !testimonial.isActive,
      displayOrder: testimonial.displayOrder,
    });
  };

  const getPhotoUrl = (photo) => {
    if (!photo) return null;
    if (photo.url.startsWith('http')) return photo.url;
    return `${import.meta.env.VITE_STRAPI_URL || ''}${photo.url}`;
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <PageHeader
          title="Student Testimonials"
          subtitle="Showcase success stories from our placed students."
        />
        <Link 
          to="/erp/placements/testimonials/new"
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Testimonial
        </Link>
      </div>

      {isLoading && testimonials.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="bg-white border text-center border-slate-100 rounded-2xl p-16 shadow-sm">
          <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700">No testimonials yet.</h3>
          <p className="text-sm text-slate-400 mt-2">Add success stories from placed students.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => {
            const student = testimonial.student;
            const profilePhoto = student?.profileImage ? getPhotoUrl(student.profileImage) : null;
            const studentName = student?.name || 'Anonymous';
            
            return (
              <div 
                key={testimonial.id} 
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    {profilePhoto ? (
                      <img 
                        src={profilePhoto}
                        alt={studentName}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-100"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                        {studentName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-slate-800">{studentName}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <GraduationCap className="w-3 h-3" />
                        {student?.course?.name || student?.course?.title || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < (testimonial.rating || 5) 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-sm text-slate-600 line-clamp-4 mb-4">
                    "{testimonial.testimonialText}"
                  </p>

                  {(testimonial.placementCompany || testimonial.placementRole) && (
                    <div className="pt-4 border-t border-slate-100">
                      <p className="text-xs text-slate-400 mb-1">Now working at</p>
                      <p className="font-medium text-indigo-600 text-sm">
                        {testimonial.placementRole && <span>{testimonial.placementRole}</span>}
                        {testimonial.placementRole && testimonial.placementCompany && <span> at </span>}
                        {testimonial.placementCompany && <span>{testimonial.placementCompany}</span>}
                      </p>
                    </div>
                  )}
                </div>

                <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                    testimonial.isActive 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {testimonial.isActive ? (
                      <><Eye className="w-3 h-3" /> Active</>
                    ) : (
                      <><EyeOff className="w-3 h-3" /> Hidden</>
                    )}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleActive(testimonial)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        testimonial.isActive
                          ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                          : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                      }`}
                      title={testimonial.isActive ? 'Hide' : 'Show'}
                    >
                      {testimonial.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <Link
                      to={`/erp/placements/testimonials/${testimonial.documentId}/edit`}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(testimonial.documentId, studentName)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PlacementTestimonialsPage;
