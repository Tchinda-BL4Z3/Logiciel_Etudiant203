import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { 
  User, Book, Clock, Check, X, Search, 
  Filter, Loader2, AlertCircle, RotateCcw, MessageSquare
} from 'lucide-react';

const AdminVoeux = () => {
  const [voeux, setVoeux] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('TOUS');

  // --- FONCTION DE RÉCUPÉRATION ---
  const fetchVoeux = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/desiderata');
      if (response.ok) {
        const data = await response.json();
        setVoeux(data);
      }
    } catch (error) {
      console.error("Erreur de récupération des vœux :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVoeux();
  }, []);

  // --- FONCTION D'ACTION (VALIDER / REJETER / RÉINITIALISER) ---
  const handleAction = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/desiderata/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setVoeux(prevVoeux => 
          prevVoeux.map(v => v.id === id ? { ...v, status: newStatus } : v)
        );
      } else {
        const err = await response.json();
        alert("Erreur serveur : " + err.error);
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      alert("Impossible de communiquer avec le serveur");
    }
  };

  // --- CALCUL DES COMPTEURS ---
  const getStats = () => {
    return {
      total: voeux.length,
      valides: voeux.filter(v => v.status?.toUpperCase() === 'VALIDÉ').length,
      attente: voeux.filter(v => 
        !v.status || 
        v.status?.toUpperCase() === 'EN ATTENTE' || 
        v.status === ""
      ).length,
      rejetes: voeux.filter(v => v.status?.toUpperCase() === 'REJETÉ').length
    };
  };

  const stats = getStats();

  // --- LOGIQUE DE FILTRAGE ET RECHERCHE ---
  const filteredVoeux = voeux.filter(v => {
    const searchLow = searchTerm.toLowerCase();
    const matchesSearch = 
      (v.enseignant?.nom?.toLowerCase().includes(searchLow)) || 
      (v.ue_code?.toLowerCase().includes(searchLow));
    
    const currentStatus = (!v.status || v.status === "" || v.status.toUpperCase() === 'EN ATTENTE') 
                          ? 'EN ATTENTE' 
                          : v.status.toUpperCase();
                          
    const matchesFilter = filterStatus === 'TOUS' || currentStatus === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout>
      {/* HEADER DE LA PAGE */}
      <div className="flex justify-between items-end mb-8 text-left">
        <div>
          <h1 className="text-2xl font-black text-slate-800 italic uppercase tracking-tighter">Arbitrage des Vœux</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Gérez les préférences horaires des enseignants</p>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
                type="text" 
                placeholder="Rechercher un prof ou une UE..."
                className="pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-bold w-72 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="bg-white border border-slate-100 rounded-2xl px-5 py-3 text-[10px] font-black text-slate-500 uppercase outline-none shadow-sm cursor-pointer hover:bg-slate-50 transition-all"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="TOUS">Tous les Statuts</option>
            <option value="EN ATTENTE">En Attente</option>
            <option value="VALIDÉ">Validé</option>
            <option value="REJETÉ">Rejeté</option>
          </select>
        </div>
      </div>

      {/* --- CARTES DE STATISTIQUES --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-7 rounded-[32px] border border-slate-50 shadow-sm transition-transform hover:scale-[1.02]">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 text-left">Total Requêtes</p>
          <p className="text-5xl font-black italic text-slate-800 text-left">{stats.total}</p>
        </div>
        <div className="bg-white p-7 rounded-[32px] border-l-[6px] border-l-green-500 shadow-sm transition-transform hover:scale-[1.02]">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 text-left">Validés</p>
          <p className="text-5xl font-black text-green-600 italic text-left">{stats.valides}</p>
        </div>
        <div className="bg-white p-7 rounded-[32px] border-l-[6px] border-l-orange-500 shadow-sm transition-transform hover:scale-[1.02]">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 text-left">En attente</p>
          <p className="text-5xl font-black text-orange-600 italic text-left">{stats.attente}</p>
        </div>
        <div className="bg-white p-7 rounded-[32px] border-l-[6px] border-l-red-500 shadow-sm transition-transform hover:scale-[1.02]">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 text-left">Rejetés</p>
          <p className="text-5xl font-black text-red-600 italic text-left">{stats.rejetes}</p>
        </div>
      </div>

      {/* --- TABLEAU DES VOEUX --- */}
      <div className="bg-white rounded-[40px] shadow-sm border border-slate-50 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <tr>
              <th className="px-10 py-7">Enseignant</th>
              <th className="px-10 py-7">UE</th>
              <th className="px-10 py-7">Plage Horaire & Notice</th>
              <th className="px-10 py-7 text-center">Statut Actuel</th>
              <th className="px-10 py-7 text-right">Actions d'arbitrage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <Loader2 className="animate-spin text-blue-500" size={30} />
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Récupération des données...</span>
                    </div>
                  </td>
                </tr>
            ) : filteredVoeux.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Aucun vœu trouvé</p>
                  </td>
                </tr>
            ) : filteredVoeux.map((voeu) => {
                const normalizedStatus = (voeu.status || "").toUpperCase();
                const isPending = !voeu.status || voeu.status === "" || normalizedStatus === 'EN ATTENTE';
                
                return (
                    <tr key={voeu.id} className="hover:bg-slate-50/50 transition-all group">
                        <td className="px-10 py-6">
                            <div className="flex items-center space-x-5">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-sm uppercase shadow-sm">
                                  {voeu.enseignant?.nom?.substring(0, 2)}
                                </div>
                                <span className="font-black text-slate-700 italic uppercase text-sm tracking-tighter">{voeu.enseignant?.nom}</span>
                            </div>
                        </td>
                        <td className="px-10 py-6">
                            <div className="flex flex-col">
                              <span className="text-sm font-black text-slate-800 uppercase tracking-tight">{voeu.ue_code}</span>
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest italic">Code UE</span>
                            </div>
                        </td>
                        <td className="px-10 py-6 max-w-xs">
                            <div className="flex items-center font-black text-blue-600 text-sm italic uppercase tracking-tighter mb-2">
                                <Clock size={14} className="mr-2 text-blue-300" />
                                {voeu.jour}, {voeu.plageHoraire}
                            </div>
                            {/* AFFICHAGE DE LA NOTICE ICI */}
                            {voeu.notice && (
                              <div className="flex items-start gap-2 bg-yellow-50 p-3 rounded-xl border border-yellow-100 w-full">
                                <MessageSquare size={14} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                                <p className="text-[10px] font-bold text-yellow-700 italic leading-snug break-words">
                                  {voeu.notice}
                                </p>
                              </div>
                            )}
                        </td>
                        <td className="px-10 py-6 text-center">
                            <span className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase shadow-sm ${
                                normalizedStatus === 'VALIDÉ' ? 'bg-green-50 text-green-600 border border-green-100' : 
                                normalizedStatus === 'REJETÉ' ? 'bg-red-50 text-red-600 border border-red-100' : 
                                'bg-blue-50 text-blue-600 border border-blue-100'
                            }`}>
                                {voeu.status || "EN ATTENTE"}
                            </span>
                        </td>
                        <td className="px-10 py-6 text-right">
                            <div className="flex justify-end items-center space-x-3">
                                {isPending ? (
                                    <div className="flex space-x-3 animate-in fade-in zoom-in duration-300">
                                        <button 
                                            onClick={() => handleAction(voeu.id, 'VALIDÉ')}
                                            className="px-5 py-2.5 bg-green-600 text-white rounded-2xl font-black text-[9px] uppercase hover:bg-green-700 hover:scale-105 active:scale-95 shadow-lg shadow-green-100 transition-all flex items-center"
                                        >
                                            <Check size={14} className="mr-1.5"/> Accepter
                                        </button>
                                        <button 
                                            onClick={() => handleAction(voeu.id, 'REJETÉ')}
                                            className="px-5 py-2.5 bg-red-600 text-white rounded-2xl font-black text-[9px] uppercase hover:bg-red-700 hover:scale-105 active:scale-95 shadow-lg shadow-red-100 transition-all flex items-center"
                                        >
                                            <X size={14} className="mr-1.5"/> Rejeter
                                        </button>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => handleAction(voeu.id, 'EN ATTENTE')}
                                        className="px-5 py-2.5 bg-slate-100 text-slate-400 rounded-2xl font-black text-[9px] uppercase hover:bg-slate-200 hover:text-slate-600 transition-all flex items-center"
                                    >
                                        <RotateCcw size={12} className="mr-1.5"/> Modifier la décision
                                    </button>
                                )}
                            </div>
                        </td>
                    </tr>
                )
            })}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminVoeux;