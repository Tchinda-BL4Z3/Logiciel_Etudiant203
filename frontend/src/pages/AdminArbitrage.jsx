import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { 
  AlertTriangle, RefreshCcw, Trash2, Gavel, 
  Info, Calendar, Clock, MapPin, User, CheckCircle,
  BookOpen, GraduationCap, History, Layers, Search, ChevronDown, Activity
} from 'lucide-react';

const AdminArbitrage = () => {
  const [conflicts, setConflicts] = useState([]);
  const [history, setHistory] = useState([]); 
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFiliere, setFilterFiliere] = useState("Tous");

  const loadData = async () => {
    setIsAnalyzing(true);
    try {
      const conflictRes = await fetch('http://localhost:5000/api/conflicts');
      if (conflictRes.ok) {
        const conflictData = await conflictRes.json();
        setConflicts(conflictData);
      }
      
      const historyRes = await fetch(`http://localhost:5000/api/sessions?t=${Date.now()}`);
      if (historyRes.ok) {
        const historyData = await historyRes.json();
        setHistory(historyData);
      }
    } catch (error) {
      console.error("Erreur de chargement :", error);
    } finally {
      setTimeout(() => setIsAnalyzing(false), 800);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- MISE À JOUR : LISTE COMPLÈTE DES FILIÈRES DU SYSTÈME ---
  const masterFilieres = ["ICT4D", "Info Fonda", "Mathématiques", "Physique", "Chimie", "Biologie"];
  
  // On fusionne la liste fixe avec les filières trouvées dynamiquement pour être sûr de tout avoir
  const uniqueFilieres = [
    "Tous", 
    ...new Set([...masterFilieres, ...history.map(item => item.filiere).filter(f => f)])
  ];

  const filteredHistory = history.filter(item => {
    const matchesSearch = (item.classeName || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFiliere = filterFiliere === "Tous" || item.filiere === filterFiliere;
    return matchesSearch && matchesFiliere;
  });

  const handleResolve = (id) => {
    alert(`Ouverture du module de réaffectation pour le conflit ${id}`);
  };

  const handleDelete = async (conflictId, sessionId) => {
    if(window.confirm("Voulez-vous vraiment supprimer cette séance ? Cette action est irréversible.")) {
        try {
            const response = await fetch(`http://localhost:5000/api/sessions/${sessionId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setConflicts(prev => prev.filter(c => c.sessionId !== sessionId));
                setHistory(prev => prev.filter(s => s.id !== sessionId));
                setSuccessMsg('Action révoquée et supprimée de la base de données.');
                setTimeout(() => setSuccessMsg(''), 3000);
            }
        } catch (error) {
            console.error("Erreur suppression:", error);
        }
    }
  };

  return (
    <AdminLayout>
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic">Arbitrage & Suivi</h1>
          <p className="text-slate-400 font-semibold italic">Contrôle global des flux et résolution d'incidents</p>
        </div>
        <button 
          onClick={loadData}
          disabled={isAnalyzing}
          className="flex items-center space-x-3 bg-slate-900 text-white px-8 py-3.5 rounded-[22px] font-black uppercase text-[10px] tracking-[2px] hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
        >
          <RefreshCcw size={18} className={isAnalyzing ? 'animate-spin' : ''} />
          <span>{isAnalyzing ? 'Analyse en cours...' : "Analyser le système"}</span>
        </button>
      </div>

      {successMsg && (
        <div className="mb-8 bg-green-500 text-white p-5 rounded-[24px] flex items-center shadow-lg shadow-green-100 animate-in fade-in zoom-in">
          <CheckCircle size={24} className="mr-4" />
          <span className="font-black text-xs uppercase tracking-widest">{successMsg}</span>
        </div>
      )}

      {/* --- SECTION 1 : GUIDE & STATISTIQUES --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-blue-900 p-10 rounded-[45px] shadow-2xl shadow-blue-100 text-white border-b-8 border-blue-700">
              <h4 className="text-blue-300 font-black uppercase tracking-[4px] text-xs mb-6 flex items-center italic">
                <Info size={20} className="mr-3" /> Guide de l'Arbitre
              </h4>
              <p className="text-blue-100 text-sm italic font-medium leading-relaxed">
                Toute action effectuée ici modifie directement la base de données. 
                Le bouton <span className="text-white font-black underline underline-offset-4">révoquer</span> annule immédiatement la programmation de l'enseignant pour libérer les ressources.
              </p>
          </div>
          <div className="bg-white border-2 border-dashed border-slate-100 p-10 rounded-[45px] flex flex-col justify-center">
              <h4 className="text-slate-800 font-black uppercase tracking-[4px] text-xs mb-6 italic">Statistiques Système en temps réel</h4>
              <div className="flex justify-between items-end">
                  <div>
                      <p className="text-5xl font-black text-red-500 italic leading-none">{conflicts.length}</p>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">Conflits critiques</p>
                  </div>
                  <div className="text-right">
                      <p className="text-5xl font-black text-blue-600 italic leading-none">{history.length}</p>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">Séances validées</p>
                  </div>
              </div>
          </div>
      </div>

      {/* --- SECTION 2 : ALERTES CRITIQUES --- */}
      <div className="mb-16">
        <div className="flex items-center space-x-4 mb-8">
            <div className="h-8 w-2.5 bg-red-500 rounded-full shadow-lg shadow-red-200"></div>
            <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter">Traitement des Incidents</h2>
        </div>
        
        {conflicts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {conflicts.map((conflict) => (
              <div className="bg-white p-10 rounded-[45px] shadow-sm border-2 border-red-50 flex flex-col lg:flex-row items-center justify-between group hover:shadow-2xl hover:border-red-100 transition-all duration-500">
                <div className="flex items-center space-x-10 w-full">
                  <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center shadow-inner ${
                    conflict.severity === 'CRITIQUE' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'
                  }`}>
                    <AlertTriangle size={48} className="animate-pulse" />
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex items-center space-x-4 mb-3">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[2px] shadow-sm ${
                             conflict.severity === 'CRITIQUE' ? 'bg-red-600 text-white' : 'bg-orange-500 text-white'
                        }`}>
                            Niveau: {conflict.severity}
                        </span>
                        <span className="bg-slate-100 text-slate-500 font-black text-[10px] px-3 py-1.5 rounded-xl uppercase tracking-widest">
                            Détecté à: {conflict.time}
                        </span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter mb-2 leading-none">
                        {conflict.type}
                    </h3>
                    <p className="text-slate-400 text-sm font-bold italic leading-relaxed max-w-2xl">
                        {conflict.details}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mt-8 lg:mt-0 w-full lg:w-auto">
                    <button 
                      onClick={() => handleResolve(conflict.id)} 
                      className="flex-grow lg:flex-none bg-slate-900 text-white px-10 py-5 rounded-[22px] font-black uppercase text-[11px] tracking-[3px] hover:bg-blue-600 transition-all shadow-xl shadow-slate-100"
                    >
                        Arbitrer
                    </button>
                    <button 
                      onClick={() => handleDelete(conflict.id, conflict.sessionId)} 
                      className="p-5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-[22px] transition-all"
                    >
                        <Trash2 size={28} />
                    </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !isAnalyzing && (
            <div className="py-20 bg-white rounded-[50px] border-4 border-dashed border-slate-50 text-center">
                <Activity size={64} className="mx-auto text-green-100 mb-6" />
                <h3 className="text-2xl font-black text-slate-800 italic uppercase">Système en parfaite santé</h3>
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-2">Zéro conflit détecté dans la base de données</p>
            </div>
          )
        )}
      </div>

      {/* --- SECTION 3 : HISTORIQUE GESTION DES PROMOTIONS --- */}
      <div className="mb-20">
        <div className="bg-white p-8 rounded-t-[50px] border-x border-t border-slate-50 flex flex-col xl:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-black text-slate-800 italic uppercase tracking-tighter">Gestion des Promotions</h2>
                <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                    {filteredHistory.length} ENTRÉES
                </span>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                        type="text" 
                        placeholder="Rechercher une promotion..." 
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[22px] text-xs font-black uppercase tracking-tighter focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative w-full md:w-64">
                    <select 
                        className="w-full appearance-none bg-white border border-slate-100 text-slate-600 pl-6 pr-12 py-4 rounded-[22px] text-[10px] font-black uppercase tracking-widest focus:outline-none cursor-pointer shadow-sm"
                        onChange={(e) => setFilterFiliere(e.target.value)}
                        value={filterFiliere}
                    >
                        {uniqueFilieres.map(filiere => (
                            <option key={filiere} value={filiere}>
                                {filiere === "Tous" ? "Toutes les Filières" : `Filière ${filiere}`}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
            </div>
        </div>

        <div className="bg-white border-x border-b border-slate-50 rounded-b-[50px] overflow-hidden shadow-2xl shadow-slate-100">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/30">
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[3px]">Promotion</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[3px]">Filière</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[3px]">Effectif</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[3px]">État Avancement</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[3px]">Statut</th>
                            <th className="px-10 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[3px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredHistory.length > 0 ? filteredHistory.map((session) => (
                            <tr key={session.id} className="group hover:bg-blue-50/20 transition-all duration-300">
                                <td className="px-10 py-8">
                                    <div className="flex items-center space-x-5">
                                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 text-blue-600 flex items-center justify-center font-black text-xs group-hover:bg-blue-600 group-hover:text-white transition-all">
                                            {(session.classeName || "CL").substring(0, 2).toUpperCase()}
                                        </div>
                                        <span className="font-black text-slate-800 uppercase italic tracking-tighter text-lg">{session.classeName}</span>
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <span className="font-black text-slate-500 text-[11px] uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                        {session.filiere || "GÉNÉRALE"}
                                    </span>
                                </td>
                                <td className="px-10 py-8">
                                    <span className="font-black text-blue-600 italic text-lg tracking-tighter">
                                        {session.classe?.effectif || session.effectif || 0}
                                    </span>
                                </td>
                                <td className="px-10 py-8">
                                    <div className="flex items-center space-x-4 w-48">
                                        <div className="flex-grow h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                            <div 
                                                className={`h-full transition-all duration-700 ${session.progression >= 100 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.3)]'}`}
                                                style={{ width: `${session.progression || 45}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 italic">
                                            {session.progression || 45}%
                                        </span>
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <div className={`inline-flex items-center px-4 py-2 rounded-xl text-[9px] font-black tracking-[2px] uppercase border-2 shadow-sm ${
                                        session.progression >= 100 
                                        ? "bg-green-50 text-green-600 border-green-100" 
                                        : "bg-blue-50 text-blue-600 border-blue-100"
                                    }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full mr-2 ${session.progression >= 100 ? 'bg-green-500' : 'bg-blue-600 animate-pulse'}`}></div>
                                        {session.progression >= 100 ? "COMPLET" : "EN COURS"}
                                    </div>
                                </td>
                                <td className="px-10 py-8 text-right">
                                    <button 
                                        onClick={() => handleDelete(null, session.id)}
                                        className="text-slate-400 font-black text-[10px] uppercase tracking-[3px] hover:text-red-500 bg-slate-50 hover:bg-red-50 px-6 py-3 rounded-xl transition-all border border-transparent hover:border-red-100"
                                    >
                                        Révoquer
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="py-32 text-center bg-slate-50/20">
                                    <History size={80} className="mx-auto text-slate-100 mb-6" />
                                    <p className="text-slate-300 text-sm font-black uppercase italic tracking-[4px]">Aucun enregistrement trouvé</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminArbitrage;