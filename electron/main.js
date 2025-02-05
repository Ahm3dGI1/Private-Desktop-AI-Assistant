const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

async function createWindow() {
  const isDev = (await import('electron-is-dev')).default; // Dynamically import

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.setMenuBarVisibility(false);

  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../client/build/index.html')}`;

  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => (mainWindow = null));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
