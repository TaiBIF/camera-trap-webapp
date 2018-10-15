import Vue from 'vue'
import Router from 'vue-router'
import Article from './views/Article'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/:slug',
      name: 'article',
      component: Article
    }
  ]
})