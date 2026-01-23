import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Calendar, ClipboardList, Users, FolderOpen, 
  Search, Bell, Settings, LogOut 
} from 'lucide-react';
import logoUY1 from '../assets/logo_uy1.png'; // Ton blason UY1

const TeacherLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const teacherName = localStorage.getItem('teacherName');

  const menuItems = [
    { name: 'Mon Planning', path: '/teacher/dashboard', icon: Calendar },
    { name: 'Vœux', path: '/teacher/voeux', icon: ClipboardList },
    { name: 'Classes', path: '/teacher/classes', icon: Users },
    { name: 'Ressources', path: '/teacher/ressources', icon: FolderOpen },
  ];

  return (
    <div className="flex h-screen bg-[#F1F5F9]">
      {/* --- SIDEBAR SOMBRE --- */}
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col shadow-2xl">
        <div className="p-6 flex items-center space-x-3 mb-6">
          <img src={logoUY1} alt="Logo" className="h-10 w-auto bg-white/90 p-1 rounded" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">UY1 - ICT</span>
            <span className="text-sm font-black italic">Portail Enseignant</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all ${
                location.pathname === item.path 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-bold text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Profil de l'enseignant en bas */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-2xl border border-slate-700/50">
            <div className="w-10 h-10 rounded-full border-2 border-blue-500 overflow-hidden bg-white">
               <img src="https://ui-avatars.com/api/?name=Dr+Martin&background=random" alt="Avatar" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-black truncate"> {teacherName}</p>
              <p className="text-[9px] text-slate-400 uppercase tracking-tighter">Enseignant-Chercheur</p>
            </div>
            <button onClick={() => navigate('/')} className="text-slate-500 hover:text-red-400">
                <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* --- CONTENU PRINCIPAL --- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header avec Barre de recherche */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
            Enseignant <span className="mx-2">/</span> <span className="text-blue-600">Tableau de bord</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Rechercher un cours..." 
                className="w-64 pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-xs focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="relative p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200 cursor-pointer">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </div>
          </div>
        </header>

        {/* Zone de défilement */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </div>

        {/* Footer simple */}
        <footer className="h-10 bg-white border-t border-slate-200 px-8 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            <div className="flex space-x-4">
                <p>Dernière synchronisation :</p>
                <p>Connexions en cours : </p>
            </div>
            <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Système Synchrone</span>
            </div>
        </footer>
      </main>
    </div>
  );
};

export default TeacherLayout;