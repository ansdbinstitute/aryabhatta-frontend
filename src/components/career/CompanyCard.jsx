import React from 'react';
import { Building2 } from 'lucide-react';

const CompanyCard = ({ partner }) => {
  const getLogoUrl = (logo) => {
    if (!logo) return null;
    if (logo.url) {
      // Handle local paths (public folder) - don't prepend Strapi URL
      if (logo.url.startsWith('/')) return logo.url;
      // Handle external URLs
      if (logo.url.startsWith('http')) return logo.url;
      // Handle Strapi paths
      return `${import.meta.env.VITE_STRAPI_URL || ''}${logo.url}`;
    }
    if (logo.data?.attributes?.url) return logo.data.attributes.url;
    return null;
  };

  const logoUrl = getLogoUrl(partner.logo);
  const companyName = partner.companyName || partner.name || 'Company';

  return (
    <div className="flex-shrink-0 w-[280px] md:w-[320px] bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl p-4 md:p-5 hover:shadow-lg hover:border-blue-500/30 transition-all duration-300 group">
      <div className="h-20 md:h-28 bg-white rounded-xl overflow-hidden flex items-center justify-center border border-slate-200 px-4 md:px-5 py-3 md:py-4">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={companyName}
            className="w-full h-full object-contain"
          />
        ) : (
          <Building2 className="w-10 md:w-12 h-10 md:h-12 text-slate-400" />
        )}
      </div>
    </div>
  );
};

export default CompanyCard;
