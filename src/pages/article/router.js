import Vue from 'vue';
import Router from 'vue-router';
import Prose from './views/Prose.vue';
import FAQ from './views/FAQ.vue';
import Contact from './views/Contact.vue';

Vue.use(Router);

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'article',
      component: Prose,
    },
    {
      path: '/faq',
      name: 'faq',
      component: FAQ,
    },
    {
      path: '/contact',
      name: 'contact',
      component: Contact,
    },
    {
      path: '/:slug',
      name: 'prose',
      component: Prose,
    },
  ],
});
