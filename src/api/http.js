


import { Loading, Message } from 'element-ui';

//封装Promise
export default param => {
    window.electron.ipcRenderer.send(param.url,param.data)
    return new Promise((resolve, reject) => {
      window.electron.ipcRenderer.on(param.url, (event, data) => {
        // console.log(data)
        resolve(data)
        if(data.code!=200){
          Message({
            message: data.msg,
            type: 'error'
          });
        }
      })
    }).catch((err) => {
      Message({
        message: err,
        type: 'error'
      });
     
    })

  }