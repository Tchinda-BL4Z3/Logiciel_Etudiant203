import React from 'react';
import logoUY1 from '../assets/logo_uy1.png';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Users, ShieldCheck, ArrowRight } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* --- NAVBAR --- */}
      <nav className="flex justify-between items-center px-8 md:px-16 py-6 bg-white/80 backdrop-blur-md sticky top-0 z-50">
    <div className="flex items-center space-x-3">
  {/* Le Logo Image */}
  <img 
    src={logoUY1} 
    alt="Logo UY1" 
    className="h-12 w-auto object-contain" 
  />
  
  {/* Séparateur vertical discret (optionnel, pour faire très pro) */}
  <div className="h-8 w-[1.5px] bg-gray-200 hidden md:block"></div>

  {/* Le Texte de l'application */}
  <div className="flex flex-col justify-center">
    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] leading-none mb-1">
      UY1 - ICT
    </span>
    <span className="text-xl font-black text-[#1E293B] tracking-tight leading-none">
      EDT Universitaire
    </span>
  </div>
</div>
        
        <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-gray-600">
          <Link to="/" className="text-blue-600">Accueil</Link>
          <Link to="/about" className="hover:text-blue-600 transition-colors"> À propos </Link>
          <Link to="/contact" className="hover:text-blue-600 transition-colors"> Contact </Link>
        </div>

        <Link 
          to="/login" 
          className="bg-[#1d76f2] hover:bg-blue-700 text-white px-8 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-blue-200 transition-all"
        >
          Se Connecter
        </Link>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="flex-grow">
        <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
          {/* Badge */}
          <div className="inline-flex items-center bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full mb-8">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Système de gestion nouvelle génération</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-[#1E293B] leading-[1.1] mb-8">
            Gérez vos Emploi du Temps <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">universitaire</span> avec fluidité.
          </h1>

          <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Accédez à votre emploi du temps, vos cours et vos ressources administratives au sein d'un écosystème intelligent et intuitif.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="bg-[#1d76f2] text-white px-10 py-4 rounded-xl font-bold text-lg shadow-2xl shadow-blue-200 hover:scale-105 transition-all w-full md:w-auto"
            >
              Commencer maintenant
            </button>
            <button className="bg-white border border-gray-200 text-gray-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all w-full md:w-auto">
              Explorer le système
            </button>
          </div>
        </section>

        {/* --- ACCÈS RAPIDE (CARDS) --- */}
        <section className="max-w-7xl mx-auto px-6 md:px-16 py-12">
          <div className="mb-12">
            <h2 className="text-3xl font-extrabold text-[#1E293B] mb-2">Accès Rapide</h2>
            <p className="text-gray-400">Choisissez votre portail pour accéder aux outils spécifiques.</p>
            <div className="w-20 h-1 bg-blue-500 mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card Étudiant */}
            <div className="bg-white p-10 rounded-[32px] shadow-sm hover:shadow-xl transition-all border border-gray-50 group flex flex-col h-full">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 transition-colors">
                <GraduationCap className="text-blue-600 group-hover:text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-[#1E293B] mb-4">Portail Étudiant</h3>
              <p className="text-gray-500 leading-relaxed mb-8 flex-grow">
                Consultez votre emploi du temps, téléchargez vos supports de cours et suivez vos résultats académiques.
              </p>
              
              {/* Actions de la carte */}
              <div className="flex flex-col gap-4 mt-auto">
                <button onClick={() => navigate('/login')} className="flex items-center text-blue-600 font-bold group-hover:gap-2 transition-all text-sm">
                  Accéder à mon espace <ArrowRight size={18} className="ml-2" />
                </button>
                
                {/* Nouveau Bouton d'inscription très visible */}
                <button 
                  onClick={() => navigate('/register-student')} 
                  className="w-full py-3 px-4 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm border border-blue-100 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 text-center"
                >
                  Créer un compte étudiant
                </button>
              </div>
            </div>

            {/* Card Enseignant */}
            <div className="bg-white p-10 rounded-[32px] shadow-sm hover:shadow-xl transition-all border border-gray-50 group flex flex-col h-full">
              <div className="w-14 h-14 bg-cyan-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-cyan-500 transition-colors">
                <Users className="text-cyan-600 group-hover:text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-[#1E293B] mb-4">Espace Enseignant</h3>
              <p className="text-gray-500 leading-relaxed mb-8 flex-grow">
                Gérez vos classes, planifiez vos examens et communiquez directement avec vos étudiants.
              </p>
              <button onClick={() => navigate('/login')} className="flex items-center text-cyan-600 font-bold group-hover:gap-2 transition-all mt-auto text-sm">
                Se connecter au portail <ArrowRight size={18} className="ml-2" />
              </button>
            </div>

            {/* Card Admin */}
            <div className="bg-white p-10 rounded-[32px] shadow-sm hover:shadow-xl transition-all border border-gray-50 group flex flex-col h-full">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-slate-800 transition-colors">
                <ShieldCheck className="text-slate-600 group-hover:text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-[#1E293B] mb-4">Administration</h3>
              <p className="text-gray-500 leading-relaxed mb-8 flex-grow">
                Gérer les inscriptions, les ressources logistiques et la configuration globale de l'établissement.
              </p>
              <button onClick={() => navigate('/login')} className="flex items-center text-slate-800 font-bold group-hover:gap-2 transition-all mt-auto text-sm">
                Panel administratif <ArrowRight size={18} className="ml-2" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* --- FOOTER ATTACHÉ AU BAS --- */}
      <footer className="bg-white border-t border-gray-100 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-16 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>© 2025/2026 EDT Universitaire Projet Académique ICT 203.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 font-medium text-gray-500">
            <a href="#" className="hover:text-blue-600">Support</a>
            <a href="#" className="hover:text-blue-600">Confidentialité</a>
            <a href="#" className="hover:text-blue-600">Conditions</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;