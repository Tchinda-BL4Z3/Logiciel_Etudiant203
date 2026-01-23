import React from 'react';
import TeacherLayout from '../components/TeacherLayout';
import { Users, BookOpen, BarChart3, ChevronRight, GraduationCap } from 'lucide-react';

const TeacherClasses = () => {
  // Données simulées (À lier à la table 'Classe' et 'UE' plus tard)
  const myClasses = [
    { id: 1, nom: 'ICT-L2', ue: 'ICT203', nbEtudiants: 125, progression: 45, specialite: 'Informatique' },
    { id: 2, nom: 'ICT-L3', ue: 'ICT301', nbEtudiants: 85, progression: 70, specialite: 'Génie Logiciel' },
  ];

  return (
    <TeacherLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase italic mb-2">Mes Classes</h1>
        <p className="text-slate-400 text-sm font-medium italic">Suivi des effectifs et de la progression pédagogique par section.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {myClasses.map((cls) => (
          <div key={cls.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black shadow-inner">
                  <GraduationCap size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800">{cls.nom}</h3>
                  <p className="text-blue-600 font-bold text-xs uppercase tracking-widest">{cls.specialite}</p>
                </div>
              </div>
              <span className="bg-slate-50 text-slate-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-100">
                Semestre 1
              </span>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-slate-500 font-bold">
                  <BookOpen size={16} className="mr-2 text-slate-300" /> UE : {cls.ue}
                </div>
                <div className="flex items-center text-slate-500 font-bold">
                  <Users size={16} className="mr-2 text-slate-300" /> {cls.nbEtudiants} Étudiants
                </div>
              </div>

              {/* Barre de progression */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progression du cours</p>
                  <p className="text-xs font-black text-blue-600">{cls.progression}%</p>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-50">
                  <div 
                    className="bg-blue-600 h-full shadow-[0_0_10px_rgba(29,118,242,0.3)] transition-all duration-1000" 
                    style={{ width: `${cls.progression}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <button className="w-full mt-8 py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold text-xs uppercase tracking-[3px] group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center justify-center">
              Consulter la liste <ChevronRight size={16} className="ml-2" />
            </button>
          </div>
        ))}
      </div>
    </TeacherLayout>
  );
};

export default TeacherClasses;