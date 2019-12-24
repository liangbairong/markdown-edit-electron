module.exports = class ThrowError {
  constructor(url,code = 400, msg = '服务器错误',mainWindow) {
    let err = new Error(msg);
    err.code = code;
    err.msg = msg
    mainWindow.webContents.send(url, {
      code,
      msg
    })
    throw err
  }
}