import React from 'react';
import AdminLayout from '../components/AdminLayout';
import { Gavel, AlertTriangle, RefreshCw, Trash2, ShieldAlert } from 'lucide-react';

const AdminArbitrage = () => {
  const conflits = [
    { id: 1, type: 'Collision de Salle', detail: 'Amphi 250 occupé par ICT-L2 et MAT-L1', heure: 'Lundi 08:00', gravite: 'Haute' },
    { id: 2, type: 'Double Programmation', detail: 'Dr. Tanon affecté à deux cours simultanés', heure: 'Mardi 10:00', gravite: 'Critique' },
  ];

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Module d'Arbitrage</h1>
          <p className="text-slate-400 text-sm">Résolution des conflits et ajustements finaux</p>
        </div>
        <button className="flex items-center space-x-2 text-blue-600 font-bold bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-all">
          <RefreshCw size={18} /> <span>Actualiser l'analyse</span>
        </button>
      </div>

      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-[24px] mb-8">
        <div className="flex items-center space-x-3 text-red-700">
          <ShieldAlert size={24} />
          <p className="font-black text-lg">Attention : {conflits.length} conflits détectés</p>
        </div>
        <p className="text-red-600/70 text-sm mt-1">Le planning final ne peut pas être publié tant que ces erreurs persistent.</p>
      </div>

      <div className="space-y-4">
        {conflits.map((c) => (
          <div key={c.id} className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-sm flex items-center justify-between group">
            <div className="flex items-center space-x-6">
              <div className={`p-4 rounded-2xl ${c.gravite === 'Critique' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                <AlertTriangle size={24} />
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${c.gravite === 'Critique' ? 'bg-red-600 text-white' : 'bg-orange-500 text-white'}`}>
                    {c.gravite}
                  </span>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{c.heure}</p>
                </div>
                <h3 className="text-lg font-black text-slate-800">{c.type}</h3>
                <p className="text-slate-500 font-medium">{c.detail}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-all">
              <button className="px-6 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-blue-600 transition-all">Arbitrer</button>
              <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl"><Trash2 size={20}/></button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminArbitrage;