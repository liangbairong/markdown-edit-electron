/*
 * @Author: 王益
 * @Date: 2019-01-23 14:44:04
 * @LastEditors: 王益
 * @LastEditTime: 2019-01-24 09:40:26
 * @Description: file content
 */
import state from './state';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';

export default {
  // 【namespace必须为true】设置了namespaced=true，在使用mapGetters、mapMutations等帮助函数是记得要设置命名空间，具体参考vuex官方文档
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};