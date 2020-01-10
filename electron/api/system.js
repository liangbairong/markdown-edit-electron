const { ipcMain, dialog } = require('electron')
module.exports = class System {
  constructor(mainWindow) {
    // 最小化
    ipcMain.on('min', async (sys, query) => {
      mainWindow.minimize();
    })

    // 最大化
    ipcMain.on('max', async (sys, query) => {
      if (mainWindow.isMaximized()) {
        mainWindow.restore();
      } else {
        mainWindow.maximize();
      }
    })
    // 关闭
    ipcMain.on('close', async (sys, query) => {
      mainWindow.close();
    })

    // 选择文件夹
    ipcMain.on('get_folder', async (sys, query) => {
      dialog.showOpenDialog({
        properties: ['openDirectory']
      }).then(result => {
        mainWindow.webContents.send('get_folder', {
          code: 200,
          data: result
        })
      })

    })
  }
}








