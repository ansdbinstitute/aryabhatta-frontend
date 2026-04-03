import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import usePlacementStore from '../../stores/placementStore';
import PageHeader from '../../components/common/PageHeader';
import { Building2, Globe, Plus, Trash2, Image, Save } from 'lucide-react';
import useToast from '../../hooks/useToast';

const PartnerFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const isEdit = Boolean(id);
  
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [existingLogo, setExistingLogo] = useState(null);
  const logoInputRef = React.useRef();
  
  const { createPartner, updatePartner, fetchPartners, partners, isLoading } = usePlacementStore();

  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      isActive: true,
      displayOrder: 0,
    }
  });

  useEffect(() => {
    if (isEdit) {
      fetchPartners().then(() => {
        const partner = partners.find(p => p.documentId === id);
        if (partner) {
          reset({
            companyName: partner.companyName || '',
            website: partner.website || '',
            description: partner.description || '',
            isActive: partner.isActive ?? true,
            displayOrder: partner.displayOrder || 0,
          });
          setExistingLogo(partner.logo);
        }
      });
    }
  }, [isEdit, id]);

  const handleLogoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedLogo(file);
    }
  };

  const onSubmit = async (data) => {
    let logoId = existingLogo?.id;
    
    if (selectedLogo) {
      const { uploadLogo } = usePlacementStore.getState();
      const uploadRes = await uploadLogo(selectedLogo);
      if (uploadRes.success) {
        logoId = uploadRes.fileId;
      } else {
        toast.error('Failed to upload logo: ' + uploadRes.error);
        return;
      }
    }

    const payload = {
      companyName: data.companyName,
      website: data.website || null,
      description: data.description || null,
      logo: logoId,
      isActive: data.isActive === true || data.isActive === 'true',
      displayOrder: parseInt(data.displayOrder) || 0,
    };

    const res = isEdit 
      ? await updatePartner(id, payload)
      : await createPartner(payload);

    if (res.success) {
      toast.success(isEdit ? 'Partner updated successfully' : 'Partner added successfully');
      navigate('/erp/placements/partners');
    } else {
      toast.error(res.error || 'Failed to save partner');
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <PageHeader
        title={isEdit ? 'Edit Partner' : 'Add New Partner'}
        subtitle="Add a company that recruits students from our institute."
        backTo="/erp/placements/partners"
      />

      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                Company Name *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                <input
                  {...register('companyName', { required: true })}
                  type="text"
                  placeholder="Google, Microsoft, TCS, etc."
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                Website URL
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                <input
                  {...register('website')}
                  type="url"
                  placeholder="https://www.company.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-medium"
                />
              </div>
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
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-medium"
              />
              <p className="text-xs text-slate-400 mt-1">Lower numbers appear first</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                Description
              </label>
              <textarea
                {...register('description')}
                rows="3"
                placeholder="Brief description of the partnership or company..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Company Logo</h4>
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6">
              <input 
                type="file" 
                className="hidden" 
                ref={logoInputRef}
                accept="image/*"
                onChange={handleLogoSelect}
              />
              
              {(selectedLogo || existingLogo) ? (
                <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-emerald-100">
                  <div className="flex items-center gap-4">
                    {selectedLogo ? (
                      <img 
                        src={URL.createObjectURL(selectedLogo)} 
                        alt="Preview" 
                        className="w-16 h-16 rounded-lg object-contain bg-white border"
                      />
                    ) : existingLogo?.url && (
                      <img 
                        src={`${import.meta.env.VITE_STRAPI_URL || ''}${existingLogo.url}`}
                        alt="Current logo"
                        className="w-16 h-16 rounded-lg object-contain bg-white border"
                      />
                    )}
                    <div>
                      <p className="text-sm font-bold text-slate-700">
                        {selectedLogo?.name || existingLogo?.name || 'Logo'}
                      </p>
                      {selectedLogo && (
                        <p className="text-xs text-slate-400">
                          {(selectedLogo.size / 1024).toFixed(1)} KB
                        </p>
                      )}
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      setSelectedLogo(null);
                      setExistingLogo(null);
                      if (logoInputRef.current) logoInputRef.current.value = '';
                    }}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button 
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="flex flex-col items-center gap-2 mx-auto"
                >
                  <div className="bg-white p-4 rounded-2xl shadow-sm">
                    <Image className="w-8 h-8 text-emerald-500" />
                  </div>
                  <p className="text-sm font-bold text-slate-600 mt-2">Click to select logo</p>
                  <p className="text-xs text-slate-400">PNG, JPG, SVG up to 2MB</p>
                </button>
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('isActive')}
                defaultChecked={true}
                className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm font-medium text-slate-700">
                Show on public website
              </span>
            </label>
          </div>

          <div className="pt-8 flex justify-end gap-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={() => navigate('/erp/placements/partners')}
              className="px-6 py-2.5 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="flex items-center gap-2 px-10 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-95 disabled:bg-slate-300"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {isEdit ? 'Update Partner' : 'Add Partner'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartnerFormPage;
