import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Nécessaire pour la redirection
import AdminLayout from '../components/AdminLayout';
import { getStats, getClasses, getTeachers, getStudents } from '../services/api'; 
import axios from 'axios'; 
import { 
  Users, DoorOpen, ClipboardCheck, AlertTriangle, 
  Search, Layers, Home, UserSquare2, GraduationCap, 
  MoreHorizontal, Filter, Trash2, Lock, X, ShieldAlert, Mail, Hash, LogOut
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // --- 1. ÉTAT DES DONNÉES ---
  const [stats, setStats] = useState({
    totalEtudiants: 0,
    countTeachers: 0,
    countSalles: 0,
    countVoeux: 0,
    capaciteTotale: 0
  });

  const [classesList, setClassesList] = useState([]);
  const [teachersList, setTeachersList] = useState([]);
  const [studentsList, setStudentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('CLASSES');

  // --- 2. ÉTAT DES FILTRES ---
  const [filters, setFilters] = useState({
    recherche: '',
    departement: 'Tous',
    statut: 'Tous'
  });

  // --- 3. ÉTAT DE LA SUPPRESSION ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

  // --- 4. ÉTAT DE LA DÉCONNEXION ---
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const resStats = await getStats();
      if (resStats.data) setStats(resStats.data);

      const resClasses = await getClasses();
      if (resClasses.data) {
        setClassesList(resClasses.data.map(c => ({
          ...c,
          dept: c.departement || c.filiere || 'Informatique',
          prog: 45,
          statut: 'En cours'
        })));
      }

      const resTeachers = await getTeachers();
      if (resTeachers.data) {
        setTeachersList(resTeachers.data.map(t => ({
          ...t,
          dept: t.departement || 'Informatique',
          charge: 60,
          statut: 'Actif'
        })));
      }

      const resStudents = await getStudents();
      if (resStudents.data) {
        setStudentsList(resStudents.data.map(s => ({
          ...s,
          dept: s.filiere || 'Informatique',
          niveau: s.classe?.nom || 'N/A',
          prog: 85,
          statut: 'Inscrit'
        })));
      }

      setLoading(false);
    } catch (err) {
      console.error("Erreur de chargement des données:", err);
      setLoading(false);
    }
  };

  // --- LOGIQUE DE SUPPRESSION ---
  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
    setAdminPassword('');
    setDeleteError('');
  };

  const confirmDelete = async () => {
    if (adminPassword === 'admin') {
      try {
        const response = await axios.delete(`http://localhost:5000/api/users/${studentToDelete.id}`);
        if (response.status === 200) {
          setStudentsList(studentsList.filter(s => s.id !== studentToDelete.id));
          setShowDeleteModal(false);
          setStudentToDelete(null);
          setAdminPassword('');
          alert("L'étudiant a été supprimé définitivement de la base de données.");
        }
      } catch (error) {
        console.error("Erreur suppression API:", error);
        setDeleteError("Erreur serveur : impossible de supprimer l'étudiant.");
      }
    } else {
      setDeleteError("Mot de passe admin incorrect. Autorisation refusée.");
    }
  };

  // --- LOGIQUE DE DÉCONNEXION ---
  const handleConfirmLogout = () => {
    // Nettoyage des données de session
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdminAuthenticated');
    
    // Fermer la modal et rediriger
    setShowLogoutModal(false);
    navigate('/login');
  };

  const getFilteredData = () => {
    let list = [];
    if (activeTab === 'CLASSES') list = classesList;
    else if (activeTab === 'TEACHERS') list = teachersList;
    else if (activeTab === 'STUDENTS') list = studentsList;

    return list.filter(item => {
      const name = item.nom || item.name || '';
      const matchSearch = name.toLowerCase().includes(filters.recherche.toLowerCase());
      const matchDept = filters.departement === 'Tous' || item.dept === filters.departement;
      const matchStatut = filters.statut === 'Tous' || item.statut === filters.statut;
      return matchSearch && matchDept && matchStatut;
    });
  };

  const currentData = getFilteredData();

  return (
    <AdminLayout onLogoutClick={() => setShowLogoutModal(true)}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight italic">Console Centrale</h1>
          <p className="text-slate-400 text-sm font-medium">Vue globale et paramétrage des emplois du temps</p>
        </div>
      </div>

      {/* --- SECTION 1 : CHIFFRES CLÉS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {[
          { label: 'Étudiants', val: stats.totalEtudiants, icon: Users, color: 'blue', sub: 'Effectif total' },
          { label: 'Salles', val: stats.countSalles, icon: Home, color: 'orange', sub: 'Espaces en DB' },
          { label: 'Capacité', val: stats.capaciteTotale, icon: DoorOpen, color: 'emerald', sub: 'Places assises' },
          { label: 'Enseignants', val: stats.countTeachers, icon: ClipboardCheck, color: 'purple', sub: 'Enregistrés' },
          { label: 'Conflits', val: stats.countVoeux, icon: AlertTriangle, color: 'red', sub: 'À arbitrer' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100 flex flex-col justify-between hover:scale-[1.02] transition-all">
            <div className={`w-10 h-10 rounded-xl bg-${s.color}-50 text-${s.color}-600 flex items-center justify-center mb-3`}>
              <s.icon size={20} />
            </div>
            <div>
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">{s.label}</p>
              <div className="flex items-baseline space-x-1">
                <p className="text-2xl font-black text-slate-800 tracking-tighter">{s.val}</p>
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">{s.sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- SECTION 2 : CONTENEUR PRINCIPAL DES LISTES --- */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        
        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
          <div className="flex flex-col space-y-6">
            
            <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
              <button 
                onClick={() => {setActiveTab('CLASSES'); setFilters({...filters, recherche: ''})}}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'CLASSES' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <div className="flex items-center"><Layers size={14} className="mr-2"/> Classes</div>
              </button>
              <button 
                onClick={() => {setActiveTab('TEACHERS'); setFilters({...filters, recherche: ''})}}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'TEACHERS' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <div className="flex items-center"><UserSquare2 size={14} className="mr-2"/> Enseignants</div>
              </button>
              <button 
                onClick={() => {setActiveTab('STUDENTS'); setFilters({...filters, recherche: ''})}}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'STUDENTS' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <div className="flex items-center"><GraduationCap size={14} className="mr-2"/> Étudiants</div>
              </button>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
               <h3 className="text-lg font-bold text-slate-800 italic">
                {activeTab === 'CLASSES' && "Gestion des Promotions"}
                {activeTab === 'TEACHERS' && "Corps Enseignant"}
                {activeTab === 'STUDENTS' && "Registre des Étudiants"}
                <span className="ml-2 text-xs text-slate-400 font-bold uppercase tracking-tighter">({currentData.length} entrées)</span>
              </h3>

              <div className="flex flex-wrap gap-3 w-full lg:w-auto justify-end">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" placeholder={`Rechercher ${activeTab === 'CLASSES' ? 'une classe' : 'un nom'}...`}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                    value={filters.recherche}
                    onChange={(e) => setFilters({...filters, recherche: e.target.value})}
                  />
                </div>

                <select 
                  className="py-2.5 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none hover:border-blue-300 transition-colors"
                  value={filters.departement}
                  onChange={(e) => setFilters({...filters, departement: e.target.value})}
                >
                  <option value="Tous">Tous les Fileres</option>
                    <option value="Informatique">Informatique</option>
                    <option value="Mathématiques">Mathématiques</option>
                    <option value="Physique">Physique</option>
                    <option value="Chimie">Chimie</option>
                    <option value="Biologie">Biologie</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* --- TABLEAU DYNAMIQUE --- */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white text-[10px] font-bold text-slate-400 uppercase tracking-[2px] border-b border-slate-50">
              <tr>
                {activeTab === 'CLASSES' && (
                  <>
                    <th className="px-8 py-5">Classe</th>
                    <th className="px-8 py-5">Département / Filière</th>
                    <th className="px-8 py-5 text-center">Effectif</th>
                    <th className="px-8 py-5">Progression EDT</th>
                    <th className="px-8 py-5 text-center">Statut</th>
                  </>
                )}
                {activeTab === 'TEACHERS' && (
                  <>
                    <th className="px-8 py-5">Enseignant</th>
                    <th className="px-8 py-5">Spécialité & Dept</th>
                    <th className="px-8 py-5 text-center">Charge Horaire</th>
                    <th className="px-8 py-5">Disponibilité</th>
                    <th className="px-8 py-5 text-center">Statut</th>
                  </>
                )}
                {activeTab === 'STUDENTS' && (
                  <>
                    <th className="px-8 py-5">Étudiant</th>
                    <th className="px-8 py-5">Identifiants & Filière</th>
                    <th className="px-8 py-5 text-center">Classe Actuelle</th>
                    <th className="px-8 py-5">Présence / Suivi</th>
                    <th className="px-8 py-5 text-center">Statut</th>
                  </>
                )}
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="6" className="py-20 text-center text-slate-400 animate-pulse font-bold italic tracking-widest uppercase">Synchronisation...</td></tr>
              ) : currentData.length === 0 ? (
                <tr><td colSpan="6" className="px-8 py-20 text-center text-slate-300 italic font-medium uppercase tracking-widest">Aucune donnée trouvée</td></tr>
              ) : (
                currentData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-3 text-left">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-[10px] border ${
                          activeTab === 'CLASSES' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          activeTab === 'TEACHERS' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                          'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                          {(item.nom || item.name || 'X').substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-800 text-sm tracking-tight">{item.nom || item.name}</span>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <div className="text-left">
                        {activeTab === 'STUDENTS' ? (
                          <div className="space-y-1.5">
                            <p className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-900 text-white font-black text-[10px] tracking-widest italic shadow-sm">
                              <Hash size={10} className="mr-1 text-blue-400"/> {item.matricule || 'NON ATTRIBUÉ'}
                            </p>
                            <p className="text-[10px] text-blue-600 font-bold italic flex items-center lowercase tracking-normal">
                              <Mail size={11} className="mr-1.5 text-blue-400"/> {item.email || 'non-renseigné@uy1.cm'}
                            </p>
                            <p className="text-[8px] text-slate-400 font-black uppercase tracking-[1px]">{item.dept || item.specialite}</p>
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            <p className="text-slate-400 font-black text-[9px] uppercase tracking-widest leading-none">
                              {activeTab === 'TEACHERS' ? 'Spécialité' : 'Filière'}
                            </p>
                            <p className="text-xs font-black text-slate-800 uppercase tracking-tight leading-tight">
                              {item.dept || item.specialite}
                            </p>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-8 py-6 text-center font-black text-[#1d76f2] italic text-sm">
                      {activeTab === 'CLASSES' ? item.effectif : 
                       activeTab === 'TEACHERS' ? '12h / sem' : 
                       item.niveau}
                    </td>

                    <td className="px-8 py-6 w-56">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className={`h-full transition-all duration-1000 ${
                              activeTab === 'TEACHERS' ? 'bg-purple-500' : 
                              activeTab === 'STUDENTS' ? 'bg-emerald-500' : 'bg-[#1d76f2]'
                            }`} 
                            style={{width: `${item.prog || item.charge || 45}%`}}
                          ></div>
                        </div>
                        <span className="text-[9px] font-black text-slate-300 italic">{item.prog || item.charge || 45}%</span>
                      </div>
                    </td>

                    <td className="px-8 py-6 text-center">
                      <span className={`text-[8px] font-black px-2.5 py-1 rounded-lg uppercase border tracking-widest ${
                        item.statut === 'Actif' || item.statut === 'Complet' || item.statut === 'Inscrit'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                        {item.statut}
                      </span>
                    </td>

                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className={`text-[10px] font-black px-4 py-2 rounded-xl transition-all border border-transparent shadow-sm uppercase tracking-widest ${
                          activeTab === 'CLASSES' ? 'text-[#1d76f2] hover:bg-blue-50' :
                          activeTab === 'TEACHERS' ? 'text-purple-600 hover:bg-purple-50' :
                          'text-emerald-600 hover:bg-emerald-50'
                        }`}>
                          Détails
                        </button>
                        
                        {activeTab === 'STUDENTS' && (
                          <button 
                            onClick={() => handleDeleteClick(item)}
                            className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            title="Supprimer l'étudiant de la BD"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL DE SUPPRESSION (EXISTANTE) --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden border border-red-50 animate-in zoom-in-95 duration-300">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center shadow-inner">
                  <ShieldAlert size={24} />
                </div>
                <button onClick={() => setShowDeleteModal(false)} className="text-slate-300 hover:text-slate-600 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <h2 className="text-xl font-black text-slate-800 leading-tight">Confirmation de Suppression</h2>
              <p className="text-slate-400 text-sm mt-2 font-medium">
                Vous êtes sur le point de retirer <span className="text-red-600 font-bold italic">"{studentToDelete?.nom}"</span> définitivement de la base de données.
              </p>

              <div className="mt-8 space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Identification requise</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      type="password"
                      placeholder="Entrez votre mot de passe admin"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                    />
                  </div>
                </div>

                {deleteError && (
                  <p className="text-[10px] text-red-600 font-bold bg-red-50 p-2 rounded-lg border border-red-100 text-center animate-shake">
                    {deleteError}
                  </p>
                )}
              </div>

              <div className="flex space-x-3 mt-10">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-4 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all"
                >
                  Annuler
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-4 bg-red-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-red-100 hover:bg-red-700 hover:scale-[1.02] transition-all"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- NOUVELLE MODAL DE DÉCONNEXION --- */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300">
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-inner">
                <LogOut size={32} />
              </div>
              
              <h2 className="text-2xl font-black text-slate-800 uppercase italic leading-tight">Déconnexion</h2>
              <p className="text-slate-400 text-sm mt-3 font-medium leading-relaxed">
                Voulez-vous vraiment quitter votre session administrative sécurisée ?
              </p>

              <div className="flex flex-col space-y-3 mt-10">
                <button 
                  onClick={handleConfirmLogout}
                  className="w-full py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-[2px] rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 hover:scale-[1.02] transition-all"
                >
                  Se déconnecter
                </button>
                <button 
                  onClick={() => setShowLogoutModal(false)}
                  className="w-full py-4 text-slate-400 font-black text-xs uppercase tracking-[2px] hover:bg-slate-50 rounded-2xl transition-all"
                >
                  Annuler
                </button>
              </div>
            </div>
            <div className="bg-slate-50 py-3 text-center border-t border-slate-100">
               <p className="text-[7px] text-slate-300 font-black uppercase tracking-[5px]">Session Admin • Fin de session</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-10 p-6 bg-white border border-slate-100 rounded-[24px] text-center">
         <p className="text-[9px] text-slate-300 font-bold uppercase tracking-[4px]">
           Système de Gestion Centralisé • Console de Haute Sécurité v1.0
         </p>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;