
import 'bootstrap'
import '../../sass/app.sass'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '../../stores'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueLodash from 'vue-lodash'
import LoadScript from 'vue-plugin-load-script'
import vSelect from 'vue-select'
import VTooltip from 'v-tooltip'

Vue.use(VueLodash, { name: 'lodash' }) // options is optional
Vue.use(VueAxios, axios)
Vue.use(LoadScript);
Vue.use(VTooltip)

Vue.component('v-select', vSelect)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
