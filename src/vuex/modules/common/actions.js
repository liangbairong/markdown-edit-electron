/*
 * @Author: 梁栢荣
 * @Date: 2019-09-03 17:12:53
 * @Description: file content
 */
import api from '@/api/index'

export default {
  getGitChangeList({ commit },params) {
    api.get_git_status(params).then(res=>{
      if(res.code===200){
        console.log(res.data)
        commit('setGitChangeList', res.data);
      }
    })
  },

};
