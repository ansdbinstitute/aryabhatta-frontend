import React, { useEffect, useState } from 'react';
import useCurrentStudent from '../hooks/useCurrentStudent';
import client, { extractData } from '../../erp/api/client';
import PageHeader from '../../erp/components/common/PageHeader';
import { 
  FileText, 
  Video, 
  Link as LinkIcon, 
  Download, 
  ExternalLink, 
  Search,
  Filter,
  Layers,
  BookOpen
} from 'lucide-react';
import { getMediaUrl } from '../../erp/utils/helpers';

const StudentStudyMaterialsPage = () => {
  const { student, isLoading: studentLoading } = useCurrentStudent();
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    const fetchMaterials = async () => {
      if (!student?.course?.id) return;
      
      setIsLoading(true);
      try {
        const response = await client.get('/materials', {
          params: {
            'filters[course][documentId][$eq]': student.course.id,
            populate: ['file', 'course'],
            sort: 'createdAt:desc',
          }
        });
        setMaterials(extractData(response) || []);
      } catch (error) {
        console.error('Failed to fetch materials:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (student) {
      fetchMaterials();
    }
  }, [student]);

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || m.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5" />;
      case 'link': return <LinkIcon className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  if (studentLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
             <BookOpen className="w-8 h-8 text-blue-600" />
             STUDY MATERIALS
          </h2>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1 opacity-70">
            Course: <span className="text-blue-600 underline underline-offset-4 decoration-blue-200">{student?.course?.title || 'GENERAL'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 w-64 lg:w-80 transition-all"
            />
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-1 flex gap-1">
            {['all', 'document', 'video', 'link'].map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  selectedType === type ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMaterials.length === 0 ? (
          <div className="md:col-span-2 xl:col-span-3 py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
             <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <Layers className="w-8 h-8" />
             </div>
             <h3 className="text-lg font-black text-slate-800">No Materials Found</h3>
             <p className="text-slate-400 text-sm font-medium mt-1">Check back later or search for something else.</p>
          </div>
        ) : (
          filteredMaterials.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-xl hover:border-blue-100 transition-all group flex flex-col h-full">
              <div className="flex items-start justify-between mb-6">
                <div className={`p-3 rounded-2xl transition-all group-hover:scale-110 shadow-inner ${
                  item.type === 'video' ? 'bg-rose-50 text-rose-500' : 
                  item.type === 'link' ? 'bg-blue-50 text-blue-500' : 
                  'bg-emerald-50 text-emerald-500'
                }`}>
                  {getIcon(item.type)}
                </div>
                <div className="px-3 py-1 bg-slate-50 rounded-full border border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-400">
                   {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex-1">
                <h4 className="text-lg font-black text-slate-800 tracking-tight mb-2 group-hover:text-blue-600 transition-colors">{item.title}</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                  {item.description || 'Access educational resources provided by your instructor to assist your studies.'}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                {item.type === 'link' ? (
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-xs font-black rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                  >
                    Open Link
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : item.type === 'video' && item.url ? (
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 text-white text-xs font-black rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-200"
                  >
                    Play Video
                    <Video className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <a 
                    href={getMediaUrl(item.file)} 
                    target="_blank" 
                    rel="noreferrer"
                    download
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white text-xs font-black rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                  >
                    Download
                    <Download className="w-3.5 h-3.5" />
                  </a>
                )}
                
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {item.type} • Resource
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentStudyMaterialsPage;
