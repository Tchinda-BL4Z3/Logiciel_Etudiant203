const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const isDev = !app.isPackaged;

let serverProcess;

function startBackend() {
  // Lance le serveur Node.js du dossier backend
  // En production, on pointera vers le binaire compilé
  const backendPath = isDev
    ? "node backend/src/server.js"
    : `node ${path.join(process.resourcesPath, 'backend/src/start-server.js')}`;

  serverProcess = exec(backendPath, (error) => {
    if (error) console.error(`Erreur Backend: ${error}`);
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'frontend/public/favicon.ico'),
    webPreferences: {
      nodeIntegration: false,
    },
  });

  // En dev, on charge l'URL de Vite. En prod, on charge le fichier index.html
  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    const indexPath = path.join(__dirname, 'frontend/dist/index.html');
    win.loadFile(indexPath);
  }
}

app.whenReady().then(() => {
  startBackend();
  createWindow();
});

// Quitter le backend quand on ferme le logiciel
app.on('window-all-closed', () => {
  if (serverProcess) serverProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});