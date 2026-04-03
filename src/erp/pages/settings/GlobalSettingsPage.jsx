import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useSettingStore from '../../stores/settingStore';
import PageHeader from '../../components/common/PageHeader';
import { Building, Mail, Phone, MapPin, Hash, FileText, Calendar, Save, CheckCircle } from 'lucide-react';

const GlobalSettingsPage = () => {
  const { settings, isLoading, error, fetchSettings, updateSettings } = useSettingStore();
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (settings) {
      // Prefill form when settings load
      reset({
        instituteName: settings.instituteName || '',
        instituteCode: settings.instituteCode || '',
        contactEmail: settings.contactEmail || '',
        contactPhone: settings.contactPhone || '',
        address: settings.address || '',
        currentAcademicYear: settings.currentAcademicYear || '',
        receiptPrefix: settings.receiptPrefix || '',
        studentUidFormat: settings.studentUidFormat || '',
      });
    }
  }, [settings, reset]);

  const onSubmit = async (data) => {
    setSaveSuccess(false);
    const result = await updateSettings(data);
    if (result.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  if (isLoading && !settings) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <PageHeader 
        title="Institute Settings" 
        subtitle="Configure global ERP variables, receipt prefixes, and contact information." 
      />

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
          <p className="font-medium">Error saving settings:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {saveSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-5 h-5" />
          <p className="font-medium">Settings saved successfully!</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* General Information Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/50 p-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Building className="w-5 h-5 text-emerald-600" />
              General Information
            </h2>
            <p className="text-sm text-slate-500 mt-1">Primary details displayed on receipts and reports.</p>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Institute Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  {...register('instituteName', { required: 'Name is required' })}
                  type="text"
                  className="pl-10 w-full rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 bg-slate-50 focus:bg-white transition-colors"
                  placeholder="e.g. Aryabhatta National Skill Dev."
                />
              </div>
              {errors.instituteName && <p className="mt-1 text-sm text-red-500">{errors.instituteName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Institute Code</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Hash className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  {...register('instituteCode', { required: 'Code is required' })}
                  type="text"
                  className="pl-10 w-full rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 bg-slate-50 focus:bg-white transition-colors uppercase"
                  placeholder="e.g. ANSDB"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  {...register('contactEmail')}
                  type="email"
                  className="pl-10 w-full rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 bg-slate-50 focus:bg-white transition-colors"
                  placeholder="admin@institute.edu"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Phone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  {...register('contactPhone')}
                  type="text"
                  className="pl-10 w-full rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 bg-slate-50 focus:bg-white transition-colors"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Campus Address</label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <MapPin className="h-4 w-4 text-slate-400" />
                </div>
                <textarea
                  {...register('address')}
                  rows={3}
                  className="pl-10 w-full rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 bg-slate-50 focus:bg-white transition-colors"
                  placeholder="Full physical address for official documents..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* System Configuration Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/50 p-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              System Configuration
            </h2>
            <p className="text-sm text-slate-500 mt-1">Core format schemas used for automatic generation.</p>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Current Academic Year</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  {...register('currentAcademicYear', { required: 'Academic Year is required' })}
                  type="text"
                  className="pl-10 w-full rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 bg-slate-50 focus:bg-white transition-colors"
                  placeholder="e.g. 2026-27"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Update this annually to roll over batches automatically.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fee Receipt Prefix</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  {...register('receiptPrefix')}
                  type="text"
                  className="pl-10 w-full rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 bg-slate-50 focus:bg-white uppercase transition-colors"
                  placeholder="e.g. REC-"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Prefix attached to all payment invoices (e.g. REC-1024).</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Student UID Generation Format</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Hash className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  {...register('studentUidFormat')}
                  type="text"
                  className="pl-10 w-full rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 bg-slate-50 focus:bg-white uppercase font-mono text-sm transition-colors"
                  placeholder="{INST}-{YEAR}-{COURSE}-{SEQ}"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Available tags: <span className="text-xs bg-slate-100 text-slate-700 py-0.5 px-1 rounded border border-slate-200 font-mono">literal</span>
                {' '}• <span className="text-xs bg-slate-100 text-slate-700 py-0.5 px-1 rounded border border-slate-200 font-mono">literal</span>
                — Not fully implemented on frontend yet but stores template for future ID generation scale.
              </p>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-sm shadow-emerald-200 transition-all focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-70"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
            ) : (
              <Save className="w-5 h-5" />
            )}
            Save Configuration
          </button>
        </div>

      </form>
    </div>
  );
};

export default GlobalSettingsPage;
