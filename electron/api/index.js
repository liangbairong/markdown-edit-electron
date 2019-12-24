const { ipcMain,dialog  } = require('electron')
var dir = require('node-dir');
const path = require('path')
const fs = require('fs')
var marked = require("marked");
var cheerio = require('cheerio')
var fileSystem = require('file-system')
var html2markdown = require('html2markdown');
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();
const ThrowError = require('../uilts/ThrowError.js')

// 修改书本目录
function updateSummary(docPath, fileListDom) {
  fileSystem.writeFileSync(path.join(docPath + '/SUMMARY.md'), entities.decode(html2markdown(fileListDom)))
}
function updateLangs(docPath, bookListDom) {
  fileSystem.writeFileSync(path.join(docPath + '/LANGS.md'), entities.decode(html2markdown(bookListDom)))
}

class api {
  constructor(mainWindow) {
    // 选择文件夹
    ipcMain.on('get_folder', async (sys, query) => {
        dialog.showOpenDialog({
           properties:['openDirectory']
          }).then(result => {
          mainWindow.webContents.send('get_folder', {
            code: 200,
            data: result
          })
        })
        
    })
    // 获取书本列表
    ipcMain.on('get_books', async (sys, query) => {
      let docPath = query.docPath
      if (!docPath) {
        new ThrowError('get_books', 400, '文件夹路径docPath不能为空',mainWindow)
      }
      try {
        var sum_data = fileSystem.readFileSync(path.join(docPath + '/LANGS.md'));
      } catch (err) {
        if (!sum_data) {
          new ThrowError('get_books',400, '该文件夹下，LANGS.md文件不存在',mainWindow)
        }
      }
      var $ = cheerio.load(marked(sum_data.toString()))
      var bookList = []
      $('ul a').each(function () {
        bookList.push({
          label: $(this).text(),
          value: docPath + '/' + $(this).attr('href'),
          href: $(this).attr('href')
        })
      })
      console.log(query)  //接收窗口传来的消息
      mainWindow.webContents.send('get_books', {
        code: 200,
        data: bookList
      })
    })

    // 获取目录
    ipcMain.on('get_directory', async (sys, query) => {
      let bookPath = query.bookPath
      if (!bookPath) {
        new ThrowError('get_directory', 400, 'bookPath为空',mainWindow)
      }
      var sum_data = fileSystem.readFileSync(path.join(bookPath + '/SUMMARY.md'));
      var $ = cheerio.load(marked(sum_data.toString()))
      var dirList = [];
      cn($('body > ul').find(' > li'), dirList)
      function cn(dom, list) {
        dom.each(function (index) {
          list.push({
            label: $(this).find('> a').text(),
            aubPath: bookPath + '/' + $(this).find(' > a').attr('href'),
            filePath: $(this).find(' > a').attr('href'),
            children: []
          })
          if ($(this).find('> ul').length > 0) {
            cn($(this).find('> ul').find(' > li'), list[index].children)
          }
        })
      }
      mainWindow.webContents.send('get_directory', {
        code: 200,
        data: dirList
      })


    })
    // 获取内容
    ipcMain.on('get_book_content', async (sys, query) => {
      let contentPath = query.contentPath
      var data = fileSystem.readFileSync(path.join(contentPath));
      mainWindow.webContents.send('get_book_content', {
        code: 200,
        data: data.toString(),
      })
    })
    // 添加书本
    ipcMain.on('add_books', async (sys, query) => {
      const { bookName, bookCode, docPath, bookListDom } = query;
      fileSystem.mkdirSync(path.join(docPath + '/' + bookCode));
      fileSystem.copySync(path.join(docPath + '/base'), path.join(docPath + '/' + bookCode));
      fileSystem.mkdirSync(path.join(docPath + '/' + bookCode + '/assets/image'));
      updateLangs(docPath, bookListDom)
      mainWindow.webContents.send('add_books', {
        code: 200,
        data: '',
      })
    })


    // 修改书本排序
    ipcMain.on('update_books_rank', async (sys, query) => {
      const { docPath, bookListDom } = query;
      updateLangs(docPath, bookListDom)
      mainWindow.webContents.send('update_books_rank', {
        code: 200,
        data: '',
      })
    })


    // 删除书籍
    ipcMain.on('del_books', async (sys, query) => {
      const { docPath, bookListDom, bookCode } = query;
      updateLangs(docPath, bookListDom)
      fileSystem.rmdirSync(docPath + '/' + bookCode)
      mainWindow.webContents.send('del_books', {
        code: 200,
        data: '',
      })
    })

    // 添加章节
    ipcMain.on('add_file', async (sys, query) => {
      const { filePath, docPath, fileListDom } = query;
      fileSystem.writeFileSync(path.join(docPath + '/' + filePath), '')
      updateSummary(docPath, fileListDom)
      mainWindow.webContents.send('add_file', {
        code: 200,
        data: '',
      })
    })


    // 修改文件
    ipcMain.on('update_file', async (sys, query) => {
      const { filePath, docPath, content } = query;
      fileSystem.writeFileSync(path.join(docPath + '/' + filePath), content)
      // fileSystem.copySync(path.join(process.cwd(),'app/public/assets/image/'), path.join(docPath + '/assets/image'));
      mainWindow.webContents.send('update_file', {
        code: 200,
        data: '',
      })
    })

    // 删除文件
    ipcMain.on('del_file', async (sys, query) => {
      const { filePath, docPath, fileListDom } = query;
      try {
        fs.unlinkSync(docPath + '/' + filePath)
      } catch (err) {
        console.log(err)
      }
      updateSummary(docPath, fileListDom)
      mainWindow.webContents.send('del_file', {
        code: 200,
        data: '',
      })
    })

    // 修改目录排序
    ipcMain.on('update_rank', async (sys, query) => {
      const { docPath, fileListDom } = query;
      updateSummary(docPath, fileListDom)
      mainWindow.webContents.send('update_rank', {
        code: 200,
        data: '',
      })
    })


    // 上传图片
    ipcMain.on('upload_image', async (sys, query) => {
      const { docPath, image, imageType, filePath } = query;
      var imageName = Date.now() + '.' + imageType;
      var base64 = image.replace(/^data:image\/\w+;base64,/, ""); //去掉图片base64码前面部分data:image/png;base64
      let dataBuffer = new Buffer.from(base64, 'base64');
      fileSystem.writeFileSync(path.join(docPath + '/assets/image/' + imageName), dataBuffer)

      const level = filePath.split("/");
      console.log(level)
      let imagePath = ''
      switch (level.length) {
        case 1:
          imagePath = './assets/image/' + imageName
          break;
        case 2:
          imagePath = '../assets/image/' + imageName
          break;
        case 3:
          imagePath = '../../assets/image/' + imageName
          break;
        case 4:
          imagePath = '../../../assets/image/' + imageName
          break;
      }
      mainWindow.webContents.send('upload_image', {
        code: 200,
        data: {
          level:level.length,
          data:'/assets/image/' + imageName
        }
      })
    })







  }
}


module.exports = api





