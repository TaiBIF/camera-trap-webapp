import Vue from 'vue'
import Router from 'vue-router'
import Overview from './views/Overview'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'overview',
      component: Overview
    },
    {
      path: '/project/create',
      name: 'createProject',
      component: () => import('./views/CreateProject.vue')
    },
    {
      path: '/project/:id/edit',
      name: 'editProject',
      component: () => import('./views/CreateProject.vue')
    },
    {
      path: '/project/:id',
      name: 'project',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('./views/Project.vue')
    },
    // {
    //   path: '/project/:id/site/:site_id',
    //   name: 'site',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import('./views/Project.vue')
    // }
  ]
})
