import React from 'react';
import { Star, Quote, MapPin, GraduationCap } from 'lucide-react';

const TestimonialCard = ({ testimonial, index }) => {
  const { student, course, batch, rating, testimonialText, placementCompany, placementRole } = testimonial;

  const getPhotoUrl = (photo) => {
    if (!photo) return null;
    if (photo.url) return photo.url.startsWith('http') ? photo.url : `${import.meta.env.VITE_STRAPI_URL || ''}${photo.url}`;
    if (photo.data?.attributes?.url) return photo.data.attributes.url;
    return null;
  };

  const profilePhoto = student?.profileImage ? getPhotoUrl(student.profileImage) : null;
  const studentName = student?.name || 'Anonymous';
  const courseName = course?.name || course?.title || '';
  const batchName = batch?.name || '';
  const location = student?.address?.city || student?.branch?.name || '';

  return (
    <div
      className="flex-shrink-0 w-[340px] bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start gap-4 mb-4">
        {profilePhoto ? (
          <img
            src={profilePhoto}
            alt={studentName}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-100 group-hover:ring-blue-200 transition-all"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
            {studentName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-800 truncate">{studentName}</h4>
          {courseName && (
            <p className="text-sm text-slate-500 flex items-center gap-1">
              <GraduationCap className="w-3 h-3" />
              {courseName}
              {batchName && <span className="text-slate-400">• {batchName}</span>}
            </p>
          )}
          {location && (
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" />
              {location}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < (rating || 5) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'
            }`}
          />
        ))}
      </div>

      <div className="relative mb-4">
        <Quote className="absolute -top-1 -left-1 w-6 h-6 text-blue-100 opacity-50" />
        <p className="text-slate-600 text-sm leading-relaxed pl-4 line-clamp-4">
          {testimonialText || testimonial.description || testimonial.message || testimonial.experience}
        </p>
      </div>

      {(placementCompany || placementRole) && (
        <div className="pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-400 mb-1">Now working at</p>
          <p className="font-medium text-blue-600">
            {placementRole && <span>{placementRole}</span>}
            {placementRole && placementCompany && <span> at </span>}
            {placementCompany && <span>{placementCompany}</span>}
          </p>
        </div>
      )}
    </div>
  );
};

export default TestimonialCard;
