import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL + '/login.html',
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/confirm',
      name: 'confirm',
      component: () => import('./views/Confirm.vue')
    }
  ]
})