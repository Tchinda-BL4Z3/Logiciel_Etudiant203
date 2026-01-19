import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Users, Plus, Layers, TrendingUp, Search, Trash2, Edit3, CheckCircle2 } from 'lucide-react';

const AdminClasses = () => {
  const [classes] = useState([
    { id: 1, nom: 'ICT-L2', effectif: 120, dept: 'Informatique', prog: 80 },
    { id: 2, nom: 'ICT-L3', effectif: 85, dept: 'Informatique', prog: 100 },
    { id: 3, nom: 'MATH-L1', effectif: 250, dept: 'Mathématiques', prog: 30 },
  ]);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Gestion des Classes</h1>
          <p className="text-slate-400 text-sm">Suivez les effectifs et l'avancement des plannings</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center shadow-lg shadow-blue-200 transition-all">
          <Plus size={20} className="mr-2" /> Créer une classe
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Étudiants</p>
            <p className="text-3xl font-black text-slate-800">{classes.reduce((acc, c) => acc + c.effectif, 0)}</p>
          </div>
          <Users className="text-blue-100" size={40} />
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Plannings Terminés</p>
            <div className="flex items-center space-x-2">
                <p className="text-3xl font-black text-green-600">1</p>
                <span className="text-xs font-bold text-slate-400">sur {classes.length}</span>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <tr>
              <th className="px-8 py-5">Nom de Classe</th>
              <th className="px-8 py-5">Département</th>
              <th className="px-8 py-5 text-center">Effectif</th>
              <th className="px-8 py-5">Progression EDT</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {classes.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5">
                   <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Layers size={18}/></div>
                      <span className="font-bold text-slate-800">{c.nom}</span>
                   </div>
                </td>
                <td className="px-8 py-5 text-slate-500 font-medium">{c.dept}</td>
                <td className="px-8 py-5 text-center font-black text-slate-700">{c.effectif}</td>
                <td className="px-8 py-5 w-64">
                   <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${c.prog === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{width: `${c.prog}%`}}></div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">{c.prog}%</span>
                   </div>
                </td>
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

export default AdminClasses;