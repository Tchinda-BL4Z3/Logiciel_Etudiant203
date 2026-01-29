import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import { 
  LayoutDashboard, DoorOpen, Users, UserSquare2, 
  Gavel, ClipboardList, Search, Bell, Settings, LogOut, X, AlertTriangle, ShieldQuestion,
  CalendarRange // Nouvel icône pour les emplois du temps par filière
} from 'lucide-react';
import logoUY1 from '../assets/logo_uy1.png';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // --- ÉTAT POUR LA CONFIRMATION DE DÉCONNEXION ---
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // --- ÉTAPE 1 : DÉCLENCHER LA MODALE ---
  const triggerLogout = () => {
    setShowLogoutConfirm(true);
  };

  // --- ÉTAPE 2 : CONFIRMER ET QUITTER ---
  const confirmLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/'); 
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Emploi Filières', path: '/admin/filieres', icon: CalendarRange }, // Nouveau lien ajouté ici
    { name: 'Salles', path: '/admin/salles', icon: DoorOpen },
    { name: 'Classes', path: '/admin/classes', icon: Users },
    { name: 'Enseignants', path: '/admin/enseignants', icon: UserSquare2 },
    { name: 'Arbitrage', path: '/admin/arbitrage', icon: Gavel },
    { name: 'Vœux', path: '/admin/voeux', icon: ClipboardList },
  ];

  return (
    <div className="flex h-screen bg-[#F1F5F9]">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col">
        <div className="p-6 flex items-center space-x-3">
          <img src={logoUY1} alt="Logo" className="h-10 w-auto bg-white p-1 rounded" />
          <div>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-none mb-1">UY1 - ICT</p>
            <p className="text-sm font-black italic">Console Admin</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* --- SECTION PROFIL AVEC LOGOUT --- */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center space-x-3 p-2 bg-slate-800/50 rounded-2xl border border-slate-700/50">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white shadow-inner">
              A
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-white truncate">Admin Principal</p>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-tighter">Super Admin</p>
            </div>
            
            <button 
              onClick={triggerLogout} 
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all group"
              title="Se déconnecter"
            >
              <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>

      {/* --- FENÊTRE DE CONFIRMATION DE DÉCONNEXION --- */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                  <ShieldQuestion size={28} />
                </div>
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="text-slate-300 hover:text-slate-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <h2 className="text-2xl font-black text-slate-800 leading-tight">Session Administrative</h2>
              <p className="text-slate-500 text-sm mt-2 font-medium">
                Êtes-vous sûr de vouloir fermer votre session ? Toutes les modifications non enregistrées pourraient être perdues.
              </p>

              <div className="flex space-x-3 mt-10">
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-4 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all"
                >
                  Rester
                </button>
                <button 
                  onClick={confirmLogout}
                  className="flex-1 py-4 bg-[#0F172A] text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-slate-200 hover:bg-slate-800 hover:scale-[1.02] transition-all"
                >
                  Déconnexion
                </button>
              </div>
            </div>
            <div className="bg-slate-50 px-8 py-3 text-center border-t border-slate-100">
              <p className="text-[8px] text-slate-400 font-black uppercase tracking-[3px]">Protection des données • UY1 Admin</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;