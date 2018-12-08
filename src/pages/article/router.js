import Vue from 'vue';
import Router from 'vue-router';
import Article from './views/Article.vue';
import FAQ from './views/FAQ.vue';
import Contact from './views/Contact.vue';

Vue.use(Router);

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'help',
      component: Article,
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
      name: 'article',
      component: Article,
      props: true,
    },
  ],
});
