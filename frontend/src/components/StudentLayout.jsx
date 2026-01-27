import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  User, 
  LogOut, 
  Bell, 
  Search,
  Settings,
  X,
  AlertCircle
} from 'lucide-react';
import logoUY1 from '../assets/logo_uy1.png'; // Vérifie le chemin de ton logo

const StudentLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Récupération des infos de l'étudiant connecté
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{"nom": "Étudiant"}');

  const menuItems = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Mon Emploi du Temps', path: '/student/timetable', icon: Calendar },
    { name: 'Supports de Cours', path: '/student/resources', icon: BookOpen },
    { name: 'Mon Profil', path: '/student/profile', icon: User },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-[#F1F5F9]">
      {/* --- SIDEBAR DARK (IDENTIQUE ADMIN) --- */}
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col shadow-2xl z-20">
        {/* Header Logo */}
        <div className="p-6 flex items-center space-x-3">
          <img src={logoUY1} alt="Logo" className="h-10 w-auto bg-white p-1 rounded" />
          <div className="text-left">
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-none mb-1">UY1 - ICT</p>
            <p className="text-sm font-black italic uppercase leading-none text-white tracking-tighter">Portail Étudiant</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                location.pathname === item.path 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 font-bold' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Footer Profil Utilisateur */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center space-x-3 p-2 bg-slate-800/50 rounded-2xl border border-white/5">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white shadow-inner flex-shrink-0">
              {currentUser.nom.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden text-left">
              <p className="text-sm font-bold text-white truncate leading-none mb-1">{currentUser.nom}</p>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">Étudiant connecté</p>
            </div>
            <button 
              onClick={() => setShowLogoutModal(true)}
              className="text-slate-500 hover:text-red-400 p-2 transition-colors rounded-lg hover:bg-red-500/10"
              title="Déconnexion"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
          <div className="flex items-center space-x-2">
             <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Session active :</span>
             <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
               Student Space
             </span>
          </div>

          <div className="flex items-center space-x-5">
            {/* Recherche (Visuelle) */}
            <div className="hidden md:flex relative items-center">
                <Search size={16} className="absolute left-3 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Rechercher..." 
                  className="bg-slate-50 border-none pl-10 pr-4 py-1.5 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 transition-all w-48" 
                />
            </div>

            <button className="relative p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="w-8 h-8 bg-slate-200 rounded-full border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
                <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                    {currentUser.nom.charAt(0).toUpperCase()}
                </div>
            </div>
          </div>
        </header>

        {/* Zone de contenu dynamique */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
          {children}
        </div>

        {/* ============================================================ */}
        {/* MODALE DE CONFIRMATION DE DÉCONNEXION (Glassmorphism) */}
        {/* ============================================================ */}
        {showLogoutModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300">
            <div className="bg-white w-full max-w-sm rounded-[40px] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-200">
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <LogOut size={40} />
                </div>
                
                <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter mb-3">
                  Quitter le portail ?
                </h2>
                <p className="text-slate-400 font-bold text-xs leading-relaxed mb-8 px-6">
                  Vous êtes sur le point de vous déconnecter du système UniPortal. 
                </p>

                <div className="flex flex-col gap-3 px-4">
                  <button 
                    onClick={handleLogout}
                    className="w-full py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-red-200 hover:bg-red-700 hover:scale-[1.02] active:scale-95 transition-all duration-200"
                  >
                    Confirmer la Déconnexion
                  </button>
                  <button 
                    onClick={() => setShowLogoutModal(false)}
                    className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-[9px] hover:bg-slate-200 transition-all duration-200"
                  >
                    Annuler
                  </button>
                </div>
              </div>
              
              <div className="bg-slate-900 py-3 text-center">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-[3px]">
                  UY1 • Système de Sécurité
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentLayout;