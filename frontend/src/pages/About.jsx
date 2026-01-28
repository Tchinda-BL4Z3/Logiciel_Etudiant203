import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, Cpu, Users, 
  ShieldCheck, Calendar, Zap, Award 
} from 'lucide-react';
// Assurez-vous que le chemin du logo est correct
import logoUY1 from '../assets/logo_uy1.png'; 

const About = () => {
  const features = [
    {
      title: "Gestion Intelligente des Salles",
      desc: "Optimisation automatique basée sur l'effectif des classes et la capacité réelle des locaux.",
      icon: <Cpu className="text-blue-600" size={24} />,
      color: "bg-blue-50"
    },
    {
      title: "Portail Enseignants",
      desc: "Saisie ergonomique des vœux et justifications (notice d'arbitrage) pour une planification équitable.",
      icon: <Users className="text-cyan-600" size={24} />,
      color: "bg-cyan-50"
    },
    {
      title: "Arbitrage Administratif",
      desc: "Outils de résolution de conflits et validation finale avec notifications en temps réel.",
      icon: <ShieldCheck className="text-slate-600" size={24} />,
      color: "bg-slate-100"
    },
    {
      title: "Vues Multi-Profils",
      desc: "Consultation fluide par classe, enseignant ou salle, adaptée aux besoins de chaque utilisateur.",
      icon: <Calendar className="text-purple-600" size={24} />,
      color: "bg-purple-50"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* --- NAVBAR IDENTIQUE (Style Image demandée) --- */}
      <nav className="flex justify-between items-center px-8 md:px-16 py-6 bg-white border-b border-gray-100 sticky top-0 z-50">
        <Link to="/" className="flex items-center space-x-4">
          {/* Logo Université - h-12 et w-auto pour ne pas compresser */}
          <img src={logoUY1} alt="UY1 Logo" className="h-12 w-auto object-contain" />
          
          {/* Séparateur vertical */}
          <div className="h-10 w-[1px] bg-gray-200"></div>

          {/* Titre et Label */}
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">UY1 - ICT</span>
            <span className="text-xl font-black text-[#1E293B]">EDT Universitaire</span>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center space-x-10 text-sm font-bold">
          <Link to="/" className="text-gray-500 hover:text-blue-600 transition-colors">Accueil</Link>
          <Link to="/about" className="text-blue-600">À propos</Link>
          <Link to="/contact" className="text-gray-500 hover:text-blue-600 transition-colors">Contact</Link>
        </div>

        <Link 
          to="/login" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-blue-200 transition-all"
        >
          Se Connecter
        </Link>
      </nav>

      {/* --- CONTENU PRINCIPAL --- */}
      <main className="flex-grow">
        {/* Hero Section About */}
        <section className="max-w-5xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-[#1E293B] mb-6 leading-tight">
            Une solution pensée pour <br />
            <span className="text-blue-600 italic">l'Emploi du Temps académique.</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-3xl mx-auto leading-relaxed">
            EDT Universitaire est une plateforme innovante conçue dans le cadre de l'UE ICT 203. 
            Notre mission est de simplifier la logistique universitaire en automatisant la planification 
            complexe des cours au sein de l'UY1.
          </p>
        </section>

        {/* Features Grid */}
        <section className="max-w-7xl mx-auto px-6 md:px-16 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50 hover:shadow-md transition-all">
                <div className={`w-12 h-12 ${f.color} rounded-2xl flex items-center justify-center mb-6`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-extrabold text-[#1E293B] mb-3">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Détails Techniques / Contexte */}
        <section className="max-w-4xl mx-auto px-6 py-20">
          <div className="bg-slate-900 rounded-[40px] p-10 md:p-16 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10">
              <Zap size={200} />
            </div>
            
            <div className="relative z-10 text-left">
              <h2 className="text-3xl font-black mb-8 italic">Contexte du Projet</h2>
              <div className="space-y-6 text-slate-300">
                <div className="flex items-start space-x-4">
                  <div className="mt-1 bg-blue-500 rounded-full p-1"><CheckCircle2 size={14} className="text-white"/></div>
                  <p><span className="text-white font-bold text-sm">Année Académique :</span> 2025 / 2026</p>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="mt-1 bg-blue-500 rounded-full p-1"><CheckCircle2 size={14} className="text-white"/></div>
                  <p><span className="text-white font-bold text-sm">Développement :</span> Stack Full JavaScript (React.js, Node.js, Prisma, SQLite).</p>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="mt-1 bg-blue-500 rounded-full p-1"><CheckCircle2 size={14} className="text-white"/></div>
                  <p><span className="text-white font-bold text-sm">Objectif :</span> Éliminer les conflits d'horaires et maximiser l'utilisation des ressources.</p>
                </div>
              </div>

              <div className="mt-12 flex items-center space-x-4 border-t border-slate-800 pt-8">
                <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
                    <Award className="text-white" size={24}/>
                </div>
                <div>
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Réalisé par</p>
                    <p className="text-xl font-black italic">Groupe TP - ICT 203</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- FOOTER IDENTIQUE --- */}
      <footer className="bg-white border-t border-gray-100 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-16 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>© 2025/2026 EDT Universitaire. Projet Académique ICT 203.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 font-medium text-gray-500">
            <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Confidentialité</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;