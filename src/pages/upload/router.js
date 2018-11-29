import Vue from 'vue';
import Router from 'vue-router';
import Upload from './views/Upload';

Vue.use(Router);

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/:projectId',
      name: 'upload',
      component: Upload,
    },
  ],
});
