import Vue from 'vue';
import Router from 'vue-router';
import Search from './views/Search';
import SearchResult from './views/SearchResult.vue';
import CalculateResult from './views/CalculateResult.vue';

Vue.use(Router);

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Search',
      component: Search,
    },
    {
      path: '/search',
      name: 'SearchResult',
      component: SearchResult,
    },
    {
      path: '/calculate',
      name: 'Calculate',
      component: CalculateResult,
    },
    {
      path: '/project/:id/site/:site_id/:subsite_id/photo/tag',
      name: 'photoTag',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../index/views/PhotoTag.vue'),
    },
  ],
});
