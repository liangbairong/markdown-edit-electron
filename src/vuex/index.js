/*
 * @Author: 梁栢荣
 * @Date: 2019-09-03 17:12:52
 * @Description: file content
 */

import Vue from 'vue';
import Vuex from 'vuex';
import common from './modules/common/index';
Vue.use(Vuex);
const vuex = new Vuex.Store({
  modules: {
    common,
  },
});

export default vuex;
