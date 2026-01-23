import React from 'react';
import TeacherLayout from '../components/TeacherLayout';
import { FileText, Upload, Trash2, ExternalLink, FileCode, FolderOpen } from 'lucide-react';

const TeacherResources = () => {
  const resources = [
    { id: 1, titre: "Support de Cours - Chapitre 1", type: "PDF", taille: "2.4 MB", ue: "ICT203", date: "12/01/2026" },
    { id: 2, titre: "Énoncé du TP n°1", type: "DOCX", taille: "1.1 MB", ue: "ICT203", date: "15/01/2026" },
  ];

  return (
    <TeacherLayout>
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase italic mb-2">Ressources & Supports</h1>
          <p className="text-slate-400 text-sm font-medium italic">Gestion des documents pédagogiques et supports de cours.</p>
        </div>
        <button className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center shadow-xl shadow-blue-100 hover:scale-105 transition-all">
          <Upload size={18} className="mr-2" /> Téléverser un fichier
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Liste des fichiers */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center space-x-3 text-slate-400">
            <FolderOpen size={20} />
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Documents Partagés</h3>
          </div>
          
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-10 py-5">Nom du document</th>
                <th className="px-10 py-5">Unité d'Ens.</th>
                <th className="px-10 py-5">Format / Taille</th>
                <th className="px-10 py-5">Date d'ajout</th>
                <th className="px-10 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {resources.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        {res.type === "PDF" ? <FileText size={20} /> : <FileCode size={20} />}
                      </div>
                      <p className="font-bold text-slate-700 text-sm">{res.titre}</p>
                    </div>
                  </td>
                  <td className="px-10 py-6 font-black text-blue-600 text-[11px] italic uppercase tracking-widest">{res.ue}</td>
                  <td className="px-10 py-6 text-xs text-slate-400 font-bold uppercase tracking-tighter">
                    {res.type} <span className="text-slate-200 mx-2">|</span> {res.taille}
                  </td>
                  <td className="px-10 py-6 text-xs text-slate-500 font-medium">{res.date}</td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end space-x-2">
                      <button className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                        <ExternalLink size={18} />
                      </button>
                      <button className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {resources.length === 0 && (
            <div className="py-20 text-center text-slate-300 italic font-medium uppercase tracking-widest">
              Aucune ressource partagée pour le moment
            </div>
          )}
        </div>
      </div>
    </TeacherLayout>
  );
};

export default TeacherResources;