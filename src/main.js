import Vue from 'vue'
import HiMap from './HiMap.vue'
import store from './store'

Vue.config.productionTip = false

new Vue({
  store,
  render: function (h) { return h(HiMap) }
}).$mount('#app')
