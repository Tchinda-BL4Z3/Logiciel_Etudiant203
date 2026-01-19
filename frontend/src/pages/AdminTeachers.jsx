import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { UserSquare2, Plus, Search, Mail, BookOpen, Trash2, Edit3, ClipboardList } from 'lucide-react';

const AdminTeachers = () => {
  const [teachers] = useState([
    { id: 1, nom: 'Dr. Tanon', email: 'tanon@uy1.cm', dept: 'Informatique', specialite: 'Génie Logiciel', cours: 3 },
    { id: 2, nom: 'Mme Eboa', email: 'eboa@uy1.cm', dept: 'Mathématiques', specialite: 'Analyse', cours: 2 },
    { id: 3, nom: 'Pr. Ndongo', email: 'ndongo@uy1.cm', dept: 'Informatique', specialite: 'Réseaux', cours: 4 },
  ]);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Gestion des Enseignants</h1>
          <p className="text-slate-400 text-sm">Gérez les profils et les attributions de cours</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center shadow-lg shadow-blue-200 transition-all">
          <Plus size={20} className="mr-2" /> Ajouter un enseignant
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><UserSquare2 size={24}/></div>
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Total Professeurs</p>
            <p className="text-2xl font-black text-slate-800">{teachers.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl"><ClipboardList size={24}/></div>
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Vœux Reçus</p>
            <p className="text-2xl font-black text-cyan-600">85%</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <tr>
              <th className="px-8 py-5">Enseignant</th>
              <th className="px-8 py-5">Département</th>
              <th className="px-8 py-5">Spécialité</th>
              <th className="px-8 py-5 text-center">Cours</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {teachers.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">
                      {t.nom.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{t.nom}</p>
                      <p className="text-xs text-slate-400">{t.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 text-slate-600 font-medium">{t.dept}</td>
                <td className="px-8 py-5">
                   <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase">{t.specialite}</span>
                </td>
                <td className="px-8 py-5 text-center font-black text-slate-700">{t.cours}</td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit3 size={18}/></button>
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminTeachers;