import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard'; 
import RegisterStudent from './pages/RegisterStudent';

import AdminDashboard from './pages/AdminDashboard'; 
import AdminSalles from './pages/AdminSalles';
import AdminTeachers from './pages/AdminTeachers';
import AdminClasses from './pages/AdminClasses';
import AdminVoeux from './pages/AdminVoeux';
import AdminArbitrage from './pages/AdminArbitrage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/register-student" element={<RegisterStudent />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/salles" element={<AdminSalles />} />
        <Route path="/admin/enseignants" element={<AdminTeachers />} />
        <Route path="/admin/classes" element={<AdminClasses />} />
        <Route path="/admin/voeux" element={<AdminVoeux />} />
        <Route path="/admin/arbitrage" element={<AdminArbitrage />} />
      </Routes>
    </Router>
  );
}

export default App;