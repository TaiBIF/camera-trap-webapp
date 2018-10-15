import Vue from 'vue'
import Router from 'vue-router'
import Index from '../views/Index.vue'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL + '/demo.html',
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/handsontable',
      name: 'handsontable',
      component: () => import('../views/HandsonTable.vue')
    },
    {
      path: '/upload',
      name: 'upload',
      component: () => import('../views/Upload.vue')
    }
  ]
})