const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

// ============================================================
// --- INITIALISATION ---
// ============================================================
const app = express();
const prisma = new PrismaClient();

// Configuration des Middlewares
app.use(cors());
app.use(express.json());

// 1. On définit le chemin du dossier uploads
const uploadsPath = path.join(__dirname, '../uploads');

// 2. On vérifie (et crée si besoin) le dossier pour éviter les erreurs 404
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
    console.log("Dossier 'uploads' créé !");
}

// 3. Configuration de l'accès statique avec CORS et Force Download
app.use('/uploads', cors(), express.static(uploadsPath, {
    setHeaders: (res, path) => {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Content-Disposition', 'attachment'); 
        res.set('Access-Control-Expose-Headers', 'Content-Disposition');
    }
}));

// ============================================================
// --- 1. AUTHENTIFICATION (VERSION ROBUSTE) ---
// ============================================================

app.post('/api/login/teacher', async (req, res) => {
    const { email, password } = req.body;
    console.log("Tentative de connexion :", { email, password });

    try {
      const teacher = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() }
      });

      if (teacher && teacher.password === password && teacher.role === 'TEACHER') {
        const { password: _, ...teacherData } = teacher;
        console.log(`✅ Connexion réussie pour : ${teacher.nom}`);
        res.json(teacherData);
      } else {
        res.status(401).json({ error: "Email ou mot de passe incorrect." });
      }
    } catch (error) {
      res.status(500).json({ error: "Erreur technique lors de la connexion." });
    }
});

// ============================================================
// --- 2. GESTION DES SALLES ---
// ============================================================

app.get('/api/salles', async (req, res) => {
  try {
    const salles = await prisma.salle.findMany({ orderBy: { nom: 'asc' } });
    res.json(salles);
  } catch (error) {
    res.status(500).json({ error: "Erreur lecture salles" });
  }
});

app.post('/api/salles', async (req, res) => {
  const { nom, capacite, batiment, departement } = req.body;
  try {
    const nouvelleSalle = await prisma.salle.create({
      data: { 
        nom, 
        capacite: parseInt(capacite), 
        batiment,
        departement 
      }
    });
    res.json(nouvelleSalle);
  } catch (error) {
    res.status(400).json({ error: "Erreur lors de la création." });
  }
});

app.put('/api/salles/:id', async (req, res) => {
  const { id } = req.params;
  const { nom, capacite, batiment, departement } = req.body;

  try {
    const updatedSalle = await prisma.salle.update({
      where: { id: parseInt(id) },
      data: {
        nom: nom,
        capacite: parseInt(capacite),
        batiment: batiment,
        departement: departement 
      }
    });
    res.json(updatedSalle);
  } catch (error) {
    console.error("Erreur mise à jour salle:", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour." });
  }
});

app.delete('/api/salles/:id', async (req, res) => {
  try {
    await prisma.salle.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Salle supprimée" });
  } catch (error) {
    res.status(400).json({ error: "Impossible de supprimer : salle liée à des cours." });
  }
});

// ============================================================
// --- 3. GESTION DES CLASSES ---
// ============================================================

app.get('/api/classes', async (req, res) => {
  try {
    const classes = await prisma.classe.findMany({ orderBy: { nom: 'asc' } });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: "Erreur lecture classes" });
  }
});

app.post('/api/classes', async (req, res) => {
  const { nom, effectif, filiere, departement } = req.body;
  try {
    const nouvelleClasse = await prisma.classe.create({
      data: { 
        nom, 
        effectif: parseInt(effectif), 
        filiere,
        departement: departement || "Informatique" 
      }
    });
    res.json(nouvelleClasse);
  } catch (error) {
    res.status(400).json({ error: "Erreur : Le code de classe doit être unique." });
  }
});

app.put('/api/classes/:id', async (req, res) => {
  const { id } = req.params;
  const { nom, effectif, filiere, departement } = req.body;
  try {
    const updated = await prisma.classe.update({
      where: { id: parseInt(id) },
      data: { nom, effectif: parseInt(effectif), filiere, departement }
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: "Erreur mise à jour classe." });
  }
});

app.delete('/api/classes/:id', async (req, res) => {
  try {
    await prisma.classe.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Classe supprimée" });
  } catch (error) {
    res.status(400).json({ error: "Erreur suppression classe" });
  }
});

// ============================================================
// --- 4. GESTION DES ETUDIANTS (INSCRIPTION ET CONNEXION) ---
// ============================================================

// Route d'inscription principale (utilisée par RegisterStudent)
app.post('/api/register-student', async (req, res) => {
  const { nom, email, matricule, classeId, password, filiere } = req.body;

  try {
    const newUser = await prisma.user.create({
      data: {
        nom,
        email: email.toLowerCase().trim(),
        matricule: matricule, // CORRECTION : Était manquant dans la version précédente
        password, 
        role: 'STUDENT',
        filiere: filiere,
        classeId: parseInt(classeId)
      },
      include: { classe: true } 
    });

    const { password: _, ...studentData } = newUser;
    res.status(201).json(studentData);
  } catch (error) {
    console.error("Erreur inscription étudiant:", error);
    res.status(400).json({ error: "L'email ou le matricule existe déjà." });
  }
});

// Route alternative (si utilisée par d'autres formulaires)
app.post('/api/auth/register', async (req, res) => {
  const { nom, email, password, matricule, filiere, classeId } = req.body;

  try {
    const newUser = await prisma.user.create({
      data: {
        nom,
        email: email.toLowerCase().trim(),
        password,
        role: 'STUDENT',
        matricule, 
        filiere,   
        classeId: parseInt(classeId)
      },
    });
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'inscription" });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { classe: true } 
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect." });
    }

    const { password: _, ...userData } = user;
    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur lors de la connexion." });
  }
});

// ============================================================
// --- 5. DASHBOARDS ET PROFILS ÉTUDIANTS ---
// ============================================================

app.get('/api/students/:id/dashboard', async (req, res) => {
  const { id } = req.params;

  try {
    const student = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: { 
        id: true,
        nom: true,
        matricule: true,
        classeId: true,
        classe: true 
      }
    });

    if (!student || !student.classeId) {
      return res.status(404).json({ 
        error: "Profil ou classe introuvable. Contactez l'administration." 
      });
    }

    const daysOrder = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    const jsDayToName = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const now = new Date();
    const todayName = jsDayToName[now.getDay()];
    const currentTime = now.getHours().toString().padStart(2, '0') + ":" + 
                        now.getMinutes().toString().padStart(2, '0');

    const allSessions = await prisma.session.findMany({
      where: { classeId: student.classeId },
      include: {
        ue: { include: { enseignant: true } },
        salle: true
      }
    });

    let nextSession = null;
    const startIndex = daysOrder.indexOf(todayName);
    const rollingDays = [...daysOrder.slice(startIndex), ...daysOrder.slice(0, startIndex)];

    for (const day of rollingDays) {
      let sessionsOfDay = allSessions.filter(s => s.jour === day);
      sessionsOfDay.sort((a, b) => a.plageHoraire.localeCompare(b.plageHoraire));

      if (day === todayName) {
        nextSession = sessionsOfDay.find(s => s.plageHoraire.split(' - ')[0] > currentTime);
      } else {
        nextSession = sessionsOfDay[0];
      }
      if (nextSession) break;
    }

    const uniqueUEs = Array.from(
      new Map(allSessions.map(s => [s.ue.id, s.ue])).values()
    );

    let recentResources = [];
    try {
      const classUeIds = uniqueUEs.map(ue => ue.id);
      if (classUeIds.length > 0) {
        recentResources = await prisma.resource.findMany({
          where: { ueId: { in: classUeIds } },
          take: 8,
          orderBy: { id: 'desc' },
          include: { ue: true }
        });
      }
    } catch (resourceError) {
      console.error("Erreur ressources dashboard:", resourceError);
    }

    res.json({
      studentInfo: {
        id: student.id,
        nom: student.nom,
        matricule: student.matricule,
        classe: student.classe?.nom || "Non définie"
      },
      nextSession,
      recentResources,
      classCourses: uniqueUEs
    });

  } catch (error) {
    console.error("--- ERREUR SERVEUR DASHBOARD ---", error);
    res.status(500).json({ error: "Erreur lors de la génération du dashboard." });
  }
});

app.get('/api/students/profile/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const student = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: { classe: true }
    });

    if (!student) return res.status(404).json({ error: "Étudiant non trouvé" });

    const classmates = await prisma.user.findMany({
      where: {
        classeId: student.classeId,
        id: { not: student.id },
        role: 'STUDENT'
      },
      select: { id: true, nom: true, email: true, matricule: true }
    });

    res.json({ student, classmates });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur profil" });
  }
});

// 1. Récupérer les infos complètes d'un étudiant
app.get('/api/students/:id/profile', async (req, res) => {
  const { id } = req.params;
  try {
    const student = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: { classe: true } // Très important pour afficher le nom de la classe
    });
    
    if (!student) return res.status(404).json({ error: "Étudiant introuvable" });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur lors de la récupération du profil" });
  }
});

// 2. Récupérer les camarades de la même classe
app.get('/api/students/:id/classmates', async (req, res) => {
  const { id } = req.params;
  try {
    // On cherche d'abord quelle est la classe de cet étudiant
    const student = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: { classeId: true }
    });

    if (!student || !student.classeId) {
      return res.json([]); // Pas de classe = 0 camarades
    }

    // On cherche tous les autres étudiants de cette classe
    const classmates = await prisma.user.findMany({
      where: {
        classeId: student.classeId,
        id: { not: parseInt(id) }, // Exclure l'étudiant lui-même
        role: 'STUDENT'
      }
    });
    res.json(classmates);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des camarades" });
  }
});

app.get('/api/students', async (req, res) => {
  try {
    const students = await prisma.user.findMany({ 
      where: { role: 'STUDENT' },
      include: { classe: true } 
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Erreur lecture liste étudiants" });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Utilisateur supprimé définitivement" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
});


// ============================================================
// --- 6. GESTION DES RESSOURCES ET FICHIERS ---
// ============================================================

app.get('/api/students/:id/resources', async (req, res) => {
  const { id } = req.params;

  try {
    const student = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: { classeId: true }
    });

    if (!student || !student.classeId) return res.json([]);

    const sessions = await prisma.session.findMany({
      where: { classeId: student.classeId },
      select: { ueId: true }
    });

    const ueIds = [...new Set(sessions.map(s => s.ueId))];
    if (ueIds.length === 0) return res.json([]);

    const resources = await prisma.resource.findMany({ 
      where: { ueId: { in: ueIds } },
      include: { ue: true, teacher: true },
      orderBy: { date: 'desc' }
    });

    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: "Erreur chargement fichiers." });
  }
});

// ============================================================
// --- 7. GESTION DES ENSEIGNANTS ---
// ============================================================

app.get('/api/teachers/:id/dashboard', async (req, res) => {
  const teacherId = parseInt(req.params.id);
  
  try {
    const teacherUEs = await prisma.uE.findMany({
      where: { enseignantId: teacherId },
      include: { 
        sessions: { 
          include: { salle: true, classe: true, ue: true } 
        } 
      }
    });

    let allSessions = [];
    teacherUEs.forEach(ue => { 
      allSessions = [...allSessions, ...ue.sessions]; 
    });

    const classesMap = new Map();
    allSessions.forEach(s => {
      if (s.classe && !classesMap.has(s.classe.id)) {
        classesMap.set(s.classe.id, s.classe);
      }
    });
    const uniqueClasses = Array.from(classesMap.values());

    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const shortDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const weeklyStats = shortDays.map((d, index) => {
      const count = allSessions.filter(s => s.jour === days[index]).length;
      return { name: d, heures: count * 2 };
    });

    const wishesCount = await prisma.desiderata.count({ where: { enseignantId: teacherId } });
    const desidProgress = teacherUEs.length > 0 
      ? Math.min(100, Math.round((wishesCount / (teacherUEs.length * 2)) * 100)) 
      : 0;

    res.json({
      nextSession: allSessions.length > 0 ? allSessions[0] : null,
      weeklyStats,
      upcomingSessions: allSessions.slice(0, 5),
      classes: uniqueClasses, 
      desidProgress,
      totalHours: weeklyStats.reduce((acc, curr) => acc + curr.heures, 0),
      wishesCount
    });

  } catch (error) {
    res.status(500).json({ error: "Erreur dashboard enseignant" });
  }
});

app.get('/api/teachers', async (req, res) => {
  const teachers = await prisma.user.findMany({ where: { role: 'TEACHER' } });
  res.json(teachers);
});

app.post('/api/teachers', async (req, res) => {
  const { nom, email, departement, specialite, ueCode, password } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: {
        nom, email: email.toLowerCase().trim(), departement, specialite,
        password: password || "password123",
        role: 'TEACHER',
        ue: ueCode ? { create: { code: ueCode, nom: specialite || ueCode } } : undefined
      }
    });
    res.json(newUser);
  } catch (error) {
    res.status(400).json({ error: "L'email ou le code UE existe déjà." });
  }
});

app.put('/api/teachers/:id', async (req, res) => {
  const { id } = req.params;
  const { nom, email, departement, specialite, password } = req.body;
  try {
    const updated = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { 
        nom, 
        email: email.toLowerCase().trim(), 
        departement, 
        specialite,
        password: password
      }
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: "Email déjà utilisé ou ID invalide." });
  }
});

app.delete('/api/teachers/:id', async (req, res) => {
  const teacherId = parseInt(req.params.id);
  try {
    await prisma.$transaction(async (tx) => {
      const ues = await tx.uE.findMany({ where: { enseignantId: teacherId }, select: { id: true } });
      const ueIds = ues.map(u => u.id);
      if (ueIds.length > 0) await tx.session.deleteMany({ where: { ueId: { in: ueIds } } });
      await tx.uE.deleteMany({ where: { enseignantId: teacherId } });
      await tx.desiderata.deleteMany({ where: { enseignantId: teacherId } });
      await tx.user.delete({ where: { id: teacherId } });
    });
    res.json({ message: "Suppression réussie." });
  } catch (error) {
    res.status(500).json({ error: "Erreur suppression" });
  }
});

// ============================================================
// --- 8. PROGRAMMATION SÉANCES ---
// ============================================================

app.get('/api/teachers/:id/ues', async (req, res) => {
  try {
    const ues = await prisma.uE.findMany({ where: { enseignantId: parseInt(req.params.id) } });
    res.json(ues);
  } catch (error) { res.status(500).json({ error: "Erreur lecture UEs" }); }
});

app.post('/api/sessions', async (req, res) => {
  const { ueId, classeId, salleId, jour, plageHoraire, date } = req.body;
  try {
    const classe = await prisma.classe.findUnique({ where: { id: parseInt(classeId) } });
    const salle = await prisma.salle.findUnique({ where: { id: parseInt(salleId) } });

    if (classe.effectif > salle.capacite) {
      return res.status(400).json({ error: `Salle trop petite (${salle.capacite} pl.)` });
    }

    const collision = await prisma.session.findFirst({
      where: { salleId: parseInt(salleId), jour, plageHoraire }
    });

    if (collision) return res.status(400).json({ error: "Salle déjà occupée !" });

    const newSession = await prisma.session.create({
      data: {
        ueId: parseInt(ueId), classeId: parseInt(classeId), salleId: parseInt(salleId),
        jour, plageHoraire, date: new Date(date), anneeAcad: "2025/2026"
      }
    });
    res.json(newSession);
  } catch (error) { res.status(500).json({ error: "Erreur programmation" }); }
});

app.get('/api/teachers/:id/sessions', async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      where: { ue: { enseignantId: parseInt(req.params.id) } },
      include: { ue: true, classe: true, salle: true },
      orderBy: { date: 'desc' }
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: "Erreur chargement séances" });
  }
});

app.get('/api/teachers/:id/form-data', async (req, res) => {
    try {
        const [ues, salles, classes] = await Promise.all([
            prisma.uE.findMany({ where: { enseignantId: parseInt(req.params.id) } }),
            prisma.salle.findMany(),
            prisma.classe.findMany()
        ]);
        res.json({ ues, salles, classes });
    } catch (error) {
        res.status(500).json({ error: "Erreur chargement formulaire" });
    }
});

app.delete('/api/sessions/:id', async (req, res) => {
  try {
    await prisma.session.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Séance supprimée" });
  } catch (error) {
    res.status(500).json({ error: "Erreur suppression séance" });
  }
});

app.put('/api/sessions/:id', async (req, res) => {
  const { id } = req.params;
  const { ueId, salleId, classeId, jour, plageHoraire, date } = req.body;
  try {
    const collision = await prisma.session.findFirst({
      where: { salleId: parseInt(salleId), jour, plageHoraire, NOT: { id: parseInt(id) } }
    });
    if (collision) return res.status(400).json({ error: "Salle déjà occupée." });

    const updated = await prisma.session.update({
      where: { id: parseInt(id) },
      data: { ueId: parseInt(ueId), classeId: parseInt(classeId), salleId: parseInt(salleId), jour, plageHoraire, date: new Date(date) }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Erreur mise à jour séance." });
  }
});

// ============================================================  
// --- 9. GESTION DES VOEUX (DESIDERATA) --- ARBITRAGE
// ============================================================

app.get('/api/teachers/:id/desiderata', async (req, res) => {
  try {
    const desiderata = await prisma.desiderata.findMany({
      where: { enseignantId: parseInt(req.params.id) },
      include: { ue: true }
    });
    res.json(desiderata);
  } catch (error) { res.status(500).json({ error: "Erreur vœux" }); }
});

app.get('/api/desiderata', async (req, res) => {
  try {
    const list = await prisma.desiderata.findMany({
      include: {
        enseignant: { select: { nom: true } }, // On ne prend que le nom
        ue: { select: { code: true } }         // On récupère le code de l'UE liée
      }
    });

    const formatted = list.map(d => ({
      id: d.id,
      enseignant: { nom: d.enseignant.nom },
      ue_code: d.ue ? d.ue.code : "N/A", // Si ueId est null, on affiche N/A
      jour: d.jour,
      plageHoraire: d.plageHoraire,
      status: d.status,
      notice: d.notice,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Route pour modifier le statut d'un vœu (Arbitrage)
app.patch('/api/desiderata/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updated = await prisma.desiderata.update({
      where: { id: parseInt(id) },
      data: { status: status } 
    });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la mise à jour du statut" });
  }
});

app.post('/api/desiderata', async (req, res) => {
  // 1. Ajoutez 'notice' dans la liste des champs reçus
  const { teacherId, ueId, jour, plageHoraire, notice } = req.body; 

  try {
    const newVoeu = await prisma.desiderata.create({
      data: {
        enseignantId: parseInt(teacherId),
        ueId: parseInt(ueId),
        jour,
        plageHoraire,
        notice
      }
    });
    res.json(newVoeu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/desiderata/:id', async (req, res) => {
  try {
    await prisma.desiderata.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Vœu supprimé" });
  } catch (error) { res.status(500).json({ error: "Erreur suppression" }); }
});

app.get('/api/conflicts', async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      include: { ue: { include: { enseignant: true } }, salle: true, classe: true }
    });

    let detectedConflicts = [];

    // Logique simple : On cherche si deux sessions ont la même salle, même jour, même heure
    for (let i = 0; i < sessions.length; i++) {
      for (let j = i + 1; j < sessions.length; j++) {
        if (
          sessions[i].jour === sessions[j].jour &&
          sessions[i].plageHoraire === sessions[j].plageHoraire &&
          sessions[i].salleId === sessions[j].salleId
        ) {
          detectedConflicts.push({
            id: `conf-${i}-${j}`,
            type: 'Collision de Salle',
            severity: 'HAUTE',
            details: `${sessions[i].salle.nom} occupé par ${sessions[i].classe.nom} et ${sessions[j].classe.nom}`,
            time: `${sessions[i].jour} ${sessions[i].plageHoraire}`
          });
        }
      }
    }
    res.json(detectedConflicts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/sessions', async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      include: {
        ue: { include: { enseignant: true } },
        classe: true,
        salle: true
      },
      orderBy: { id: 'desc' }
    });

    // On transforme les données pour le Frontend
    const formatted = sessions.map(s => ({
      id: s.id,
      filiere: s.classe.filiere,
      ueCode: s.ue.code,
      ueName: s.ue.nom,
      profName: s.ue.enseignant.nom, 
      classeName: s.classe.nom,
      effectif: s.classe.effectif, 
      jour: s.jour,
      plageHoraire: s.plageHoraire,
      salleName: s.salle.nom,
      salleCapacite: s.salle.capacite
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des sessions" });
  }
});


// ============================================================ 
// --- 10. UPLOAD ET FICHIERS ---
// ============================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.post('/api/resources/upload', upload.single('file'), async (req, res) => {
  try {
    const { nom, ueId, teacherId, categorie } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ error: "Aucun fichier" });

    const resource = await prisma.resource.create({
      data: {
        nom, categorie: categorie || "Cours",
        type: file.mimetype.split('/')[1].toUpperCase(),
        url: `uploads/${file.filename}`,
        taille: (file.size / 1024).toFixed(2) + " KB",
        teacherId: parseInt(teacherId),
        ueId: parseInt(ueId)
      }
    });
    res.status(201).json(resource);
  } catch (error) { res.status(500).json({ error: "Erreur upload" }); }
});

app.get('/api/teachers/:id/resources', async (req, res) => {
  try {
    const resources = await prisma.resource.findMany({
      where: { teacherId: parseInt(req.params.id) },
      include: { ue: true },
      orderBy: { date: 'desc' }
    });
    res.json(resources);
  } catch (error) { res.status(500).json({ error: "Erreur lecture" }); }
});

app.delete('/api/resources/:id', async (req, res) => {
  try {
    await prisma.resource.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Fichier supprimé" });
  } catch (error) { res.status(500).json({ error: "Erreur suppression" }); }
});

// ============================================================
// --- 11. PLANNINGS ET STATS GLOBALES ---
// ============================================================

app.get('/api/classes/:id/sessions', async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      where: { classeId: parseInt(req.params.id) },
      include: { ue: { include: { enseignant: true } }, salle: true }
    });
    res.json(sessions);
  } catch (error) { res.status(500).json({ error: "Erreur planning" }); }
});

app.get('/api/stats', async (req, res) => {
  try {
    const [countSalles, countTeachers, countClasses, countVoeux, sumCap, countStudents] = await Promise.all([
      prisma.salle.count(),
      prisma.user.count({ where: { role: 'TEACHER' } }),
      prisma.classe.count(),
      prisma.desiderata.count(),
      prisma.salle.aggregate({ _sum: { capacite: true } }),
      prisma.user.count({ where: { role: 'STUDENT' } })
    ]);

    res.json({ 
      countSalles, countTeachers, countClasses, countVoeux, countStudents,
      capaciteTotale: sumCap._sum.capacite || 0
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur statistiques" });
  }
});

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`   SERVEUR EDT UNIVERSITAIRE OPÉRATIONNEL`);
  console.log(`   PORT : ${PORT}`);
  console.log(`=========================================`);
});