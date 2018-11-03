import Vue from 'vue'
import Router from 'vue-router'
import Overview from './views/Overview'

Vue.use(Router)

export default new Router({
  mode: 'history',
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
      path: '/info/:id/edit',
      name: 'editInfo',
      component: () => import('./views/EditInfo.vue')
    },
    {
      path: '/column/:id/edit',
      name: 'editColumn',
      component: () => import('./views/EditColumn.vue')
    },
    {
      path: '/camera/:id/edit',
      name: 'editCamera',
      component: () => import('./views/EditCamera.vue')
    },
    {
      path: '/member/:id/edit',
      name: 'editMember',
      component: () => import('./views/EditMember.vue')
    },
    {
      path: '/member/description',
      name: 'memberDescription',
      component: () => import('./views/MemberDescription.vue')
    },
    {
      path: '/license/:id/edit',
      name: 'editLicense',
      component: () => import('./views/EditLicense.vue')
    },
    {
      path: '/project/:id',
      name: 'project',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('./views/Project.vue')
    },
    {
      path: '/project/:id/site/:site_id',
      name: 'site',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('./views/Site.vue')
    },
    {
      path: '/project/:id/site/:site_id/photo/:photo_id',
      name: 'photoTag',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('./views/PhotoTag.vue')
    }
  ]
})
