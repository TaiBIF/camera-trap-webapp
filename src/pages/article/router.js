import Vue from 'vue'
import Router from 'vue-router'
import Article from './views/Article'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'article',
      component: Article
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('./views/FAQ.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('./views/Contact.vue')
    },
    {
      path: '/:slug',
      name: 'article',
      component: Article
    }
  ]
})