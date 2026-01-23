import React, { useState, useEffect } from 'react';
import TeacherLayout from '../components/TeacherLayout';
import { 
  Plus, 
  Trash2, 
  Info, 
  Clock, 
  Calendar as CalendarIcon, 
  BookOpen, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const SLOTS = ["08:00 - 10:00", "10:00 - 12:00", "13:00 - 15:00", "15:00 - 17:00"];

const TeacherVoeux = () => {
    const teacherId = localStorage.getItem('teacherId');
    const [myUEs, setMyUEs] = useState([]); // Liste des cours assignés à ce prof
    const [voeuxList, setVoeuxList] = useState([]); // Liste locale des vœux en cours de saisie
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // État du formulaire
    const [formData, setFormData] = useState({
        ueId: '',
        jour: 'Lundi',
        plageHoraire: '08:00 - 10:00'
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // 1. Récupérer les UEs de l'enseignant
                const resUE = await axios.get(`http://localhost:5000/api/teachers/${teacherId}/ues`);
                setMyUEs(resUE.data);
                
                // 2. Récupérer les vœux déjà existants en BD
                const resVoeux = await axios.get(`http://localhost:5000/api/teachers/${teacherId}/voeux`);
                setVoeuxList(resVoeux.data);
                
                setLoading(false);
            } catch (error) {
                console.error("Erreur chargement vœux", error);
                setLoading(false);
            }
        };
        fetchInitialData();
    }, [teacherId]);

    const addVoeuLocally = () => {
        if (!formData.ueId) return alert("Veuillez choisir une UE");
        
        // Vérifier les doublons
        const exists = voeuxList.find(v => v.jour === formData.jour && v.plageHoraire === formData.plageHoraire);
        if (exists) return alert("Vous avez déjà un vœu sur ce créneau !");

        const selectedUE = myUEs.find(u => u.id === parseInt(formData.ueId));
        const newVoeu = {
            ...formData,
            ueNom: selectedUE.nom,
            ueCode: selectedUE.code,
            idTmp: Date.now() // ID temporaire pour la liste locale
        };
        setVoeuxList([...voeuxList, newVoeu]);
    };

    const removeVoeu = (id) => {
        setVoeuxList(voeuxList.filter(v => v.idTmp !== id && v.id !== id));
    };

    const handleFinalSubmit = async () => {
        setSubmitting(true);
        try {
            await axios.post(`http://localhost:5000/api/teachers/${teacherId}/voeux`, { voeux: voeuxList });
            alert("Vos vœux ont été enregistrés avec succès !");
            setSubmitting(false);
        } catch (error) {
            alert("Erreur lors de la soumission");
            setSubmitting(false);
        }
    };

    return (
        <TeacherLayout>
            {/* --- HEADER --- */}
            <div className="mb-10">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase italic mb-2">
                    Soumettre mes Vœux (Désidératas)
                </h1>
                <p className="text-slate-400 text-sm font-medium">Interface de saisie des plages horaires souhaitées pour le semestre en cours.</p>
            </div>

            {/* --- NOTICE INFO (Contrainte du PDF) --- */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-[24px] mb-10 flex items-start space-x-4">
                <Info className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                <div>
                    <h4 className="text-blue-900 font-bold text-sm uppercase tracking-wide">Période de saisie ouverte</h4>
                    <p className="text-blue-700 text-xs leading-relaxed mt-1">
                        Conformément au règlement, vous pouvez modifier vos désidératas jusqu'à la clôture de la programmation. 
                        L'administrateur utilisera ces données pour effectuer les arbitrages nécessaires.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* --- FORMULAIRE DE SAISIE --- */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm sticky top-8">
                        <h3 className="text-lg font-black text-slate-800 mb-8 uppercase italic tracking-widest border-b border-slate-50 pb-4">Nouveau souhait</h3>
                        
                        <div className="space-y-6">
                            {/* Choix de l'UE */}
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Unité d'Enseignement</label>
                                <div className="relative">
                                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <select 
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                                        onChange={(e) => setFormData({...formData, ueId: e.target.value})}
                                    >
                                        <option value="">Sélectionner une UE</option>
                                        {myUEs.map(ue => {
                                          const cleanName = ue.nom.split(' - ')[0].replace(/COURS DE .*/i, '').trim();
                                          return (
                                            <option key={ue.id} value={ue.id}>
                                              {ue.code} — [{cleanName || ue.nom}]
                                            </option>
                                          );
                                        })}
                                    </select>
                                </div>
                            </div>

                            {/* Choix du Jour */}
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Jour souhaité</label>
                                <div className="relative">
                                    <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <select 
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                                        onChange={(e) => setFormData({...formData, jour: e.target.value})}
                                    >
                                        {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Choix de la Plage */}
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Créneau Horaire</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <select 
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                                        onChange={(e) => setFormData({...formData, plageHoraire: e.target.value})}
                                    >
                                        {SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>

                            <button 
                                onClick={addVoeuLocally}
                                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[3px] shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center"
                            >
                                <Plus size={18} className="mr-2" /> Ajouter au panier
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- LISTE RÉCAPITULATIVE --- */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <div>
                                <h3 className="text-lg font-black text-slate-800 uppercase italic tracking-widest">Récapitulatif de mes choix</h3>
                                <p className="text-xs text-slate-400 font-medium">{voeuxList.length} créneau(x) sélectionné(s)</p>
                            </div>
                            {voeuxList.length > 0 && (
                                <button 
                                    onClick={handleFinalSubmit}
                                    disabled={submitting}
                                    className="bg-green-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-green-100 hover:bg-green-700 transition-all flex items-center"
                                >
                                    {submitting ? "Envoi..." : <><CheckCircle2 size={16} className="mr-2" /> Valider mes vœux</>}
                                </button>
                            )}
                        </div>

                        <div className="flex-grow p-8">
                            {voeuxList.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4">
                                    <AlertCircle size={48} className="opacity-20" />
                                    <p className="font-black uppercase italic tracking-[4px]">Aucun vœu formulé</p>
                                    <p className="text-xs text-slate-400 not-italic tracking-normal">Utilisez le formulaire à gauche pour commencer.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {voeuxList.map((voeu, index) => (
                                        <div key={voeu.id || voeu.idTmp} className="group bg-slate-50 border border-slate-100 p-6 rounded-[28px] hover:border-blue-200 hover:bg-white transition-all relative overflow-hidden">
                                            <div className="flex items-start justify-between relative z-10">
                                                <div>
                                                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100">
                                                        {voeu.ueCode}
                                                    </span>
                                                    <h4 className="mt-3 font-bold text-slate-800 text-sm leading-tight">{voeu.ueNom}</h4>
                                                    
                                                    <div className="mt-4 flex flex-col space-y-2">
                                                        <div className="flex items-center text-xs font-bold text-slate-500">
                                                            <CalendarIcon size={14} className="mr-2 text-slate-300" /> {voeu.jour}
                                                        </div>
                                                        <div className="flex items-center text-xs font-bold text-slate-500">
                                                            <Clock size={14} className="mr-2 text-slate-300" /> {voeu.plageHoraire}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => removeVoeu(voeu.id || voeu.idTmp)}
                                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                            {/* Décoration fond */}
                                            <div className="absolute bottom-[-10px] right-[-10px] text-slate-100 opacity-0 group-hover:opacity-100 transition-all">
                                                <CalendarIcon size={80} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                Système de Gestion EDT • UY1 ICT 2025/2026
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </TeacherLayout>
    );
};

export default TeacherVoeux;