import React, { useState } from 'react';
import logoUY1 from '../assets/logo_uy1.png';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, User, ArrowLeft, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
    localStorage.setItem('userRole', 'ADMIN');
    // REDIRECTION VERS LE CHEMIN COMPLET
    navigate('/admin/dashboard'); 
    } else {
    setError('Identifiants incorrects.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* NAVBAR IDENTIQUE */}
      <nav className="flex justify-between items-center px-8 md:px-16 py-6 bg-white border-b border-gray-100">
        <div className="flex items-center space-x-3">
  {/* On utilise ici la variable logoUY1 importée */}
  <img 
    src={logoUY1} 
    alt="Logo UY1" 
    className="h-12 w-auto object-contain" 
  />
  
  <div className="h-10 w-[1px] bg-gray-200"></div>

  <div className="flex flex-col justify-center">
    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest leading-none mb-1">
      UY1 - ICT
    </span>
    <span className="text-xl font-black text-[#1E293B] tracking-tight leading-none">
      EDT Universitaire
    </span>
  </div>
</div>
        <Link to="/login" className="flex items-center text-gray-500 hover:text-blue-600 font-bold text-sm">
          <ArrowLeft size={18} className="mr-2" /> Retour aux profils
        </Link>
      </nav>

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[32px] shadow-2xl shadow-slate-200 border border-gray-100 p-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-4 shadow-xl shadow-slate-200">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl font-black text-slate-900">Accès Administrateur</h1>
            <p className="text-gray-400 text-sm mt-2">Veuillez entrer vos codes d'accès sécurisés</p>
          </div>

          {error && (
            <div className="mb-6 flex items-center p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100 animate-shake">
              <AlertCircle size={18} className="mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                required 
                placeholder="Nom d'utilisateur"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-slate-800 outline-none transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="password" 
                required 
                placeholder="Mot de passe"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-slate-800 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 shadow-xl shadow-slate-100 transition-all active:scale-[0.98] mt-4"
            >
              Se connecter au Panel
            </button>
          </form>

          <p className="text-center mt-8 text-xs text-gray-400 uppercase tracking-widest font-bold">
            Zone de haute sécurité
          </p>
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;