import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getStats, getClasses } from '../services/api'; 
import { Users, DoorOpen, ClipboardCheck, AlertTriangle, Search, Layers, Home } from 'lucide-react';

const AdminDashboard = () => {
  // --- 1. ÉTAT DES DONNÉES RÉELLES ---
  const [stats, setStats] = useState({
    totalEtudiants: 0,
    countTeachers: 0,
    countSalles: 0,
    countVoeux: 0,
    capaciteTotale: 0
  });

  const [classesList, setClassesList] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 2. ÉTAT DES FILTRES ---
  const [filters, setFilters] = useState({
    recherche: '',
    departement: 'Tous',
    statut: 'Tous'
  });

  // Chargement des données au démarrage
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Récupération des statistiques globales
        const resStats = await getStats();
        if (resStats.data) setStats(resStats.data);

        // 2. RÉCUPÉRATION DES CLASSES VÉRITABLES
        const resClasses = await getClasses();
        if (resClasses.data) {
          const classesFormatees = resClasses.data.map(c => ({
            ...c,
            dept: c.departement || c.filiere || 'Non défini',
            statut: 'En cours', 
            prog: 45 
          }));
          setClassesList(classesFormatees);

          // Calcul du total d'étudiants réel basé sur la somme des effectifs des classes
          const totalReel = resClasses.data.reduce((acc, curr) => acc + curr.effectif, 0);
          setStats(prev => ({ ...prev, totalEtudiants: totalReel }));
        }
        setLoading(false);
      } catch (err) {
        console.error("Erreur de chargement des données:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- 3. LOGIQUE DE FILTRAGE ---
  const filteredClasses = classesList.filter(c => {
    const matchSearch = c.nom.toLowerCase().includes(filters.recherche.toLowerCase());
    const matchDept = filters.departement === 'Tous' || c.dept === filters.departement;
    const matchStatut = filters.statut === 'Tous' || c.statut === filters.statut;
    return matchSearch && matchDept && matchStatut;
  });

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight italic">Console Centrale</h1>
          <p className="text-slate-400 text-sm font-medium">Vue globale et paramétrage des emplois du temps</p>
        </div>
      </div>

      {/* --- SECTION 1 : CHIFFRES CLÉS (Mis à jour pour inclure le nombre de salles) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {[
          { label: 'Étudiants', val: stats.totalEtudiants, icon: Users, color: 'blue', sub: 'Effectif total' },
          { label: 'Salles', val: stats.countSalles, icon: Home, color: 'orange', sub: 'Espaces en DB' },
          { label: 'Capacité', val: stats.capaciteTotale, icon: DoorOpen, color: 'emerald', sub: 'Places assises' },
          { label: 'Enseignants', val: stats.countTeachers, icon: ClipboardCheck, color: 'purple', sub: 'Enregistrés' },
          { label: 'Conflits', val: stats.countVoeux, icon: AlertTriangle, color: 'red', sub: 'À arbitrer' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className={`p-2.5 rounded-xl bg-${s.color}-50 text-${s.color}-600`}>
                <s.icon size={20} />
              </div>
            </div>
            <div>
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">{s.label}</p>
              <div className="flex items-baseline space-x-1">
                <p className="text-2xl font-black text-slate-800 tracking-tighter">{s.val}</p>
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">{s.sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- SECTION 2 : PARAMÉTRAGE ET SURVEILLANCE CLASSES --- */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <h3 className="text-lg font-bold text-slate-800 flex items-center italic">
              <Layers className="mr-2 text-blue-600" size={20} /> 
              Classes existantes <span className="ml-2 text-xs text-slate-400 font-bold">({filteredClasses.length})</span>
            </h3>

            {/* BARRE DE FILTRES MISE À JOUR */}
            <div className="flex flex-wrap gap-3 w-full lg:w-auto justify-end">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" placeholder="Rechercher..."
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                  value={filters.recherche}
                  onChange={(e) => setFilters({...filters, recherche: e.target.value})}
                />
              </div>

              {/* Option de département mise à jour */}
              <select 
                className="py-2.5 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none cursor-pointer hover:border-blue-300 transition-colors"
                value={filters.departement}
                onChange={(e) => setFilters({...filters, departement: e.target.value})}
              >
                <option value="Tous">Tous Départements</option>
                <option value="Informatique">Informatique</option>
                <option value="Mathématiques">Mathématiques</option>
                <option value="Physique">Physique</option>
                <option value="Chimie">Chimie</option>
                <option value="Biologie">Biologie</option>
              </select>

              <select 
                className="py-2.5 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none cursor-pointer hover:border-blue-300 transition-colors"
                value={filters.statut}
                onChange={(e) => setFilters({...filters, statut: e.target.value})}
              >
                <option value="Tous">Tous Statuts</option>
                <option value="Complet">Complet</option>
                <option value="En cours">En cours</option>
                <option value="En conflit">En conflit</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tableau des données */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
              <tr>
                <th className="px-8 py-5">Classe</th>
                <th className="px-8 py-5">Filière / Département</th>
                <th className="px-8 py-5 text-center">Effectif Réel</th>
                <th className="px-8 py-5">Progression</th>
                <th className="px-8 py-5 text-center">Statut</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="6" className="py-20 text-center text-slate-400 animate-pulse font-bold italic">Synchronisation des données en cours...</td></tr>
              ) : filteredClasses.length === 0 ? (
                <tr><td colSpan="6" className="px-8 py-12 text-center text-slate-400 italic font-medium">Aucun résultat trouvé dans la base de données.</td></tr>
              ) : (
                filteredClasses.map((cls) => (
                  <tr key={cls.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6 font-bold text-slate-800">{cls.nom}</td>
                    <td className="px-8 py-6 text-slate-500 font-bold text-xs uppercase tracking-tighter">{cls.dept}</td>
                    <td className="px-8 py-6 text-center font-black text-[#1d76f2] italic">{cls.effectif}</td>
                    <td className="px-8 py-6 w-64">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className={`h-full transition-all duration-1000 ${cls.prog === 100 ? 'bg-emerald-500' : 'bg-[#1d76f2]'}`} 
                            style={{width: `${cls.prog}%`}}
                          ></div>
                        </div>
                        <span className="text-[10px] font-black text-slate-300 italic">{cls.prog}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase border tracking-tighter ${
                        cls.statut === 'Complet' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                        {cls.statut}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="text-xs font-black text-[#1d76f2] hover:bg-blue-50 px-4 py-2 rounded-xl transition-all border border-transparent hover:border-blue-100">
                        Gérer l'EDT
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;