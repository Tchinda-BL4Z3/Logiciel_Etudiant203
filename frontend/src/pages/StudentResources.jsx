import React, { useState, useEffect } from 'react';
import StudentLayout from '../components/StudentLayout';
import { FileText, Download, Search, BookOpen, User, Clock, ChevronRight, AlertCircle } from 'lucide-react';
import axios from 'axios';

const StudentResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Récupération de l'utilisateur connecté depuis le localStorage
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

  useEffect(() => {
    if (user.id) {
      fetchResources();
    }
  }, [user.id]);

  /**
   * RÉCUPÉRATION DES DONNÉES DEPUIS LE BACKEND
   */
  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/students/${user.id}/resources`);
      setResources(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des ressources :", error);
      setLoading(false);
    }
  };

  /**
   * LOGIQUE DE RECHERCHE DYNAMIQUE
   * Filtre sur le nom du fichier, le code de l'UE ou le nom de l'enseignant
   */
  const filteredResources = resources.filter(r => {
    const searchLower = searchTerm.toLowerCase();
    const fileName = r.nom?.toLowerCase() || "";
    const ueCode = r.ue?.code?.toLowerCase() || "";
    // On vérifie le prof soit directement, soit via l'objet UE
    const teacherName = (r.teacher?.nom || r.ue?.enseignant?.nom || "").toLowerCase();

    return fileName.includes(searchLower) || 
           ueCode.includes(searchLower) || 
           teacherName.includes(searchLower);
  });

  /**
   * REGROUPEMENT DES RESSOURCES PAR ENSEIGNANT
   */
  const groupedResources = filteredResources.reduce((acc, resource) => {
    // Récupération sécurisée du nom de l'enseignant
    const teacherName = resource.ue?.enseignant?.nom || resource.teacher?.nom || "Enseignant UY1 - ICT";
    
    if (!acc[teacherName]) {
      acc[teacherName] = [];
    }
    acc[teacherName].push(resource);
    return acc;
  }, {});

  /**
   * STRATÉGIE DE TÉLÉCHARGEMENT SÉCURISÉE (ANTI-BLOCAGE)
   * Utilise un Blob pour contourner les restrictions de sécurité du navigateur
   */
  const handleDownload = async (fileUrl, fileName) => {
    try {
      const fullUrl = fileUrl.startsWith('http') ? fileUrl : `http://localhost:5000${fileUrl}`;
      
      const response = await fetch(fullUrl);
      if (!response.ok) throw new Error("Fichier non trouvé sur le serveur");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      // Nettoyage du nom de fichier pour l'extension
      link.setAttribute('download', fileName || 'support_de_cours.pdf');
      
      document.body.appendChild(link);
      link.click();
      
      // Nettoyage de la mémoire
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur de téléchargement :", error);
      alert("Impossible de télécharger le fichier. Vérifiez votre connexion au serveur.");
    }
  };

  return (
    <StudentLayout>
      {/* SECTION EN-TÊTE : TITRES ET RECHERCHE */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-left">
          <h1 className="text-4xl font-black text-slate-800 uppercase italic tracking-tighter">
            Supports de cours
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-8 h-[2px] bg-blue-600"></span>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[4px]">
              Espace documentaire pédagogique • UY1 ICT
            </p>
          </div>
        </div>

        {/* BARRE DE RECHERCHE INTERACTIVE */}
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Rechercher une UE, un Prof ou un Titre..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-sm text-slate-600 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        /* CHARGEMENT */
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Synchronisation...</p>
        </div>
      ) : (
        <div className="space-y-12">
          {Object.keys(groupedResources).length > 0 ? (
            Object.entries(groupedResources).map(([teacherName, docs]) => (
              <div key={teacherName} className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* EN-TÊTE DE SECTION PAR ENSEIGNANT */}
                <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/40 flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200 border border-slate-700">
                      <User size={24} />
                    </div>
                    <div className="text-left">
                      <h2 className="text-2xl font-black text-slate-800 italic uppercase leading-none">
                        {teacherName}
                      </h2>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                        <p className="text-[9px] font-black text-blue-600 uppercase tracking-[3px]">
                           {docs.length} ressource{docs.length > 1 ? 's' : ''} pédagogique{docs.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="text-slate-200" size={30} />
                </div>

                {/* GRILLE DES FICHIERS (TUILES) */}
                <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                  {docs.map((res) => (
                    <div 
                      key={res.id} 
                      className="group bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                    >
                      {/* En-tête de la tuile */}
                      <div className="flex justify-between items-start mb-5">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-inner">
                          <FileText size={24} />
                        </div>
                        <span className="text-[8px] font-black px-2 py-1 bg-slate-100 text-slate-400 rounded-lg uppercase tracking-tighter">
                          {res.type || 'DOCUMENT'}
                        </span>
                      </div>

                      {/* Corps de la tuile */}
                      <div className="flex-1 text-left">
                        <p className="text-blue-600 font-black text-[9px] uppercase tracking-wider mb-1.5">
                          {res.ue?.code || "SANS CODE"}
                        </p>
                        <h3 className="text-[12px] font-black text-slate-800 leading-tight mb-4 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[32px]">
                          {res.nom}
                        </h3>
                        
                        {/* Infos Méta */}
                        <div className="flex items-center justify-between text-slate-400 text-[8px] font-bold uppercase tracking-widest border-t border-slate-50 pt-4 mb-5">
                           <div className="flex items-center gap-1.5">
                             <Clock size={12} className="text-slate-300" /> 
                             {res.date ? new Date(res.date).toLocaleDateString() : 'Date inconnue'}
                           </div>
                           <div className="font-black text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                             {res.taille || "0 KB"}
                           </div>
                        </div>
                      </div>

                      {/* Bouton de Téléchargement */}
                      <button 
                        onClick={() => handleDownload(res.url, res.nom)}
                        className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-[3px] flex items-center justify-center gap-2 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95 border border-slate-800"
                      >
                        <Download size={14} /> Télécharger
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            /* ÉTAT VIDE (RECHERCHE INFRUCTUEUSE OU PAS DE DONNÉES) */
            <div className="py-28 bg-white rounded-[40px] border-2 border-dashed border-slate-100 shadow-sm flex flex-col items-center justify-center animate-in fade-in duration-1000">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <BookOpen size={40} className="text-slate-200" />
              </div>
              <p className="text-slate-400 font-black italic uppercase tracking-[6px] text-[12px]">
                Aucune ressource trouvée
              </p>
              <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest mt-3">
                Vérifiez vos filtres de recherche ou contactez votre délégué.
              </p>
            </div>
          )}
        </div>
      )}

      {/* FOOTER BAS DE PAGE */}
      <footer className="mt-24 pb-10 pt-10 border-t border-slate-100">
        <div className="flex flex-col items-center gap-2">
           <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
           <p className="text-[9px] text-slate-200 font-black uppercase tracking-[8px] text-center">
             UY1 ICT • SYSTÈME DE GESTION 2025/2026
           </p>
        </div>
      </footer>
    </StudentLayout>
  );
};

export default StudentResources;