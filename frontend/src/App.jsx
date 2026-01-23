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
import TeacherVoeux from './pages/TeacherVoeux';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherLogin from './pages/TeacherLogin';
import TeacherClasses from './pages/TeacherClasses';
import TeacherResources from './pages/TeacherResources';



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
        <Route path="/teacher/voeux" element={<TeacherVoeux />} />
        <Route path="/admin/voeux" element={<AdminVoeux />} />
        <Route path="/login/teacher" element={<TeacherLogin />} />
        <Route path="/admin/arbitrage" element={<AdminArbitrage />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/classes" element={<TeacherClasses />} />
        <Route path="/teacher/resources" element={<TeacherResources />} />
      </Routes>
    </Router>
  );
}

export default App;