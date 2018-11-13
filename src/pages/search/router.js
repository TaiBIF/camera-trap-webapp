import Vue from 'vue';
import Router from 'vue-router';
import Search from './views/Search';
import SearchResult from './views/SearchResult.vue';
import CalculateResult from './views/CalculateResult.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
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
  ],
});
