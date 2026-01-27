import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, Github, Linkedin, User, 
  Code2, Database, Layout, FileText, 
  ShieldCheck, GraduationCap 
} from 'lucide-react';
import logoUY1 from '../assets/logo_uy1.png';

const Contact = () => {
  // Liste des 6 développeurs (ajustez les noms et rôles)
  const developers = [
    {
      name: "Nom du Chef",
      role: "Chef de Projet & Backend",
      matricule: "21UXXXX",
      email: "chef@uy1.cm",
      icon: <ShieldCheck size={28} className="text-blue-600" />,
      bg: "bg-blue-50"
    },
    {
      name: "Nom Dev 2",
      role: "Architecte Backend",
      matricule: "21UXXXX",
      email: "dev2@uy1.cm",
      icon: <Database size={28} className="text-cyan-600" />,
      bg: "bg-cyan-50"
    },
    {
      name: "Nom Dev 3",
      role: "Développeur Frontend",
      matricule: "21UXXXX",
      email: "dev3@uy1.cm",
      icon: <Layout size={28} className="text-indigo-600" />,
      bg: "bg-indigo-50"
    },
    {
      name: "Nom Dev 4",
      role: "UI/UX & Frontend",
      matricule: "21UXXXX",
      email: "dev4@uy1.cm",
      icon: <Code2 size={28} className="text-purple-600" />,
      bg: "bg-purple-50"
    },
    {
      name: "Nom Dev 5",
      role: "Gestion de Base de Données",
      matricule: "21UXXXX",
      email: "dev5@uy1.cm",
      icon: <ShieldCheck size={28} className="text-emerald-600" />,
      bg: "bg-emerald-50"
    },
    {
      name: "Nom Dev 6",
      role: "Documentation & QA",
      matricule: "21UXXXX",
      email: "dev6@uy1.cm",
      icon: <FileText size={28} className="text-orange-600" />,
      bg: "bg-orange-50"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* --- NAVBAR IDENTIQUE --- */}
      <nav className="flex justify-between items-center px-8 md:px-16 py-6 bg-white border-b border-gray-100 sticky top-0 z-50">
        <Link to="/" className="flex items-center space-x-4">
          <img src={logoUY1} alt="UY1 Logo" className="h-12 w-auto object-contain" />
          <div className="h-10 w-[1px] bg-gray-200"></div>
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">UY1 - ICT</span>
            <span className="text-xl font-black text-[#1E293B]">EDT Universitaire</span>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center space-x-10 text-sm font-bold">
          <Link to="/" className="text-gray-500 hover:text-blue-600 transition-colors">Accueil</Link>
          <Link to="/about" className="text-gray-500 hover:text-blue-600 transition-colors">À propos</Link>
          <Link to="/contact" className="text-blue-600">Contact</Link>
        </div>

        <Link 
          to="/login" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-blue-200 transition-all"
        >
          Se Connecter
        </Link>
      </nav>

      {/* --- CONTENU --- */}
      <main className="flex-grow">
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full mb-6">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">L'ÉQUIPE DE DÉVELOPPEMENT</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#1E293B] mb-4 leading-tight">
              Rencontrez les innovateurs <br />
              <span className="text-blue-600 italic">Groupe ICT-203.</span>
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Une équipe passionnée d'étudiants en ICT travaillant ensemble pour moderniser 
              la planification académique à l'Université de Yaoundé I.
            </p>
          </div>

          {/* Grille des Développeurs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {developers.map((dev, i) => (
              <div key={i} className="group bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex flex-col items-center text-center">
                  {/* Avatar Placeholder avec Icone de rôle */}
                  <div className={`w-20 h-20 ${dev.bg} rounded-[24px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {dev.icon}
                  </div>

                  <h3 className="text-xl font-black text-[#1E293B] mb-1">{dev.name}</h3>
                  <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-4">{dev.role}</p>
                  
                  <div className="w-full h-[1px] bg-gray-50 mb-6"></div>

                  <div className="space-y-3 w-full">
                    <div className="flex items-center justify-center space-x-2 text-gray-500">
                      <GraduationCap size={16} className="text-gray-400"/>
                      <span className="text-xs font-medium">Matricule : {dev.matricule}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-gray-500">
                      <Mail size={16} className="text-gray-400"/>
                      <span className="text-xs font-medium">{dev.email}</span>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex space-x-4 mt-8">
                    <button className="p-2 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                      <Github size={18} />
                    </button>
                    <button className="p-2 bg-gray-50 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all">
                      <Linkedin size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section Contact Direct */}
        <section className="max-w-4xl mx-auto px-6 pb-20">
          <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between">
            <div className="text-left mb-6 md:mb-0">
              <h2 className="text-2xl font-black text-[#1E293B]">Un problème technique ?</h2>
              <p className="text-gray-400 text-sm">Contactez notre support étudiant 24/7.</p>
            </div>
            <a 
              href="mailto:support-ict@uy1.cm" 
              className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
            >
              Envoyer un message
            </a>
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-gray-100 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-16 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>© 2025/2026 EDT Universitaire. Projet Académique ICT 203.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 font-medium text-gray-500">
            <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
            <a href="#" className="hover:text-blue-600 transition-colors">UY1 - ICT</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;