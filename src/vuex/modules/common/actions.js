/*
 * @Author: 梁栢荣
 * @Date: 2019-09-03 17:12:53
 * @Description: file content
 */
import api from '@/api/index'

export default {
  // 获取用户信息
  getUserInfo({ commit }) {
    api.user.getUserInfo().then(res=>{
      if(res.code===200){
        window.$mySessionstorage.set('userInfo',res.data);
        commit('setUserInfo', res.data);
      }
    })
  },

};
