const Book = require('./book')
const Git = require('./git')
const System = require('./system')
module.exports = class Api {
  constructor(mainWindow) {
    new Book(mainWindow)
    new Git(mainWindow)
    new System(mainWindow)

  }
}





