

const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
var child_process = require('child_process');
var exec = child_process.exec;
const api = require('./api/index.js')
let mainWindow
function createWindow() {
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      javascript: true,
      plugins: true,
      nodeIntegration: true, // 是否集成 Nodejs
      webSecurity: false,
      preload: path.join(__dirname, './renderer.js')
    }
  })

  if(process.env.NODE_ENV === 'development'){
    mainWindow.loadURL(`http://localhost:8082`)
  }else{
    mainWindow.loadFile('./client/index.html')
  }
 
  mainWindow.on('closed', () => {
    mainWindow = null
  })


  new api(mainWindow);
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {

  if (process && process.platform !== 'darwin') {
    app.exit();

    exec('taskkill /f /t /im node.exe', function (error, stdout, stderr) {
      if (error) {
        console.log(error.stack);
        console.log('Error code: ' + error.code);
        return;
      }
      console.log('使用exec方法输出: ' + stdout);
      console.log(`stderr: ${stderr}`);
    });

  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})