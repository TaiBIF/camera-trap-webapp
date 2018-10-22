import Vue from 'vue'
import Router from 'vue-router'
import Setting from './views/Setting'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'setting',
      component: Setting
    }
  ]
});
