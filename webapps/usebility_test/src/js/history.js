
import 'babel-polyfill'
import 'es6-promise/auto'

import Vue from 'vue'  
import Vuex from 'vuex'
import store from './store'

Vue.use(Vuex);   

import History from './views/History'

const app = new Vue({ 
  store,
  render: h => h(History), 
}).$mount('#app');
