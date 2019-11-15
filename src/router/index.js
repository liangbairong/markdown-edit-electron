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
          path: '/index',
          component: resolve => require(['../page/index.vue'], resolve),
          meta: { title: '首页' }
      },
      {
        path: '/edit',
        component: resolve => require(['../page/edit.vue'], resolve),
        meta: { title: '编辑' }
    },
    ]
})
