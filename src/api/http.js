/*
 * @Author: 梁栢荣
 * @Date: 2019-09-03 17:01:36
 * @Description: file content
 */
import axios from 'axios'
import qs from 'qs';

import {
  myLocalStorage,
} from '@/uilts/uilts'
import { Loading, Message } from 'element-ui';
let loadingInstance = ''
axios.defaults.timeout = 10000;
axios.interceptors.request.use(
  config => {
    const token = myLocalStorage.get('token');
    token && (config.headers.authorization = token);
    if (config.method === 'get') {
      // config.params=qs.stringify(config.params,{ arrayFormat: 'indices' })
    } else if (config.method === 'post') {
      // config.data = qs.stringify(config.data);
      // config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  });


function ajaxContent(param, res) {
  // 登录状态已失效
  if (res.code == 3000) {
    myLocalStorage.remove("token");
    window.location.replace('/login');
    return;
  }

  if (param.loading) {
    loadingInstance.close();
  }
  var hintErr = param.hintErr || false; //禁止弹出警告提示 true: 不弹出    默认弹出
  if (!hintErr) {
    if (res.code !== 200) {
      Message({
        message: res.msg,
        type: 'error'
      });
    }
  }

}
//封装Promise
export default param => {
  if (param.loading) {
    loadingInstance = Loading.service({ fullscreen: true });
  }
  if (param.method == "post") {
    return new Promise((resolve, reject) => {
      axios.post(param.url, {
        ...param.data,
      }).then(res => {
        resolve(res.data);
        ajaxContent(param, res.data);
      }).catch((error) => {
        reject(error)
        if (param.loading) {
          loadingInstance.close();
        }
      });
    }).catch((err) => {
      Message({
        message: err,
        type: 'error'
      });
    })

  } else {
    return new Promise((resolve, reject) => {
      axios.get(param.url, {
        params: param.data,
      }).then(res => {
        resolve(res.data);
        ajaxContent(param, res.data);
      }).catch((error) => {
        reject(error)
        if (param.loading) {
          loadingInstance.close();
        }
      });
    }).catch((err) => {
      Message({
        message: err,
        type: 'error'
      });
    })
  }
};