import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/directory',
      name:'directory',
      component: resolve => require(['../page/directory.vue'], resolve),
      meta: { title: '目录' }
    },
    {
      path: '/edit',
      name:'edit',
      component: resolve => require(['../page/edit.vue'], resolve),
      meta: { title: '编辑' }
    },
    {
      path: '/index',
      name:'index',
      component: resolve => require(['../page/index.vue'], resolve),
      meta: { title: '首页' }
    },
  ]
})
