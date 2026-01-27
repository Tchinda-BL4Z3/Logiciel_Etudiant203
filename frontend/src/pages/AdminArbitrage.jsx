import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { 
  AlertTriangle, RefreshCcw, Trash2, Gavel, 
  Info, Calendar, Clock, MapPin, User, CheckCircle 
} from 'lucide-react';

const AdminArbitrage = () => {
  const [conflicts, setConflicts] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // --- RÉCUPÉRATION DES VRAIS CONFLITS DEPUIS LE BACKEND ---
  const analyzeConflicts = async () => {
    setIsAnalyzing(true);
    try {
      // On appelle la route du backend qui calcule les conflits
      const response = await fetch('http://localhost:5000/api/conflicts');
      if (!response.ok) throw new Error('Erreur lors de la récupération des données');
      
      const data = await response.json();
      
      // On met à jour l'état avec les vrais conflits de la BD
      setConflicts(data);
    } catch (error) {
      console.error("Erreur d'analyse :", error);
    } finally {
      // On simule un petit délai pour l'effet visuel de l'analyse
      setTimeout(() => {
        setIsAnalyzing(false);
      }, 800);
    }
  };

  useEffect(() => {
    analyzeConflicts();
  }, []);

  const handleResolve = (id) => {
    // Logique pour ouvrir un modal de réaffectation (sera lié aux sessions de la BD)
    alert(`Ouverture du module de réaffectation pour le conflit ${id}`);
  };

  // --- SUPPRESSION RÉELLE D'UNE SÉANCE CONFLICTUELLE ---
  const handleDelete = async (conflictId, sessionId) => {
    if(window.confirm("Voulez-vous vraiment supprimer cette séance de la base de données pour résoudre le conflit ?")) {
        try {
            // On appelle l'API de suppression du backend
            const response = await fetch(`http://localhost:5000/api/sessions/${sessionId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // On retire le conflit de la liste visuelle
                setConflicts(conflicts.filter(c => c.id !== conflictId));
                setSuccessMsg('Séance supprimée de la base de données. Conflit résolu.');
                setTimeout(() => setSuccessMsg(''), 3000);
            } else {
                alert("Erreur lors de la suppression en base de données.");
            }
        } catch (error) {
            console.error("Erreur suppression:", error);
        }
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">Module d'Arbitrage</h1>
          <p className="text-slate-400 font-medium italic">Résolution des conflits et ajustements finaux</p>
        </div>
        <button 
          onClick={analyzeConflicts}
          disabled={isAnalyzing}
          className="flex items-center space-x-2 bg-white border border-slate-200 text-blue-600 px-5 py-2.5 rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-sm"
        >
          <RefreshCcw size={18} className={isAnalyzing ? 'animate-spin' : ''} />
          <span>{isAnalyzing ? 'Analyse en cours...' : "Actualiser l'analyse"}</span>
        </button>
      </div>

      {successMsg && (
        <div className="mb-6 bg-green-50 border border-green-100 text-green-600 p-4 rounded-2xl flex items-center animate-in fade-in slide-in-from-top-4">
          <CheckCircle size={20} className="mr-3" />
          <span className="font-bold text-sm uppercase tracking-wider">{successMsg}</span>
        </div>
      )}

      {/* --- BANNIÈRE D'ALERTE --- */}
      {conflicts.length > 0 && (
        <div className="mb-10 bg-red-50 border-l-[6px] border-red-500 p-8 rounded-r-[32px] flex items-start space-x-6 animate-pulse">
            <div className="bg-red-500 p-2 rounded-lg text-white">
                <AlertTriangle size={24} />
            </div>
            <div>
                <h3 className="text-red-600 font-black uppercase tracking-[3px] text-sm mb-1">Attention : {conflicts.length} conflits détectés</h3>
                <p className="text-red-400 text-xs font-bold italic leading-relaxed">
                    Le planning final ne peut pas être publié tant que ces erreurs persistent en base de données.
                </p>
            </div>
        </div>
      )}

      {/* --- LISTE DES CONFLITS --- */}
      <div className="space-y-6">
        {conflicts.map((conflict) => (
          <div key={conflict.id} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-50 flex items-center justify-between group hover:shadow-xl transition-all duration-500">
            <div className="flex items-center space-x-8">
              {/* Icône de statut */}
              <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center shadow-inner ${
                conflict.severity === 'CRITIQUE' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'
              }`}>
                <AlertTriangle size={28} />
              </div>

              {/* Détails */}
              <div>
                <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                         conflict.severity === 'CRITIQUE' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
                    }`}>
                        {conflict.severity}
                    </span>
                    <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">
                        {conflict.time}
                    </span>
                </div>
                <h3 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter mb-1">
                    {conflict.type}
                </h3>
                <p className="text-slate-400 text-sm font-medium italic">{conflict.details}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
                <button 
                  onClick={() => handleResolve(conflict.id)}
                  className="bg-[#0F172A] text-white px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-[3px] hover:bg-blue-600 transition-all shadow-lg shadow-slate-200"
                >
                    Arbitrer
                </button>
                <button 
                  onClick={() => handleDelete(conflict.id, conflict.sessionId)}
                  className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                >
                    <Trash2 size={20} />
                </button>
            </div>
          </div>
        ))}
        
        {conflicts.length === 0 && !isAnalyzing && (
            <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-100">
                <div className="bg-green-50 text-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-800 italic uppercase">Aucun conflit détecté</h3>
                <p className="text-slate-400 text-sm font-medium">Le planning de la base de données est parfaitement optimisé.</p>
            </div>
        )}
      </div>

      {/* --- AIDE À L'ARBITRAGE --- */}
      <div className="mt-12 bg-blue-50/50 border border-dashed border-blue-200 p-10 rounded-[40px]">
          <h4 className="text-blue-600 font-black uppercase tracking-[3px] text-xs mb-6 flex items-center">
            <Info size={16} className="mr-2" /> Aide à l'arbitrage
          </h4>
          <ul className="space-y-4 text-xs font-bold text-slate-500 uppercase tracking-wider leading-relaxed">
              <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                  Le bouton <span className="text-slate-800 mx-2 italic">Arbitrer</span> permet de modifier une séance conflictuelle en base de données.
              </li>
              <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                  Le système vérifie en temps réel les capacités des salles par rapport aux effectifs.
              </li>
              <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                  Toute suppression via l'icône <Trash2 size={12} className="inline mx-1"/> est définitive pour la séance concernée.
              </li>
          </ul>
      </div>
    </AdminLayout>
  );
};

export default AdminArbitrage;