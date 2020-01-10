const { ipcMain } = require('electron')
const ThrowError = require('../uilts/ThrowError')
const { exec } = require('child_process');

module.exports = class Git extends ThrowError {
  constructor(mainWindow) {
    super();
    this.mainWindow = mainWindow
    // clone
    ipcMain.on('git_clone', async (sys, query) => {
      const { gitUrl, gitName, path, user, pass } = query;
      const gitUrlTemp = gitUrl.split("://")[1]
      await this.execPromise({
        shell: `git clone https://${user}:${pass}@${gitUrlTemp} ./${gitName}`,
        options: { cwd: `${path}` },
        func: 'git_clone'
      })
      const data = await this.getBranch(path, gitName, 'git_clone')
      mainWindow.webContents.send('git_clone', {
        code: 200,
        data
      })
    })
    // 查看分支列表
    ipcMain.on('get_git_branch', async (sys, query) => {
      const { gitName, path } = query;
      const data = await this.getBranch(path, gitName, 'get_git_branch')
      mainWindow.webContents.send('get_git_branch', {
        code: 200,
        data
      })
    })

    // 切换分支
    ipcMain.on('switch_git_branch', async (sys, query) => {
      const { gitName, path, branch, branchType } = query;
      if (branchType == 'origin') {
        await this.execPromise({
          shell: `git checkout -b ${branch} origin/${branch}`,
          options: { cwd: `${path}/${gitName}` },
          func: 'switch_git_branch'
        })
      } if (branchType == "local") {
        // 切本地分支
        await this.execPromise({
          shell: `git checkout ${branch}`,
          options: { cwd: `${path}/${gitName}` },
          func: 'switch_git_branch'
        })
      }
      const data = await this.getBranch(path, gitName, 'switch_git_branch')
      mainWindow.webContents.send('switch_git_branch', {
        code: 200,
        data
      })

    })


    // 获取文件改动列表
    ipcMain.on('get_git_status', async (sys, query) => {
      const { projectPath } = query;
      const data = await this.execPromise({
        shell: `git status`,
        options: { cwd: `${projectPath}` },
        func: 'get_git_status'
      })
      let list = data.split('\n')
      let arr = []
      console.log(list)
      list.forEach(item => {
        // if (item.indexOf('modified:') != -1) {
        //   arr.push(item.split('modified:')[1].trim())
        // }
        if (item.indexOf('\t') != -1) {
          let ts = item.split('\t')[1].trim()
          if (ts.indexOf('modified:') != -1) {
            arr.push({
              value: ts.split('modified:')[1].trim(),
              type: 'update'
            })
          } else if (ts.indexOf('deleted:') != -1) {
            arr.push({
              value: ts.split('deleted:')[1].trim(),
              type: 'del'
            })
          } else {
            arr.push({ value: ts, type: 'new' })
          }
        }
      })
      console.log(arr)
      mainWindow.webContents.send('get_git_status', {
        code: 200,
        data: arr
      })
    })


    // 更新代码
    ipcMain.on('git_pull', async (sys, query) => {
      const { projectPath } = query;
      const data = await this.execPromise({
        shell: `git pull`,
        options: { cwd: `${projectPath}` },
        func: 'git_pull'
      })
      mainWindow.webContents.send('git_pull', {
        code: 200,
        data: data
      })
    })

    // 检查是否有冲突
    ipcMain.on('git_diff', async (sys, query) => {
      const { projectPath, content } = query;
      const data = await this.execPromise({
        shell: `git diff --check`,
        options: { cwd: `${projectPath}` },
        func: 'git_diff'
      })

      console.log("推送到远程")
      mainWindow.webContents.send('git_diff', {
        code: 200,
        data: data
      })
    })

    // 提交代码
    ipcMain.on('git_push', async (sys, query) => {
      const { projectPath, content } = query;
      await this.execPromise({
        shell: `git add .`,
        options: { cwd: `${projectPath}` },
        func: 'git_push'
      })
      console.log("暂存区")
      await this.execPromise({
        shell: `git commit -m ${content}`,
        options: { cwd: `${projectPath}` },
        func: 'git_push'
      })

      console.log("提交到本地git")
      // await this.execPromise({
      //   shell: `git pull --rebase origin dev`,
      //   options: { cwd: `${projectPath}` },
      //   func: 'git_push'
      // })
      await this.execPromise({
        shell: `git push`,
        options: { cwd: `${projectPath}` },
        func: 'git_push'
      })
      console.log("推送到远程")
      mainWindow.webContents.send('git_push', {
        code: 200,
        data: 'data'
      })
    })





  }
  execPromise(params) {
    return new Promise((succ, err) => {
      exec(params.shell, params.options || {}, (error, stdout, stderr) => {
        if (error) {
          console.log(error.stack);
          console.log('Error code: ' + error.code);
          this.$error(params.func, error.code || 400, error.stack, this.mainWindow)
          err(error)
          return
        }
        succ(stdout)
      })
    })
  }
  // 获取分支列表
  async getBranch(path, gitName, func) {
    const originData = await this.execPromise({
      shell: `git branch -a`,
      options: { cwd: `${path}/${gitName}` },
      func
    })
    const localData = await this.execPromise({
      shell: `git branch`,
      options: { cwd: `${path}/${gitName}` },
      func
    })
    let branchAction = ''
    let branchList = []
    let originArr = originData.split("\n");
    let localArr = localData.split("\n");
    localArr = localArr.map(item => {
      if (item.indexOf('*') != -1) {
        item = item.split('*')[1].trim();
        branchAction = item;
      } else {
        item = item.trim();
      }
      return item
    })
    console.log(originArr)
    console.log(localArr)

    originArr.forEach(item => {
      try {
        if (item.indexOf('remotes/origin/') != -1 && item.indexOf('->') == -1) {
          let name = item.split('remotes/origin/')[1].trim();
          let type = 'origin'
          if (localArr.indexOf(name) > -1) {
            type = 'local'
          }
          branchList.push({
            name,
            type
          })
        }

      } catch (err) {
        console.log(err)
      }
    })
    console.log(branchList)

    return {
      branchAction,
      branchList
    }
  }

}





