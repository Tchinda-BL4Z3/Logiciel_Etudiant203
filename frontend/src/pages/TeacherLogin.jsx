import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoUY1 from '../assets/logo_uy1.png';
import { User, Lock, ArrowLeft, AlertCircle, GraduationCap } from 'lucide-react';
import axios from 'axios';

const TeacherLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
  e.preventDefault();
  setError(''); // Reset de l'erreur

  try {
    const response = await fetch('http://localhost:5000/api/login/teacher', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // CONNEXION RÉUSSIE
      // On stocke les infos de l'enseignant pour sa session
      localStorage.setItem('userRole', 'TEACHER');
      localStorage.setItem('teacherId', data.id);
      localStorage.setItem('teacherName', data.nom);
      localStorage.setItem('teacherEmail', data.email);
      
      navigate('/teacher/dashboard');
    } else {
      // CONNEXION ÉCHOUÉE
      setError(data.error || 'Erreur de connexion');
    }
  } catch (err) {
    setError('Le serveur est hors ligne.');
  }
};

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 md:px-16 py-6 bg-white border-b border-gray-100">
        <Link to="/" className="flex items-center space-x-3">
            <img src={logoUY1} alt="Logo" className="h-10 w-auto" />
            <div className="h-10 w-[1px] bg-gray-200"></div>
            <div className="flex flex-col">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">UY1 - ICT</span>
                <span className="text-xl font-black text-[#1E293B]">EDT Universitaire</span>
            </div>
        </Link>
        <Link to="/login" className="flex items-center text-gray-500 hover:text-cyan-600 font-bold text-sm transition-colors">
          <ArrowLeft size={18} className="mr-2" /> Retour
        </Link>
      </nav>

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[32px] shadow-2xl shadow-cyan-100/50 border border-gray-50 p-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-cyan-500 rounded-2xl flex items-center justify-center text-white mb-4 shadow-xl shadow-cyan-100">
              <User size={32} />
            </div>
            <h1 className="text-2xl font-black text-slate-900">Espace Enseignant</h1>
            <p className="text-gray-400 text-sm mt-2">Connectez-vous pour gérer vos cours et vœux</p>
          </div>

          {error && (
            <div className="mb-6 flex items-center p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100">
              <AlertCircle size={18} className="mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="email" required placeholder="Email institutionnel"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="password" required placeholder="Mot de passe"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="w-full bg-cyan-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-cyan-700 shadow-xl shadow-cyan-100 transition-all active:scale-[0.98] mt-4">
              Se connecter
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default TeacherLogin;