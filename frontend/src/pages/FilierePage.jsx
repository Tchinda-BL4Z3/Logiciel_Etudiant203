import React, { useState, useMemo, useEffect } from 'react';
import { 
  Filter, Download, Printer, 
  MapPin, User, Clock, Plus, SearchX, ChevronDown 
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout'; 

const FilierePage = () => {
  // --- ÉTATS POUR LES FILTRES ---
  // Initialisé sur ICT4D par défaut
  const [selectedFiliere, setSelectedFiliere] = useState('ICT4D');
  const [selectedClasse, setSelectedClasse] = useState('ICT4D-L1');

  // --- CONFIGURATION DE LA GRILLE ---
  const jours = ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI", "DIMANCHE"];
  const créneaux = ["8h00-11h00", "11h30-14h30", "15h00-18h00"];

  // --- STRUCTURE DE LA BD MISE À JOUR (Mapping Filières -> Classes) ---
  const filieresData = {
    "ICT4D": ["ICT4D-L1", "ICT4D-L2", "ICT4D-L3"],
    "Info Fonda": ["IF-L1", "IF-L2", "IF-L3"],
    "Mathématiques": ["MATH-L1", "MATH-L2", "MATH-L3"],
    "Physique": ["PHYS-L1", "PHYS-L2", "PHYS-L3"],
    "Chimie": ["CHIM-L1", "CHIM-L2"],
    "Biologie": ["BIO-L1", "BIO-L2", "BIO-L3"]
  };

  const filieresList = Object.keys(filieresData);

  // Sécurité : Si on change de filière, on sélectionne la première classe de la nouvelle filière
  useEffect(() => {
    if (filieresData[selectedFiliere]) {
      setSelectedClasse(filieresData[selectedFiliere][0]);
    }
  }, [selectedFiliere]);

  // --- TA BASE DE DONNÉES DE SESSIONS (Simulée avec les nouvelles filières) ---
  const toutesLesSessions = [
    { 
        filiere: "ICT4D", 
        classe: "ICT4D-L2", 
        jour: "LUNDI", 
        heure: "8h00-11h00", 
        code: "ICT203", 
        nom: "Génie Logiciel", 
        prof: "Dr. Tanon", 
        salle: "Amphi 250", 
        date: "26/01/2026" 
    },
    { 
        filiere: "Info Fonda", 
        classe: "IF-L1", 
        jour: "MARDI", 
        heure: "11h30-14h30", 
        code: "ALGO1", 
        nom: "Algorithmique Avancée", 
        prof: "Pr. Ndongo", 
        salle: "S102", 
        date: "27/01/2026" 
    },
    { 
        filiere: "Mathématiques", 
        classe: "MATH-L1", 
        jour: "MERCREDI", 
        heure: "8h00-11h00", 
        code: "ALG100", 
        nom: "Algèbre Linéaire", 
        prof: "Pr. Fongang", 
        salle: "S105", 
        date: "28/01/2026" 
    },
    { 
        filiere: "Physique", 
        classe: "PHYS-L2", 
        jour: "JEUDI", 
        heure: "15h00-18h00", 
        code: "THERM2", 
        nom: "Thermodynamique", 
        prof: "Dr. Atangana", 
        salle: "Labo Phys", 
        date: "29/01/2026" 
    },
    { 
        filiere: "Chimie", 
        classe: "CHIM-L1", 
        jour: "VENDREDI", 
        heure: "8h00-11h00", 
        code: "CHM101", 
        nom: "Chimie Organique", 
        prof: "Dr. Bella", 
        salle: "Amphi 300", 
        date: "30/01/2026" 
    }
  ];

  // --- LOGIQUE DYNAMIQUE : FILTRAGE ---
  const filteredCours = useMemo(() => {
    return toutesLesSessions.filter(session => {
        return session.filiere === selectedFiliere && session.classe === selectedClasse;
    });
  }, [selectedFiliere, selectedClasse]);

  // --- DÉTECTER SI L'EMPLOI DU TEMPS EST VIDE ---
  const isEmpty = filteredCours.length === 0;

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-700">
        
        {/* --- EN-TÊTE --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tighter">Emploi des Filières</h1>
            <p className="text-slate-400 font-medium text-sm">Consultez les plannings programmés par les enseignants</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-5 py-2.5 bg-white border border-slate-100 rounded-2xl text-slate-500 font-bold text-[10px] uppercase tracking-[2px] hover:bg-slate-50 transition-all shadow-sm">
              <Printer size={16} />
              <span>Imprimer</span>
            </button>
            <button className="flex items-center space-x-2 px-5 py-2.5 bg-[#0F172A] text-white rounded-2xl font-bold text-[10px] uppercase tracking-[2px] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
              <Download size={16} />
              <span>Exporter PDF</span>
            </button>
          </div>
        </div>

        {/* --- FILTRES DYNAMIQUES --- */}
        <div className="bg-white/60 backdrop-blur-md p-3 rounded-[30px] border border-white flex flex-wrap items-center gap-4 shadow-sm">
          <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-500 rounded-full">
            <Filter size={16} />
            <span className="font-black text-[10px] uppercase tracking-wider">Filtres</span>
          </div>

          {/* SÉLECTEUR FILIÈRE */}
          <div className="relative group">
            <select 
                className="appearance-none bg-white border border-slate-100 rounded-2xl px-6 pr-10 py-2.5 text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/10 transition-all cursor-pointer shadow-sm"
                value={selectedFiliere}
                onChange={(e) => setSelectedFiliere(e.target.value)}
            >
                {filieresList.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* SÉLECTEUR CLASSE (DYNAMIQUE) */}
          <div className="relative group">
            <select 
                className="appearance-none bg-white border border-slate-100 rounded-2xl px-6 pr-10 py-2.5 text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/10 transition-all cursor-pointer shadow-sm"
                value={selectedClasse}
                onChange={(e) => setSelectedClasse(e.target.value)}
            >
                {filieresData[selectedFiliere]?.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" />
          </div>

          <div className="ml-auto pr-6 flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[3px]">Année 2025/2026</span>
          </div>
        </div>

        {/* --- GRILLE DYNAMIQUE --- */}
        <div className="relative bg-white rounded-[45px] shadow-2xl shadow-slate-200/40 border border-slate-50 overflow-hidden min-h-[650px]">
          
          {/* OVERLAY MESSAGE SI VIDE */}
          {isEmpty && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[3px] animate-in fade-in zoom-in-95 duration-500 text-center p-10">
              <div className="w-24 h-24 bg-white rounded-full shadow-2xl flex items-center justify-center text-slate-200 mb-6 border border-slate-50">
                <SearchX size={48} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tighter">Emploi du temps non disponible</h3>
              <p className="text-slate-400 text-sm font-medium mt-2 max-w-sm">
                Aucune programmation n'a été détectée pour <span className="text-blue-500 font-black underline underline-offset-4">{selectedClasse}</span> ({selectedFiliere}).
              </p>
              <div className="mt-8 flex space-x-3">
                 <button className="px-6 py-3 bg-white border border-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-[2px] hover:bg-slate-50 transition-all shadow-sm">
                    Notifier Enseignants
                 </button>
                 <button className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[2px] hover:bg-blue-700 transition-all shadow-xl shadow-blue-200">
                    + Programmer manuellement
                 </button>
              </div>
            </div>
          )}

          {/* TABLEAU */}
          <div className={`overflow-x-auto transition-all duration-700 ${isEmpty ? 'grayscale opacity-20 scale-[0.98] pointer-events-none' : 'opacity-100 scale-100'}`}>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="p-8 text-left text-[10px] font-black text-slate-300 uppercase tracking-[2px] w-48">Horaires</th>
                  {jours.map(jour => (
                    <th key={jour} className="p-8 text-center text-[10px] font-black text-slate-300 uppercase tracking-[2px] min-w-[220px]">{jour}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {créneaux.map((créneau, idx) => (
                  <tr key={idx} className={idx !== créneaux.length - 1 ? "border-b border-slate-50" : ""}>
                    <td className="p-8 bg-slate-50/40 border-r border-slate-50/50">
                      <div className="flex items-center space-x-3 text-slate-400 font-bold text-xs italic">
                        <Clock size={16} className="text-slate-300" />
                        <span>{créneau}</span>
                      </div>
                    </td>
                    {jours.map(jour => {
                      const seance = filteredCours.find(c => c.jour === jour && c.heure === créneau);
                      return (
                        <td key={jour} className="p-4 h-64 border-r border-slate-50 last:border-r-0">
                          {seance ? (
                            <div className="h-full w-full bg-blue-600 rounded-[35px] p-6 text-white shadow-2xl shadow-blue-200 flex flex-col justify-between group hover:scale-[1.03] transition-all cursor-pointer">
                              <div>
                                <div className="flex justify-between items-start">
                                  <span className="text-[10px] font-black bg-white/20 px-3 py-1 rounded-full uppercase tracking-widest">{seance.code}</span>
                                  <span className="text-[10px] opacity-60 font-bold">{seance.date}</span>
                                </div>
                                <p className="mt-4 font-black text-lg leading-tight tracking-tighter">{seance.nom}</p>
                                <div className="mt-3 flex items-center space-x-2 opacity-80">
                                  <User size={14} />
                                  <p className="text-xs font-bold">{seance.prof}</p>
                                </div>
                              </div>
                              <div className="mt-auto flex items-center space-x-2 text-[10px] font-black bg-black/10 w-fit px-4 py-2 rounded-2xl border border-white/5">
                                <MapPin size={12} />
                                <span>{seance.salle}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full w-full rounded-[35px] border border-transparent flex flex-col items-center justify-center space-y-3 group hover:bg-slate-50/50 transition-all duration-500">
                              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-100 group-hover:text-blue-500 group-hover:shadow-md transition-all">
                                <Plus size={20} />
                              </div>
                              <span className="text-[10px] font-black text-slate-100 uppercase tracking-[3px] group-hover:text-slate-200 transition-colors">LIBRE</span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="flex justify-center pb-8">
           <p className="text-[9px] font-black text-slate-300 uppercase tracking-[5px]">Console d'administration • UY1 ICT</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default FilierePage;