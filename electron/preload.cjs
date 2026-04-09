const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // Add any IPC methods here if needed
  // Example: sendNotification: (msg) => ipcRenderer.send('notify', msg)
});
