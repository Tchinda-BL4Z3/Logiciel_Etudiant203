---

# 🎓 EDT-Universitaire - Système de Gestion d'Emploi du Temps
### Projet Académique ICT 203 | Année 2025/2026 | Université de Yaoundé I (UY1)

**EDT-Universitaire** est une solution logicielle de pointe conçue pour moderniser la planification académique au sein de l'UY1. Elle répond aux problématiques complexes de gestion des ressources (salles/enseignants) tout en offrant une interface utilisateur fluide et intuitive pour l'ensemble de la communauté universitaire.

---

## 🌟 Fonctionnalités du Système

### 1. 🛡️ Console d'Administration (Super-Admin)
*   **Tableau de Bord Holistique :** Vue d'ensemble sur l'occupation des salles, le nombre d'étudiants et les vœux en attente.
*   **Gestion des Ressources (CRUD) :**
    *   **Salles :** Définition des capacités fixes pour respecter les effectifs de classe.
    *   **Classes :** Gestion des effectifs par semestre pour une programmation optimale.
    *   **Enseignants & UE :** Attribution des Unités d'Enseignement aux professeurs.
*   **Module d'Arbitrage :** Résolution des conflits horaires en consultant les vœux et les **notices de justification** des enseignants.
*   **Alerte de Complétude :** Notification automatique dès que l'emploi du temps d'une classe (ex: ICT-L2) est entièrement programmé.

### 2. 👨‍🏫 Espace Enseignant (Désidératas)
*   **Saisie des Vœux :** Interface dédiée pour choisir les plages horaires préférentielles.
*   **Notice d'Arbitrage :** Possibilité d'ajouter des notes ou justifications détaillées pour expliquer une contrainte horaire à l'administrateur.
*   **Suivi en Temps Réel :** Consultation de son propre emploi du temps dès sa validation.

### 3. 🎓 Portail Étudiant
*   **Inscription Autonome :** Formulaire de création de compte incluant Nom, Email institutionnel, Matricule et choix de la Filière.
*   **Consultation Dynamique :** Affichage de la grille d'emploi du temps filtrée par classe avec tous les détails requis (UE, Prof, Salle, Date).

### 4. ℹ️ Pages d'Information & Support
*   **À Propos :** Présentation détaillée des fonctionnalités, du contexte technologique et des objectifs pédagogiques.
*   **Contact :** Présentation détaillée des 6 développeurs du groupe (Noms, Rôles, Matricules) avec liens de contact.

---

## 🛠️ Stack Technologique (Architecture Pro)

*   **Frontend :** 
    *   React.js 18+ (Vite)
    *   Tailwind CSS v4 (Design Système Moderne)
    *   Lucide React (Bibliothèque d'icônes vectorielles)
    *   React Router Dom (Navigation SPA)
*   **Backend :**
    *   Node.js & Express.js (Serveur API REST)
    *   Prisma ORM (Gestion de la couche de données)
*   **Base de Données :**
    *   SQLite (Base de données relationnelle portable intégrée au projet)
*   **Lancement & Build :**
    *   Concurrently (Exécution simultanée)
    *   Electron (Pour la transformation en exécutable de bureau)

---

## 📂 Structure du Projet (Monorepo)

```text
Logiciel_Etudiants_203/
├── frontend/                # Application Client (React)
│   ├── src/
│   │   ├── assets/          # Logos et images (Logo UY1)
│   │   ├── components/      # Layouts, Sidebar, Grilles, Modals
│   │   └── pages/           # Home, Login, Admin, Teachers, Student, About, Contact
│   └── vite.config.js       # Configuration de build et Tailwind v4
├── backend/                 # API REST (Node.js)
│   ├── prisma/
│   │   ├── schema.prisma    # Modèle de données (Salles, Users, Sessions, Voeux)
│   │   ├── dev.db           # Base de données SQLite portable
│   │   └── seed.js          # Script de peuplement (Données démo ICT-L2)
│   └── server.js            # Routes et logique métier
├── start.bat                # Lanceur automatique pour Windows
├── start.sh                 # Lanceur automatique pour Linux/Mac
├── main.js                  # Fichier d'entrée Electron (Desktop App)
└── package.json             # Scripts de gestion globale
```

---

## ⚙️ Installation & Configuration

### 1. Pré-requis
Assurez-vous d'avoir **Node.js (v18+)** installé sur votre machine.

### 2. Installation Automatisée
Ouvrez un terminal à la racine du projet et exécutez :
```bash
# Installation de tous les modules (Racine, Backend, Frontend)
npm install && cd backend && npm install && cd ../frontend && npm install && cd ..

# Initialisation de la base de données
cd backend
npx prisma db push
npx prisma db seed
cd ..
```

---

## 🚀 Lancement du Logiciel

### Mode Développement (Web)
Pour lancer le serveur et l'interface simultanément avec ouverture automatique du navigateur :
```bash
npm run dev
```

### Exécution via Scripts (Recommandé pour les tests)
*   **Sur Windows :** Double-cliquez sur `start.bat`
*   **Sur Linux :** 
    ```bash
    chmod +x start.sh
    ./start.sh
    ```

### Mode Bureau (Electron)
Pour lancer l'application en tant que logiciel de bureau indépendant :
```bash
npm run electron:dev
```

---

## 🔑 Identifiants de Test

| Profil | Nom d'utilisateur | Mot de passe |
| :--- | :--- | :--- |
| **Administrateur** | `admin` | `admin` |
| **Enseignant** | *(Variable selon les données créées)* | *Défini par l'admin* |
| **Étudiant** | *Via inscription* | *Défini par l'étudiant* |

---

## 📦 Création de l'Exécutable (.exe / .sh)

Pour générer un fichier exécutable portable pour la remise du projet :
```bash
npm run electron:build
```
Le fichier généré se trouvera dans le dossier `dist_electron/`.

---

## 👨‍💻 Équipe de Développement (Groupe 6)
Ce projet est le résultat du travail collaboratif de 6 étudiants passionnés de l'UE ICT 203 :
1. **[Nom du Chef]** - Chef de Projet & Backend
2. **[Nom Dev 2]** - Architecte DB & API
3. **[Nom Dev 3]** - UI/UX Designer & Frontend
4. **[Nom Dev 4]** - Développeur Frontend
5. **[Nom Dev 5]** - Intégration & Sécurité
6. **[Nom Dev 6]** - Documentation & Tests

---

## 📝 Licence
Réalisé sous licence académique pour l'Université de Yaoundé I. Toute reproduction doit mentionner les auteurs du Groupe 6.

---
### 💡 Note Spéciale
Conformément au **TAF 3** du cahier de charge, le projet inclut un jeu de données complet pour la classe **ICT-L2 (Semestre 1, 2025/2026)** démontrant le respect des contraintes de capacité et de temps.
