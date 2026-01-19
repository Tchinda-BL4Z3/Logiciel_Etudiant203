import React, { useState } from 'react';
import logoUY1 from '../assets/logo_uy1.png';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, User, Mail, Hash, BookOpen, Lock } from 'lucide-react';

const RegisterStudent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '', email: '', matricule: '', filiere: '', password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Nouvel étudiant :", formData);
    alert("Compte créé avec succès ! Connectez-vous maintenant.");
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 md:px-16 py-6 bg-white/80 backdrop-blur-md border-b border-gray-100">
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
        <Link to="/login" className="text-sm font-bold text-blue-600 hover:underline">Déjà inscrit ? Se connecter</Link>
      </nav>

      <main className="flex-grow flex items-center justify-center py-16 px-6">
        {/* Changement ici : de max-w-2xl à max-w-4xl */}
        <div className="max-w-4xl w-full bg-white rounded-[32px] shadow-2xl shadow-blue-100/50 border border-gray-50 overflow-hidden flex flex-col md:flex-row">
          
          {/* Côté Gauche - Design (Ajusté à 30% ou 1/3 pour la nouvelle largeur) */}
          <div className="hidden md:flex md:w-1/3 bg-blue-600 p-12 flex-col justify-between text-white">
            <div>
              <h2 className="text-3xl font-bold mb-6 leading-tight">Rejoignez votre communauté.</h2>
              <p className="text-blue-100 text-base leading-relaxed">
                Créez votre compte pour accéder à votre emploi du temps en temps réel et gérer vos ressources académiques.
              </p>
            </div>
            <div className="bg-blue-500/30 p-6 rounded-2xl border border-blue-400/50">
              <p className="text-sm italic">"La planification est la clé de la réussite académique."</p>
            </div>
          </div>

          {/* Côté Droite - Formulaire */}
          <div className="flex-1 p-8 md:p-14">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 hover:text-blue-600 mb-8 transition-colors text-sm font-bold">
              <ArrowLeft size={16} className="mr-2" /> Retour
            </button>

            <h1 className="text-4xl font-black text-[#1E293B] mb-10">Inscription Étudiant</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nom */}
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="text" required placeholder="Nom complet"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  />
                </div>
                {/* Email */}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="email" required placeholder="Email institutionnel"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Matricule */}
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="text" required placeholder="N° Matricule"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                    onChange={(e) => setFormData({...formData, matricule: e.target.value})}
                  />
                </div>
                {/* Filière/Classe */}
                <div className="relative">
                  <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <select 
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm appearance-none"
                    onChange={(e) => setFormData({...formData, filiere: e.target.value})}
                  >
                    <option value="">Sélectionner votre classe</option>
                    <option value="ICT-L1">ICT-L1</option>
                    <option value="ICT-L2">ICT-L2</option>
                    <option value="ICT-L3">ICT-L3</option>
                  </select>
                </div>
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="password" required placeholder="Mot de passe"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#1d76f2] text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-blue-100 hover:scale-[1.01] active:scale-[0.99] transition-all mt-6"
              >
                Créer mon compte
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-100 py-8 text-center text-gray-400 text-sm">
        <p>© 2025/2026 UniPortal. Système de Gestion Universitaire.</p>
      </footer>
    </div>
  );
};

export default RegisterStudent;