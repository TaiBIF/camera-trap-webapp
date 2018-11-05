import Vue from 'vue'
import Router from 'vue-router'
import History from './views/History'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'History',
      component: History
    }
  ]
})
