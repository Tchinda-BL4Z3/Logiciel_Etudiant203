import React, { useState, useEffect } from 'react';
import TeacherLayout from '../components/TeacherLayout';
import { 
  BookOpen, Calendar as CalendarIcon, Clock, Plus, 
  Trash2, Info, CheckCircle2, AlertCircle, Send, MessageSquare
} from 'lucide-react';
import axios from 'axios';

const TeacherVoeux = () => {
  // --- ÉTATS ---
  const [myUEs, setMyUEs] = useState([]);
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // MISE À JOUR : Ajout du champ 'notice' dans l'état du formulaire
  const [formData, setFormData] = useState({ 
    ueId: '', 
    jour: 'Lundi', 
    plageHoraire: '08:00 - 10:00',
    notice: '' // Champ pour la justification
  });
  
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // --- RÉCUPÉRATION SÉCURISÉE DE L'ID ---
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const teacherId = currentUser && currentUser.id ? Number(currentUser.id) : null;

  useEffect(() => {
    if (teacherId && !isNaN(teacherId)) {
      fetchData();
    } else {
      console.error("ID Enseignant invalide ou absent du localStorage");
    }
  }, [teacherId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const resUE = await axios.get(`http://localhost:5000/api/teachers/${teacherId}/ues`);
      setMyUEs(resUE.data);

      const resWishes = await axios.get(`http://localhost:5000/api/teachers/${teacherId}/desiderata`);
      setWishes(resWishes.data);
      
      setLoading(false);
    } catch (error) {
      console.error("Erreur de chargement des données", error);
      setLoading(false);
    }
  };

  const triggerNotify = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ ...notification, show: false }), 3000);
  };

  // --- ACTIONS ---
  const handleAddWish = async (e) => {
    e.preventDefault();
    
    if (!teacherId || isNaN(teacherId)) {
        return triggerNotify("Session expirée. Veuillez vous reconnecter.", "error");
    }

    if (!formData.ueId) {
        return triggerNotify("Veuillez choisir une UE", "error");
    }

    try {
      // MISE À JOUR : Envoi de la 'notice' au backend
      const payload = { 
        jour: formData.jour,
        plageHoraire: formData.plageHoraire,
        ueId: parseInt(formData.ueId),
        teacherId: teacherId,
        notice: formData.notice // On transmet la note saisie
      };

      await axios.post('http://localhost:5000/api/desiderata', payload);
      
      triggerNotify("Souhait ajouté au récapitulatif", "success");
      
      // Réinitialiser les champs tout en gardant jour/heure pour la rapidité
      setFormData({ ...formData, ueId: '', notice: '' }); 
      
      fetchData(); 
    } catch (err) {
      if (err.response && err.response.status === 409) {
        triggerNotify("Ce créneau est déjà dans vos vœux", "error");
      } else {
        triggerNotify("Erreur lors de l'enregistrement", "error");
        console.error("Erreur API :", err.response?.data || err.message);
      }
    }
  };

  const handleDeleteWish = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/desiderata/${id}`);
      triggerNotify("Vœu retiré avec succès", "success");
      fetchData(); 
    } catch (err) {
      console.error("Erreur suppression:", err);
      triggerNotify("Erreur lors de la suppression", "error");
    }
  };

  return (
    <TeacherLayout>
      {notification.show && (
        <div className={`fixed top-10 right-10 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border border-solid animate-in slide-in-from-right duration-300 ${
          notification.type === 'success' ? 'bg-white border-green-100 text-green-600' : 'bg-white border-red-100 text-red-600'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 size={20}/> : <AlertCircle size={20}/>}
          <p className="font-black text-[10px] uppercase tracking-widest">{notification.message}</p>
        </div>
      )}

      <div className="mb-10 text-left">
        <h1 className="text-4xl font-black text-slate-800 uppercase italic tracking-tighter">
          Soumettre mes vœux
        </h1>
        <p className="text-slate-400 text-sm font-medium mt-1">Saisie des préférences horaires et justifications pour l'administration.</p>
      </div>

      <div className="mb-10 bg-blue-50 border border-blue-100 p-6 rounded-[24px] flex items-start space-x-4 text-left">
        <div className="p-2 bg-blue-100 rounded-full text-blue-600 flex-shrink-0">
          <Info size={20}/>
        </div>
        <div>
          <p className="text-blue-700 font-black text-[10px] uppercase tracking-widest mb-1">Notice d'arbitrage</p>
          <p className="text-blue-600/70 text-xs font-medium leading-relaxed">
            Utilisez le champ "Note" pour expliquer les raisons de vos choix (contraintes de recherche, indisponibilités majeures). 
            Cela aidera l'administrateur dans ses décisions finales.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* --- FORMULAIRE DE SAISIE --- */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm h-fit">
          <h3 className="text-xl font-black text-slate-800 uppercase italic tracking-widest mb-8 text-left underline decoration-blue-500 decoration-4 underline-offset-8">
            Nouveau Souhait
          </h3>
          
          <form onSubmit={handleAddWish} className="space-y-6 text-left">
            {/* UE */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-2">Unité d'enseignement</label>
              <div className="relative">
                <BookOpen className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <select 
                  required
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer transition-all"
                  value={formData.ueId}
                  onChange={(e) => setFormData({...formData, ueId: e.target.value})}
                >
                  <option value="">Sélectionner une UE</option>
                  {myUEs.length > 0 ? (
                    myUEs.map(ue => (
                      <option key={ue.id} value={ue.id}>{ue.code} - {ue.nom}</option>
                    ))
                  ) : (
                    <option disabled>Aucune UE attribuée</option>
                  )}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Jour */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-2">Jour</label>
                    <div className="relative">
                        <CalendarIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <select 
                            className="w-full pl-14 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500/20 transition-all text-xs"
                            value={formData.jour}
                            onChange={(e) => setFormData({...formData, jour: e.target.value})}
                        >
                            {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"].map(j => (
                                <option key={j} value={j}>{j}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Heure */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-2">Créneau</label>
                    <div className="relative">
                        <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <select 
                            className="w-full pl-14 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500/20 transition-all text-xs"
                            value={formData.plageHoraire}
                            onChange={(e) => setFormData({...formData, plageHoraire: e.target.value})}
                        >
                            {["08:00 - 10:00", "10:00 - 12:00", "13:00 - 15:00", "15:00 - 17:00", "17:00 - 19:00"].map(h => (
                                <option key={h} value={h}>{h}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* MISE À JOUR : Ajout du champ Notice */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-2">Note / Justification (Optionnel)</label>
              <div className="relative">
                <MessageSquare className="absolute left-5 top-5 text-slate-300" size={18} />
                <textarea 
                  rows="3"
                  placeholder="Expliquez brièvement la raison de ce vœu..."
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm resize-none"
                  value={formData.notice}
                  onChange={(e) => setFormData({...formData, notice: e.target.value})}
                ></textarea>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#1d76f2] text-white py-5 rounded-[22px] font-black text-[11px] uppercase tracking-[4px] shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95 mt-4"
            >
              <Plus size={18}/> Enregistrer le vœu
            </button>
          </form>
        </div>

        {/* --- RÉCAPITULATIF DES VOEUX --- */}
        <div className="lg:col-span-3 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col h-full min-h-[550px]">
          <div className="flex justify-between items-center mb-10">
            <div className="text-left">
              <h3 className="text-xl font-black text-slate-800 uppercase italic tracking-widest underline decoration-blue-500 decoration-4 underline-offset-8">
                Récapitulatif
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">{wishes.length} vœu(x) en attente d'arbitrage</p>
            </div>
            {wishes.length > 0 && (
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-green-500 uppercase tracking-widest">Connecté</span>
                    <button className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm">
                        <Send size={20}/>
                    </button>
                </div>
            )}
          </div>

          <div className="flex-1 space-y-4">
            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : wishes.length > 0 ? (
              wishes.map((w, i) => (
                <div key={i} className="group p-6 bg-slate-50 rounded-[25px] border border-slate-100 hover:border-blue-200 transition-all animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600 font-black text-xs border border-slate-100">
                        {w.ue?.code || 'UE'}
                        </div>
                        <div className="text-left">
                        <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{w.jour}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <Clock size={12} className="text-slate-300"/>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">{w.plageHoraire}</p>
                        </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => handleDeleteWish(w.id)}
                        className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shadow-sm"
                    >
                        <Trash2 size={18}/>
                    </button>
                  </div>

                  {/* MISE À JOUR : Affichage de la notice si elle existe */}
                  {w.notice && (
                    <div className="mt-4 p-3 bg-white/50 border-l-4 border-blue-400 rounded-r-xl flex items-start gap-3">
                        <MessageSquare size={14} className="text-blue-400 mt-1 flex-shrink-0" />
                        <p className="text-[10px] font-medium text-slate-500 italic text-left leading-relaxed">
                            "{w.notice}"
                        </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-200 py-20">
                <AlertCircle size={40} className="opacity-20 mb-4" />
                <p className="text-lg font-black italic uppercase tracking-[5px]">Aucun vœu formulé</p>
              </div>
            )}
          </div>

          <div className="mt-10 pt-10 border-t border-slate-50 text-[9px] text-slate-300 font-black uppercase tracking-[3px] text-center">
            SYSTÈME DE GESTION EDT • UY1 ICT 2025/2026
          </div>
        </div>

      </div>
    </TeacherLayout>
  );
};

export default TeacherVoeux;