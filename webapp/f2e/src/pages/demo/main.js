import '../../sass/app.sass'
import '../../sass/demo.sass'

import Vue from 'vue'
import App from './App.vue'
import router from './routes'
import store from '../../stores'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueLodash from 'vue-lodash'
import LoadScript from 'vue-plugin-load-script'

Vue.use(VueLodash, { name: 'lodash' }) // options is optional
Vue.use(VueAxios, axios)
Vue.use(LoadScript);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
