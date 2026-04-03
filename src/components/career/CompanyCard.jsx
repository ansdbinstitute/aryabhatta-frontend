import React from 'react';
import { Building2, ExternalLink } from 'lucide-react';

const CompanyCard = ({ partner }) => {
  const getLogoUrl = (logo) => {
    if (!logo) return null;
    if (logo.url) return logo.url.startsWith('http') ? logo.url : `${import.meta.env.VITE_STRAPI_URL || ''}${logo.url}`;
    if (logo.data?.attributes?.url) return logo.data.attributes.url;
    return null;
  };

  const logoUrl = getLogoUrl(partner.logo);
  const companyName = partner.companyName || partner.name || 'Company';
  const description = partner.description;
  const website = partner.website;

  return (
    <div className="flex-shrink-0 w-[320px] bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl p-4 hover:shadow-lg hover:border-blue-500/30 transition-all duration-300 group">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center border border-slate-200">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={companyName}
              className="w-full h-full object-contain p-2"
            />
          ) : (
            <Building2 className="w-8 h-8 text-slate-400" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
            {companyName}
          </h3>
          {description && (
            <p className="text-xs text-slate-500 line-clamp-2 mt-1">
              {description}
            </p>
          )}
          {website && (
            <a
              href={website.startsWith('http') ? website : `https://${website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors mt-2"
              onClick={(e) => e.stopPropagation()}
            >
              Visit Website <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
