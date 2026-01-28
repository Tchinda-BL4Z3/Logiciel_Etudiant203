#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

// Configuration pour l'environnement packagé
if (process.resourcesPath) {
    // Base de données dans le dossier resources/backend/prisma
    process.env.DATABASE_URL = `file:${path.join(process.resourcesPath, 'backend/prisma/dev.db')}`;

    // Chemin des modules du backend (asar est désactivé, donc directement dans resources)
    const backendModulesPath = path.join(process.resourcesPath, 'backend/node_modules');

    console.log('Looking for backend modules at:', backendModulesPath);
    console.log('Exists:', fs.existsSync(backendModulesPath));

    if (fs.existsSync(backendModulesPath)) {
        // Ajouter au début de module.paths pour priorité
        module.paths.unshift(backendModulesPath);
        process.env.NODE_PATH = backendModulesPath;
        console.log('Backend modules path configured:', backendModulesPath);
    } else {
        console.error('ERROR: Backend node_modules not found at:', backendModulesPath);
        console.log('Contents of resources:', fs.readdirSync(process.resourcesPath));
        if (fs.existsSync(path.join(process.resourcesPath, 'backend'))) {
            console.log('Contents of backend:', fs.readdirSync(path.join(process.resourcesPath, 'backend')));
        }
    }
}

// Lancer le serveur backend
require(path.join(__dirname, 'server.js'));
