import React, { useState, useEffect } from 'react';
import StudentLayout from '../components/StudentLayout';
import { 
  User, Mail, Hash, BookOpen, Users, ShieldCheck, 
  MapPin, Calendar, LogOut, X, AlertCircle, ChevronRight 
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [classmates, setClassmates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // RÉCUPÉRATION ROBUSTE DE L'UTILISATEUR CONNECTÉ
  // On vérifie les deux clés possibles dans le localStorage pour éviter les erreurs d'affichage
  const user = JSON.parse(
    localStorage.getItem('currentUser') || 
    localStorage.getItem('user') || 
    '{}'
  );

  useEffect(() => {
    if (user && user.id) {
      console.log("ID Utilisateur détecté :", user.id);
      fetchData();
    } else {
      console.error("Aucun ID utilisateur trouvé. Redirection ou arrêt du chargement.");
      setLoading(false);
    }
  }, [user.id]);

  const fetchData = async () => {
    try {
      console.log("Appel API pour le profil de l'ID :", user.id);
      
      // On s'assure que les routes correspondent exactement à ton backend
      const [resProfile, resClassmates] = await Promise.all([
        axios.get(`http://localhost:5000/api/students/${user.id}/profile`),
        axios.get(`http://localhost:5000/api/students/${user.id}/classmates`)
      ]);
      
      console.log("Données Profil reçues :", resProfile.data);
      console.log("Données Camarades reçues :", resClassmates.data);

      setProfile(resProfile.data);
      setClassmates(resClassmates.data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur détaillée lors du chargement :", error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="p-10 text-center font-black uppercase tracking-widest text-slate-400 animate-pulse">
            Chargement du dossier académique...
          </div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      {/* HEADER DE LA PAGE */}
      <div className="mb-10 flex justify-between items-end text-left">
        <div>
          <h1 className="text-4xl font-black text-slate-800 uppercase italic tracking-tighter">Mon Profil Académique</h1>
          <p className="text-slate-400 text-[10px] font-black mt-1 uppercase tracking-[4px]">Informations personnelles & Communauté • UY1 ICT</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
        
        {/* COLONNE GAUCHE : INFOS PERSONNELLES */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500"></div>
            <div className="px-8 pb-8">
              <div className="relative -mt-12 mb-6">
                <div className="w-24 h-24 bg-slate-900 rounded-3xl border-4 border-white flex items-center justify-center text-white text-3xl font-black shadow-xl">
                  {profile?.nom ? profile.nom.charAt(0) : <User size={40}/>}
                </div>
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
              </div>

              <h2 className="text-2xl font-black text-slate-800 uppercase italic leading-none mb-2">
                {profile?.nom || "Non renseigné"}
              </h2>
              <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest mb-6 italic">
                Étudiant • {profile?.classe?.nom || 'Classe non assignée'}
              </p>

              <div className="space-y-4 pt-6 border-t border-slate-50">
                <div className="flex items-center gap-4 text-slate-600 group">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <Hash size={18}/>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">Matricule Officiel</p>
                    <p className="font-bold text-sm tracking-wide text-slate-700 leading-none">
                      {profile?.matricule || 'En attente...'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-slate-600 group">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <Mail size={18}/>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">Email Institutionnel</p>
                    <p className="font-bold text-sm text-slate-700 leading-none">
                      {profile?.email || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-600 group">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <BookOpen size={18}/>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">Filière / Spécialité</p>
                    <p className="font-bold text-sm text-slate-700 leading-none">
                      {profile?.filiere || 'Tronc Commun '}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-600 group">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <Calendar size={18}/>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">Année Académique</p>
                    <p className="font-bold text-sm italic text-slate-700 leading-none">2025 / 2026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : LISTE DES CAMARADES */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <Users size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800 italic uppercase leading-none">Ma Communauté</h2>
                  <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mt-1">
                    {classmates.length} Camarade{classmates.length > 1 ? 's' : ''} enregistré{classmates.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="flex -space-x-3">
                {classmates.slice(0, 5).map((c, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500">
                    {c.nom ? c.nom.charAt(0) : '?'}
                  </div>
                ))}
                {classmates.length > 5 && (
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-[10px] font-black text-blue-600">
                    +{classmates.length - 5}
                  </div>
                )}
              </div>
            </div>

            <div className="p-8">
              {classmates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {classmates.map((camarade) => (
                    <div key={camarade.id} className="group p-5 bg-white rounded-2xl border border-slate-100 flex items-center justify-between hover:shadow-xl hover:border-blue-400 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center text-slate-800 font-black group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                          {camarade.nom ? camarade.nom.charAt(0) : "?"}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 uppercase leading-none mb-1 group-hover:text-blue-600 transition-colors">
                            {camarade.nom}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold tracking-tight uppercase">
                            Mat : {camarade.matricule || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-slate-200 group-hover:text-blue-400 transform group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <Users size={40} className="text-slate-200" />
                  </div>
                  <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] italic max-w-xs leading-loose">
                    Vous êtes actuellement le seul étudiant enregistré dans cette classe.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      <footer className="mt-20 pt-8 border-t border-slate-100 text-[8px] text-slate-200 font-black uppercase tracking-[5px] text-center">
        UY1 ICT • SYSTÈME DE GESTION 2025/2026
      </footer>

      {/* ============================================================ */}
      {/* MODALE DE CONFIRMATION DE DÉCONNEXION */}
      {/* ============================================================ */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-200">
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                <LogOut size={40} />
              </div>
              
              <h2 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter mb-4">
                Déconnexion ?
              </h2>
              <p className="text-slate-400 font-bold text-sm leading-relaxed mb-10 px-4">
                Êtes-vous certain de vouloir quitter votre session ? Vos accès resteront sécurisés jusqu'à votre prochaine visite.
              </p>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleLogout}
                  className="w-full py-5 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-red-200 hover:bg-red-700 hover:scale-[1.02] active:scale-95 transition-all duration-200"
                >
                  Confirmer la déconnexion
                </button>
                <button 
                  onClick={() => setShowLogoutModal(false)}
                  className="w-full py-5 bg-slate-50 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all duration-200"
                >
                  Annuler
                </button>
              </div>
            </div>
            
            <div className="bg-slate-50 py-4 text-center">
              <p className="text-[8px] font-black text-slate-300 uppercase tracking-[3px]">
                UY1 • Sécurité du Portail
              </p>
            </div>
          </div>
        </div>
      )}
    </StudentLayout>
  );
};

export default StudentProfile;