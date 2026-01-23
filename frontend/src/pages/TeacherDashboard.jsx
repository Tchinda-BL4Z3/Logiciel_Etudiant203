import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherLayout from '../components/TeacherLayout';
import { 
  Clock, 
  Calendar as CalendarIcon, 
  MapPin, 
  User, 
  ChevronRight, 
  ArrowRight, 
  Bell,
  AlertCircle 
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import axios from 'axios';

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('userRole') || 'TEACHER';
    
    const teacherId = localStorage.getItem('teacherId');
    const teacherName = localStorage.getItem('teacherName');

    const [dashboardData, setDashboardData] = useState({
        nextSession: null,
        weeklyStats: [],
        upcomingSessions: [],
        classes: [],
        desidProgress: 0,
        totalHours: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (role !== 'TEACHER') {
            navigate('/login');
            return;
        }

        const fetchTeacherData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/teachers/${teacherId}/dashboard`);
                // On s'assure que les données reçues ont la bonne structure ou on garde les valeurs par défaut
                setDashboardData({
                    nextSession: response.data.nextSession || null,
                    weeklyStats: response.data.weeklyStats || [],
                    upcomingSessions: response.data.upcomingSessions || [],
                    classes: response.data.classes || [],
                    desidProgress: response.data.desidProgress || 0,
                    totalHours: response.data.totalHours || 0
                });
                setLoading(false);
            } catch (error) {
                console.error("Erreur lors du chargement des données", error);
                setLoading(false);
            }
        };

        if(teacherId) fetchTeacherData();
    }, [role, navigate, teacherId]);

    if (loading) {
        return (
            <TeacherLayout>
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-black uppercase italic tracking-[3px] animate-pulse">Synchronisation de votre session...</p>
                </div>
            </TeacherLayout>
        );
    }

  return (
    <TeacherLayout>
      {/* --- HEADER --- */}
      <div className="mb-8 flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                Bonjour, {teacherName || 'Enseignant'}
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[2px] italic">
                UY1 - ICT • Session ID-{teacherId}
            </p>
        </div>
        <div className="flex items-center space-x-4">
            <div className="relative p-2 bg-white rounded-xl border border-slate-100 shadow-sm cursor-pointer hover:bg-slate-50 transition-all">
                <Bell size={20} className="text-slate-400" />
                {/* Sécurisé avec ?. */}
                {dashboardData.upcomingSessions?.length > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                )}
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- COLONNE GAUCHE --- */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-gradient-to-br from-[#2DD4BF] to-[#0D9488] rounded-[40px] p-8 text-white shadow-xl shadow-teal-200/50 relative overflow-hidden group border-b-8 border-teal-600/30">
            {dashboardData.nextSession ? (
                <div className="relative z-10">
                    <div className="flex items-center space-x-2 mb-6">
                        <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest italic">Prochaine Séance</span>
                        <span className="text-[10px] font-bold opacity-80">• {dashboardData.nextSession?.jour}</span>
                    </div>
                    <h2 className="text-4xl font-black mb-12 leading-tight max-w-lg uppercase italic tracking-tighter">
                        {dashboardData.nextSession?.ue?.nom} <br/>
                        <span className="text-teal-100 text-lg not-italic tracking-normal opacity-80">({dashboardData.nextSession?.ue?.code})</span>
                    </h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/20 pt-8">
                        <div>
                            <p className="text-[9px] uppercase font-black opacity-60 mb-2 tracking-widest">Horaire</p>
                            <div className="flex items-center space-x-2">
                                <Clock size={16} className="text-teal-100" /> 
                                <span className="font-bold text-base">{dashboardData.nextSession?.plageHoraire}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[9px] uppercase font-black opacity-60 mb-2 tracking-widest">Date prévue</p>
                            <div className="flex items-center space-x-2">
                                <CalendarIcon size={16} className="text-teal-100" /> 
                                <span className="font-bold text-base">
                                    {dashboardData.nextSession?.date ? new Date(dashboardData.nextSession.date).toLocaleDateString('fr-FR', {day: 'numeric', month: 'short'}) : 'N/A'}
                                </span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[9px] uppercase font-black opacity-60 mb-2 tracking-widest">Localisation</p>
                            <div className="flex items-center space-x-2">
                                <MapPin size={16} className="text-teal-100" /> 
                                <span className="font-bold text-base">{dashboardData.nextSession?.salle?.nom || 'À définir'}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[9px] uppercase font-black opacity-60 mb-2 tracking-widest">Classe</p>
                            <div className="flex items-center space-x-2">
                                <User size={16} className="text-teal-100" /> 
                                <span className="font-bold text-base">{dashboardData.nextSession?.classe?.nom || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="relative z-10 py-12 text-center">
                    <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-xl font-black italic uppercase">Aucun cours programmé</p>
                    <p className="text-sm opacity-70">L'administration n'a pas encore validé votre planning.</p>
                </div>
            )}
            <div className="absolute top-[-20%] right-[-10%] w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h3 className="text-lg font-black text-slate-800 uppercase italic tracking-widest">Volume Horaire Hebdomadaire</h3>
                    <p className="text-xs text-slate-400 font-medium">Total cette semaine : <span className="font-bold text-blue-600">{dashboardData.totalHours || 0} heures</span></p>
                </div>
                <div className="bg-slate-50 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-slate-500 border border-slate-100">Semestre Actuel</div>
            </div>
            
            <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardData.weeklyStats || []}>
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 900}} 
                            dy={10}
                        />
                        <Tooltip 
                            cursor={{fill: '#F1F5F9', radius: 10}} 
                            contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold'}} 
                        />
                        <Bar 
                            dataKey="heures" 
                            fill="#E2E8F0" 
                            radius={[8, 8, 8, 8]} 
                            className="cursor-pointer"
                            activeBar={{ fill: '#3B82F6' }}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* --- COLONNE DROITE --- */}
        <div className="space-y-8">
            
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col h-fit">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-black text-slate-800 uppercase italic tracking-widest">Statut des Vœux</h3>
                    <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider border border-orange-200">En cours</span>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-[30px] mb-6 border border-slate-100">
                    <div className="flex justify-between text-xs font-black mb-4 uppercase tracking-widest">
                        <span className="text-slate-400">Progression Saisie</span>
                        <span className="text-blue-600">{dashboardData.desidProgress || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div 
                            className="bg-teal-400 h-full transition-all duration-1000" 
                            style={{width: `${dashboardData.desidProgress || 0}%`}}
                        ></div>
                    </div>
                </div>
                
                <p className="text-[10px] text-slate-400 italic mb-8 leading-relaxed font-medium">
                    Note : Vos choix de plages horaires servent de base à l'administrateur pour la programmation optimale.
                </p>
                
                <button 
                    onClick={() => navigate('/teacher/voeux')}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[3px] shadow-xl shadow-slate-200 hover:bg-slate-800 active:scale-95 transition-all"
                >
                    Soumettre mes vœux
                </button>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col h-fit">
                <h3 className="text-lg font-black text-slate-800 mb-8 uppercase italic tracking-widest">Mes Classes</h3>
                <div className="space-y-5">
                    {/* Sécurisé avec ?. */}
                    {dashboardData.classes?.length > 0 ? (
                        dashboardData.classes.map((cls, i) => (
                            <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-2xl transition-all">
                                <div className="flex items-center space-x-4">
                                    <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs border border-blue-100 uppercase italic">
                                        {cls.nom?.substring(0, 3)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700 uppercase">{cls.nom}</p>
                                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{cls.effectif} étudiants</p>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                            </div>
                        ))
                    ) : (
                        <p className="text-[10px] text-slate-300 italic text-center py-4 uppercase font-black">Aucune classe assignée</p>
                    )}
                </div>
                <button className="w-full mt-10 py-4 border-2 border-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-[3px] hover:bg-slate-50 hover:text-blue-600 transition-all">
                    Liste Complète
                </button>
            </div>

        </div>

      </div>

      {/* --- SECTION BAS : TABLEAU --- */}
      <div className="mt-10 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <div>
                <h3 className="text-xl font-black text-slate-800 uppercase italic tracking-widest">Planning des 7 prochains jours</h3>
                <p className="text-xs text-slate-400 font-medium italic">Séances officiellement programmées</p>
              </div>
              <button className="text-blue-600 font-black text-[10px] uppercase tracking-widest flex items-center bg-blue-50 px-6 py-3 rounded-2xl hover:bg-blue-100 transition-all border border-blue-100">
                  Calendrier Complet <ArrowRight size={14} className="ml-2" />
              </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[4px] border-b border-slate-100">
                    <tr>
                        <th className="px-10 py-5 tracking-widest">UE / Module</th>
                        <th className="px-10 py-5">Classe</th>
                        <th className="px-10 py-5">Date & Heure</th>
                        <th className="px-10 py-5">Salle assignée</th>
                        <th className="px-10 py-5 text-right">Statut</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {/* Sécurisé avec ?. */}
                    {dashboardData.upcomingSessions?.length > 0 ? (
                        dashboardData.upcomingSessions.map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-10 py-8">
                                    <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors uppercase italic">{row.ue?.nom}</p>
                                    <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-[2px]">{row.ue?.code}</p>
                                </td>
                                <td className="px-10 py-8">
                                    <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 uppercase">{row.classe?.nom}</span>
                                </td>
                                <td className="px-10 py-8">
                                    <div className="flex items-center text-sm font-bold text-slate-600 italic">
                                        <Clock size={14} className="mr-2 text-blue-400" /> 
                                        {row.jour}, {row.plageHoraire}
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <span className="bg-slate-900 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-lg shadow-slate-200">
                                        {row.salle?.nom || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-10 py-8 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-green-600 text-[10px] font-black uppercase tracking-widest">Programmé</span>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="px-10 py-20 text-center text-slate-300 italic uppercase font-black tracking-[5px]">
                                Aucune séance à venir cette semaine
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
          </div>
      </div>
    </TeacherLayout>
  );
};

export default TeacherDashboard;