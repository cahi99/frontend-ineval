const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 750,
    webPreferences: {
        
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

    win.loadURL(`file://${path.join(__dirname, 'frontend', 'dist', 'index.html')}`)
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
