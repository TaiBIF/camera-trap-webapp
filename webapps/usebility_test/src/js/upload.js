
import 'babel-polyfill'
import 'es6-promise/auto'

import Vue from 'vue'  
import Vuex from 'vuex'
import Router from 'vue-router'
import { sync } from 'vuex-router-sync'
import { routes } from './routes/upload'
import store from './store'
// import BootstrapVue from 'bootstrap-vue'

// Vue.use(BootstrapVue);

Vue.use(Vuex);   
Vue.use(Router);

const router = new Router({
  routes,
  mode: 'hash', 
});  

sync(store, router);  

import App from './App'

const app = new Vue({ 
  router,
  store,
  render: h => h(App), 
}).$mount('#app');
