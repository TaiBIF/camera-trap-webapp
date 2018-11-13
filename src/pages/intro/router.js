import Vue from 'vue'
import Router from 'vue-router'
import Intro from './views/Intro'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Intro',
      component: Intro
    }
  ]
})
