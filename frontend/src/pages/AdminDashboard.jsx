import React from 'react';
import AdminLayout from '../components/AdminLayout';
import { Users, DoorOpen, ClipboardCheck, AlertTriangle, MoreHorizontal } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Lun', cours: 12 }, { name: 'Mar', cours: 18 }, { name: 'Mer', cours: 15 },
  { name: 'Jeu', cours: 22 }, { name: 'Ven', cours: 10 }, { name: 'Sam', cours: 5 },
];

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-black text-slate-800 mb-8">Tableau de Bord</h1>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Étudiants', val: '2,840', icon: Users, color: 'blue', change: '+4%' },
          { label: 'Enseignants', val: '156', icon: ClipboardCheck, color: 'purple', change: 'Stable' },
          { label: 'Occupation Salles', val: '78.5%', icon: DoorOpen, color: 'orange', change: 'Optimal' },
          { label: 'Vœux en attente', val: '42', icon: AlertTriangle, color: 'red', change: 'Urgent' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 bg-${s.color}-50 text-${s.color}-600 rounded-xl`}>
                <s.icon size={24} />
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full bg-${s.color}-100 text-${s.color}-700`}>
                {s.change}
              </span>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{s.label}</p>
            <p className="text-2xl font-black text-slate-800">{s.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Graphique */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Activité Hebdomadaire</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                <YAxis hide />
                <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="cours" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activités Récentes */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Activités Récentes</h3>
          <div className="space-y-6 text-sm">
            {[
              { t: 'Planning L3 Validé', d: 'Il y a 2 heures par Jean D.', c: 'green' },
              { t: 'Modification Salle 201', d: 'Il y a 4 heures', c: 'blue' },
              { t: 'Conflit détecté M1', d: 'Hier à 17:30', c: 'red' },
            ].map((act, i) => (
              <div key={i} className="flex space-x-4">
                <div className={`w-2 h-10 rounded-full bg-${act.c}-500 flex-shrink-0`}></div>
                <div>
                  <p className="font-bold text-slate-800">{act.t}</p>
                  <p className="text-slate-400 text-xs">{act.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tableau Surveillance Classes */}
      <div className="mt-8 bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Classes sous surveillance</h3>
          <button className="text-blue-600 font-bold text-sm">Voir détails</button>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <tr>
              <th className="px-8 py-4">Classe</th>
              <th className="px-8 py-4">Progression Planning</th>
              <th className="px-8 py-4">Statut</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {[
              { name: 'L3 Informatique', prog: 100, status: 'COMPLET', color: 'green' },
              { name: 'M1 Cybersécurité', prog: 65, status: 'EN COURS', color: 'blue' },
              { name: 'L2 Mathématiques', prog: 20, status: 'INITIALISATION', color: 'slate' },
            ].map((cls, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-6 font-bold text-slate-700">{cls.name}</td>
                <td className="px-8 py-6 w-64">
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className={`bg-${cls.color}-500 h-full`} style={{width: `${cls.prog}%`}}></div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-lg bg-${cls.color}-100 text-${cls.color}-700 uppercase`}>
                    {cls.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right text-slate-400">
                  <button><MoreHorizontal size={20} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;