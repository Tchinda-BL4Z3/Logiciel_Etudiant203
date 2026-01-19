import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { DoorOpen, Plus, Search, Trash2, Edit3, Filter, CheckCircle2 } from 'lucide-react';

const AdminSalles = () => {
  // État local pour simuler les données (à connecter à ton API Node.js plus tard)
  const [salles, setSalles] = useState([
    { id: 1, nom: 'Amphi 250', capacite: 250, batiment: 'Bloc A', statut: 'Disponible' },
    { id: 2, nom: 'Salle 102', capacite: 60, batiment: 'Bloc B', statut: 'Occupée' },
    { id: 3, nom: 'Labo Info 1', capacite: 30, batiment: 'Nouveau Bloc', statut: 'Disponible' },
  ]);

  const [showModal, setShowModal] = useState(false);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Gestion des Salles</h1>
          <p className="text-slate-400 text-sm">Configurez les espaces physiques de l'établissement</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center shadow-lg shadow-blue-200 transition-all"
        >
          <Plus size={20} className="mr-2" /> Ajouter une salle
        </button>
      </div>

      {/* --- STATS RAPIDES --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Salles</p>
          <p className="text-3xl font-black text-slate-800">{salles.length}</p>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Capacité Totale</p>
          <p className="text-3xl font-black text-blue-600">
            {salles.reduce((acc, s) => acc + s.capacite, 0)} places
          </p>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">État Système</p>
            <p className="text-lg font-bold text-green-600">Optimisé</p>
          </div>
          <CheckCircle2 className="text-green-500" size={32} />
        </div>
      </div>

      {/* --- BARRE DE RECHERCHE & FILTRES --- */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 mb-6 flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou bâtiment..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <button className="ml-4 p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors">
          <Filter size={20} />
        </button>
      </div>

      {/* --- TABLEAU DES SALLES --- */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <tr>
              <th className="px-8 py-5">Nom de la Salle</th>
              <th className="px-8 py-5">Bâtiment</th>
              <th className="px-8 py-5 text-center">Capacité (Places)</th>
              <th className="px-8 py-5">Statut</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {salles.map((salle) => (
              <tr key={salle.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5 font-bold text-slate-700">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mr-3">
                      <DoorOpen size={16} />
                    </div>
                    {salle.nom}
                  </div>
                </td>
                <td className="px-8 py-5 text-slate-500 font-medium">{salle.batiment}</td>
                <td className="px-8 py-5 text-center">
                  <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-black">
                    {salle.capacite}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase ${
                    salle.statut === 'Disponible' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {salle.statut}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                      <Edit3 size={18} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODAL AJOUT (Simplifié) --- */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
          <div className="bg-white w-full max-w-lg rounded-[32px] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black text-slate-800 mb-6">Ajouter une nouvelle salle</h2>
            <form className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Nom / Code de la salle</label>
                <input type="text" placeholder="ex: Salle 105" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Capacité</label>
                  <input type="number" placeholder="ex: 50" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Bâtiment</label>
                  <input type="text" placeholder="ex: Bloc A" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
              </div>
              <div className="flex space-x-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-slate-400 font-bold hover:bg-slate-50 rounded-2xl transition-all">Annuler</button>
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminSalles;