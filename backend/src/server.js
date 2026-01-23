const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ============================================================
// --- 1. ROUTES POUR LES SALLES (ADMIN) ---
// ============================================================

// Récupérer toutes les salles
app.get('/api/salles', async (req, res) => {
  try {
    const salles = await prisma.salle.findMany();
    res.json(salles);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la lecture des salles" });
  }
});

// Créer une salle
app.post('/api/salles', async (req, res) => {
  const { nom, capacite, departement, batiment } = req.body;
  try {
    const nouvelleSalle = await prisma.salle.create({
      data: { 
        nom, 
        capacite: parseInt(capacite), 
        departement: departement || "Informatique",
        batiment: batiment || "N/A"
      }
    });
    res.json(nouvelleSalle);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Erreur lors de la création de la salle" });
  }
});

// Modifier une salle
app.put('/api/salles/:id', async (req, res) => {
  const { id } = req.params;
  const { nom, capacite, departement, batiment } = req.body;
  try {
    const salleModifiee = await prisma.salle.update({
      where: { id: parseInt(id) },
      data: { 
        nom, 
        capacite: parseInt(capacite), 
        departement, 
        batiment 
      }
    });
    res.json(salleModifiee);
  } catch (error) {
    res.status(400).json({ error: "Erreur lors de la modification" });
  }
});

// Supprimer une salle
app.delete('/api/salles/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.salle.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Salle supprimée avec succès" });
  } catch (error) {
    res.status(400).json({ error: "Erreur lors de la suppression" });
  }
});

// ============================================================
// --- 2. ROUTES POUR LES CLASSES (ADMIN) ---
// ============================================================

app.get('/api/classes', async (req, res) => {
  try {
    const classes = await prisma.classe.findMany();
    const classesDetaillees = classes.map(c => ({
      ...c,
      statut: 'En cours', 
      prog: 50           
    }));
    res.json(classesDetaillees);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la lecture des classes" });
  }
});

app.post('/api/classes', async (req, res) => {
  const { nom, effectif, departement, filiere } = req.body;
  try {
    const nouvelleClasse = await prisma.classe.create({
      data: {
        nom,
        effectif: parseInt(effectif), 
        departement,
        filiere
      }
    });
    res.json(nouvelleClasse);
  } catch (error) {
    res.status(500).json({ error: "Impossible de créer la classe" });
  }
});

app.put('/api/classes/:id', async (req, res) => {
  const { id } = req.params;
  const { nom, effectif, departement, filiere } = req.body;
  try {
    const updated = await prisma.classe.update({
      where: { id: parseInt(id) },
      data: { nom, effectif: parseInt(effectif), departement, filiere }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Erreur de mise à jour" });
  }
});

app.delete('/api/classes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.classe.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Classe supprimée avec succès" });
  } catch (error) {
    res.status(400).json({ error: "Erreur lors de la suppression de la classe" });
  }
});

// ============================================================
// --- 3. ROUTES POUR LES ENSEIGNANTS (ADMIN & SESSION) ---
// ============================================================

// --- CONNEXION ENSEIGNANT ---
app.post('/api/login/teacher', async (req, res) => {
    const { email, password } = req.body;
    try {
      const teacher = await prisma.user.findFirst({
        where: { email, password, role: 'TEACHER' },
        include: { ue: true }
      });
      if (teacher) {
        const { password, ...teacherData } = teacher;
        res.json(teacherData);
      } else {
        res.status(401).json({ error: "Identifiants incorrects." });
      }
    } catch (error) {
      res.status(500).json({ error: "Erreur de connexion." });
    }
});

// --- LISTE COMPLÈTE (POUR ADMIN) ---
app.get('/api/teachers', async (req, res) => {
    try {
      const teachers = await prisma.user.findMany({
        where: { role: "TEACHER" },
        include: { ue: true, desid: true }
      });
      res.json(teachers);
    } catch (error) {
      res.status(500).json({ error: "Erreur lecture enseignants" });
    }
});

// --- CRÉATION & MISE À JOUR ---
app.post('/api/teachers', async (req, res) => {
  const { nom, email, departement, specialite, ueCode, password } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: {
        nom, email, departement, specialite,
        password: password || "password123",
        role: 'TEACHER',
        ue: ueCode ? { create: { code: ueCode, nom: specialite } } : undefined
      },
      include: { ue: true }
    });
    res.json(newUser);
  } catch (error) {
    res.status(400).json({ error: "L'enseignant ou le code UE existe déjà." });
  }
});

app.put('/api/teachers/:id', async (req, res) => {
  const { id } = req.params;
  const { nom, email, departement, specialite, ueCode, password } = req.body;
  try {
    const teacherId = parseInt(id);
    await prisma.$transaction(async (tx) => {
      const updateData = { nom, email, departement, specialite };
      if (password) updateData.password = password; 
      await tx.user.update({ where: { id: teacherId }, data: updateData });

      if (ueCode) {
        await tx.uE.deleteMany({ where: { enseignantId: teacherId } });
        await tx.uE.create({
          data: { code: ueCode, nom: specialite, enseignantId: teacherId }
        });
      }
    });
    res.json({ message: "Mis à jour avec succès" });
  } catch (error) {
    res.status(500).json({ error: "Erreur mise à jour" });
  }
});

app.delete('/api/teachers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.$transaction([
      prisma.uE.deleteMany({ where: { enseignantId: parseInt(id) } }),
      prisma.user.delete({ where: { id: parseInt(id) } })
    ]);
    res.json({ message: "Supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: "Erreur suppression" });
  }
});

// ============================================================
// --- 4. ROUTES POUR LES VOEUX & UEs (SESSION ENSEIGNANT) ---
// ============================================================

// Récupérer les UEs d'un enseignant spécifique (POUR LE SELECT)
app.get('/api/teachers/:id/ues', async (req, res) => {
    const { id } = req.params;
    try {
      const ues = await prisma.uE.findMany({
        where: { enseignantId: parseInt(id) }
      });
      res.json(ues);
    } catch (error) {
      res.status(500).json({ error: "Erreur lecture UEs" });
    }
});

// Récupérer les vœux existants (GET) - RÉSOUT LE 404
app.get('/api/teachers/:id/voeux', async (req, res) => {
    const { id } = req.params;
    try {
      const voeux = await prisma.desiderata.findMany({
        where: { enseignantId: parseInt(id) }
      });
      res.json(voeux);
    } catch (error) {
      res.status(500).json({ error: "Erreur lecture vœux" });
    }
});

// Enregistrer les vœux (POST)
app.post('/api/teachers/:id/voeux', async (req, res) => {
    const { id } = req.params;
    const { voeux } = req.body; 
    try {
        const teacherId = parseInt(id);
        await prisma.$transaction([
            prisma.desiderata.deleteMany({ where: { enseignantId: teacherId } }),
            prisma.desiderata.createMany({
                data: voeux.map(v => ({
                    enseignantId: teacherId,
                    jour: v.jour,
                    plageHoraire: v.plageHoraire
                }))
            })
        ]);
        res.json({ message: "Vœux enregistrés !" });
    } catch (error) {
        res.status(500).json({ error: "Erreur enregistrement vœux" });
    }
});

// Données consolidées pour le Dashboard Enseignant
app.get('/api/teachers/:id/dashboard', async (req, res) => {
    const { id } = req.params;
    try {
      const teacherId = parseInt(id);
      const sessions = await prisma.session.findMany({
        where: { ue: { enseignantId: teacherId } },
        include: { ue: true, salle: true, classe: true },
        orderBy: { date: 'asc' }
      });
      const desideratas = await prisma.desiderata.findMany({
        where: { enseignantId: teacherId }
      });
      res.json({ sessions, desideratas });
    } catch (error) {
      res.status(500).json({ error: "Erreur dashboard" });
    }
});

// ============================================================
// --- 5. ROUTES STATISTIQUES (DASHBOARD ADMIN) ---
// ============================================================

app.get('/api/stats', async (req, res) => {
  try {
    const countSalles = await prisma.salle.count();
    const countTeachers = await prisma.user.count({ where: { role: 'TEACHER' } });
    const countClasses = await prisma.classe.count();
    const sommeSalles = await prisma.salle.aggregate({ _sum: { capacite: true } });
    const countVoeux = await prisma.desiderata.count();

    res.json({ 
      countSalles, 
      countTeachers, 
      countClasses, 
      capaciteTotale: sommeSalles._sum.capacite || 0,
      countVoeux 
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur statistiques" });
  }
});

// Lancement
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`-----------------------------------------`);
  console.log(`Serveur EDT lancé sur http://localhost:${PORT}`);
  console.log(`-----------------------------------------`);
});