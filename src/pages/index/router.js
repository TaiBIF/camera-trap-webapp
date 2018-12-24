import Vue from 'vue';
import Router from 'vue-router';
import Overview from './views/Overview';
import store from '../../stores';
import { isAllowManageProject } from '../../util/roles';

Vue.use(Router);

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'overview',
      component: Overview,
    },
    {
      path: '/project/create',
      name: 'createProject',
      component: () => import('./views/CreateProject.vue'),
    },
    {
      path: '/info/:id/edit',
      name: 'editInfo',
      meta: {
        managerOnly: true,
      },
      component: () => import('./views/EditInfo.vue'),
    },
    {
      path: '/column/:id/edit',
      name: 'editColumn',
      meta: {
        managerOnly: true,
      },
      component: () => import('./views/EditColumn.vue'),
    },
    {
      path: '/camera/:id/edit',
      name: 'editCamera',
      meta: {
        managerOnly: true,
      },
      component: () => import('./views/EditCamera.vue'),
    },
    {
      path: '/member/:id/edit',
      name: 'editMember',
      meta: {
        managerOnly: true,
      },
      component: () => import('./views/EditMember.vue'),
    },
    {
      path: '/member/description',
      name: 'memberDescription',
      component: () => import('./views/MemberDescription.vue'),
    },
    {
      path: '/license/:id/edit',
      name: 'editLicense',
      meta: {
        managerOnly: true,
      },
      component: () => import('./views/EditLicense.vue'),
    },
    {
      path: '/project/:id',
      name: 'project',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('./views/Project.vue'),
    },
    {
      path: '/project/:id/site/:site_id/:subsite_id',
      name: 'site',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('./views/Site.vue'),
    },
    {
      path: '/project/:id/site/:site_id/:subsite_id/photo/tag',
      name: 'photoTag',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('./views/PhotoTag.vue'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.managerOnly)) {
    const currentProjectId = to.params.id;
    const projectRoles = store.state.auth.profile.project_roles || [];
    const currentRole = projectRoles.find(
      role => role.projectId === currentProjectId,
    );
    if (!currentRole || !isAllowManageProject(currentRole.role)) {
      console.log('* un-authorize redirect to overview page', currentRole);
      router.replace({
        name: 'overview',
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
