module.exports = class ThrowError {
  $error(url,code = 400, msg = '服务器错误',mainWindow){
    mainWindow.webContents.send(url, {
      code,
      msg
    })
  }
}