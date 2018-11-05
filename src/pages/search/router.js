import Vue from 'vue'
import Router from 'vue-router'
import Search from './views/Search'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Search',
      component: Search
    },
    {
      path: '/search',
      name: 'SearchResult',
      component: () => import('./views/SearchResult.vue')
    },
    {
      path: '/calculate',
      name: 'Calculate',
      component: () => import('./views/CalculateResult.vue')
    }
  ]
})
