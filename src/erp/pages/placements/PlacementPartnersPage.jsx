import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import usePlacementStore from '../../stores/placementStore';
import PageHeader from '../../components/common/PageHeader';
import { Building2, Plus, Trash2, Eye, EyeOff, Edit2, Star, ExternalLink } from 'lucide-react';

const PlacementPartnersPage = () => {
  const { partners, fetchPartners, deletePartner, isLoading } = usePlacementStore();

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      await deletePartner(id);
    }
  };

  const toggleActive = async (partner) => {
    const { updatePartner } = usePlacementStore.getState();
    await updatePartner(partner.documentId, {
      companyName: partner.companyName,
      website: partner.website,
      description: partner.description,
      logo: partner.logo?.id,
      isActive: !partner.isActive,
      displayOrder: partner.displayOrder,
    });
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <PageHeader
          title="Placement Partners"
          subtitle="Manage companies that hire our students for placements."
        />
        <Link 
          to="/erp/placements/partners/new"
          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Partner
        </Link>
      </div>

      {isLoading && partners.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : partners.length === 0 ? (
        <div className="bg-white border text-center border-slate-100 rounded-2xl p-16 shadow-sm">
          <Building2 className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700">No placement partners yet.</h3>
          <p className="text-sm text-slate-400 mt-2">Add companies that recruit from our institute.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Website</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {partners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {partner.logo?.url ? (
                          <img 
                            src={`${import.meta.env.VITE_STRAPI_URL || ''}${partner.logo.url}`}
                            alt={partner.companyName}
                            className="w-10 h-10 rounded-lg object-contain bg-white border"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-slate-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-slate-800">{partner.companyName}</p>
                          {partner.description && (
                            <p className="text-xs text-slate-400 line-clamp-1">{partner.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {partner.website ? (
                        <a 
                          href={partner.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          Visit <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-sm text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-600">
                        {partner.displayOrder || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        partner.isActive 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {partner.isActive ? (
                          <><Eye className="w-3 h-3" /> Active</>
                        ) : (
                          <><EyeOff className="w-3 h-3" /> Hidden</>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleActive(partner)}
                          className={`p-2 rounded-lg transition-colors ${
                            partner.isActive
                              ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                              : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={partner.isActive ? 'Hide' : 'Show'}
                        >
                          {partner.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <Link
                          to={`/erp/placements/partners/${partner.documentId}/edit`}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(partner.documentId, partner.companyName)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlacementPartnersPage;
