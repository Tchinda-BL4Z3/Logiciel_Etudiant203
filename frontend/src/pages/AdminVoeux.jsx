import React from 'react';
import AdminLayout from '../components/AdminLayout';
import { ClipboardList, Check, X, Clock } from 'lucide-react';

const AdminVoeux = () => {
  const voeux = [
    { id: 1, prof: 'Dr. Tanon', ue: 'ICT203', jour: 'Lundi', plage: '08:00 - 12:00', note: 'Préférence matinée', date: '15/01/2026' },
    { id: 2, prof: 'Mme Eboa', ue: 'MAT101', jour: 'Mercredi', plage: '13:00 - 15:00', note: 'Disponible uniquement aprem', date: '16/01/2026' },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800">Vœux des Enseignants</h1>
        <p className="text-slate-400 text-sm">Consultez et validez les préférences de plages horaires</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {voeux.map((v) => (
          <div key={v.id} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center justify-between hover:border-blue-200 transition-all">
            <div className="flex items-center space-x-6">
              <div className="bg-blue-50 p-4 rounded-2xl text-blue-600"><Clock size={24}/></div>
              <div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">{v.ue}</p>
                <h3 className="text-lg font-black text-slate-800">{v.prof}</h3>
                <p className="text-sm text-slate-500">{v.jour} • <span className="font-bold text-slate-700">{v.plage}</span></p>
              </div>
              <div className="hidden md:block border-l pl-6 border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Note de l'enseignant</p>
                <p className="text-sm italic text-slate-600">"{v.note}"</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"><Check size={20}/></button>
              <button className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"><X size={20}/></button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminVoeux;