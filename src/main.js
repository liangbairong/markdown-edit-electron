import Vue from 'vue'
import App from './App.vue'
import store from './vuex/index'
import router from './router'
import api from './api/index'
import axios from 'axios';
import {
  myLocalStorage, mySessionstorage
} from '@/uilts/uilts'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import './assets/css/icon.css';
// import './public/directives';
import "babel-polyfill";
import pinyin from "js-pinyin";
pinyin.setOptions({checkPolyphone: false, charCase: 0});

import mavonEditor from 'mavon-editor'
// markdown-it对象：md.s_markdown, md => mavonEditor实例
//                 or
//                 mavonEditor.markdownIt 
import 'mavon-editor/dist/css/index.css'
// use
Vue.use(mavonEditor)
import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'
Vue.use(contentmenu)
Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.prototype.$axios = axios;
Vue.prototype.$api = window.$api= api;
Vue.prototype.$myLocalStorage = window.$myLocalStorage = myLocalStorage;
Vue.prototype.$mySessionstorage = window.$mySessionstorage = mySessionstorage;

Vue.prototype.$pinyin=pinyin

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')