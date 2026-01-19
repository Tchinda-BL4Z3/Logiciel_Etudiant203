import React from 'react';
import logoUY1 from '../assets/logo_uy1.png';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Users, ShieldCheck, ArrowLeft, ChevronRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (role) => {
    localStorage.setItem('userRole', role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* --- NAVBAR (Identique à Home) --- */}
      <nav className="flex justify-between items-center px-8 md:px-16 py-6 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <Link to="/" className="flex items-center space-x-3 group">
  {/* Logo Image UY1 */}
  <img 
    src={logoUY1} 
    alt="Logo UY1" 
    className="h-10 w-auto object-contain transition-transform group-hover:scale-105" 
  />
  
  {/* Séparateur vertical discret */}
  <div className="h-8 w-[1.5px] bg-gray-200"></div>

  {/* Texte du Logo */}
  <div className="flex flex-col justify-center">
    <span className="text-[9px] font-bold text-blue-600 uppercase tracking-[0.2em] leading-none mb-1">
      UY1 - ICT
    </span>
    <span className="text-lg font-black text-[#1E293B] tracking-tight leading-none">
      EDT Universitaire
    </span>
  </div>
</Link>
        
        <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-gray-600">
          <Link to="/" className="hover:text-blue-600 transition-colors">Accueil</Link>
          <a href="#" className="hover:text-blue-600 transition-colors">À propos</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Besoin d'aide ?</a>
        </div>

        <Link 
          to="/" 
          className="flex items-center text-gray-500 hover:text-blue-600 font-bold text-sm transition-all"
        >
          <ArrowLeft size={18} className="mr-2" /> Retour
        </Link>
      </nav>

      {/* --- CONTENU DE CONNEXION --- */}
      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="max-w-xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-[#1E293B] mb-4">Espace de Connexion</h1>
            <p className="text-gray-500 font-medium">Sélectionnez votre profil pour accéder à vos outils personnalisés.</p>
          </div>

          <div className="space-y-4">
            {/* Option Étudiant */}
            <button 
              onClick={() => handleLogin('STUDENT')}
              className="w-full group bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <GraduationCap className="text-blue-600 group-hover:text-white" size={28} />
                </div>
                <div className="ml-6 text-left">
                  <h3 className="text-lg font-bold text-[#1E293B]">Portail Étudiant</h3>
                  <p className="text-sm text-gray-400">Emploi du temps, cours et résultats</p>
                </div>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </button>

            {/* Option Enseignant */}
            <button 
              onClick={() => handleLogin('TEACHER')}
              className="w-full group bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-xl hover:border-cyan-100 transition-all flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="w-14 h-14 bg-cyan-50 rounded-2xl flex items-center justify-center group-hover:bg-cyan-500 transition-colors">
                  <Users className="text-cyan-600 group-hover:text-white" size={28} />
                </div>
                <div className="ml-6 text-left">
                  <h3 className="text-lg font-bold text-[#1E293B]">Espace Enseignant</h3>
                  <p className="text-sm text-gray-400">Gestion des cours et désidératas</p>
                </div>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all" />
            </button>

            {/* Option Admin */}
            <button 
                onClick={() => navigate('/login/admin')} 
                className="w-full group bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-slate-800 transition-colors">
                  <ShieldCheck className="text-slate-600 group-hover:text-white" size={28} />
                </div>
                <div className="ml-6 text-left">
                  <h3 className="text-lg font-bold text-[#1E293B]">Administration</h3>
                  <p className="text-sm text-gray-400">Configuration globale et ressources</p>
                </div>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-slate-800 group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          <p className="text-center mt-10 text-gray-400 text-sm">
            Vous rencontrez des difficultés ? <a href="#" className="text-blue-600 font-bold hover:underline">Contactez le support</a>
          </p>
        </div>
      </main>

      {/* --- FOOTER (Identique à Home) --- */}
      <footer className="bg-white border-t border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-8 md:px-16 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>© 2025/2026 UniPortal. Projet Académique ICT 203.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 font-medium text-gray-500">
            <a href="#" className="hover:text-blue-600">Support</a>
            <a href="#" className="hover:text-blue-600">Confidentialité</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;