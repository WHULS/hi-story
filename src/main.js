import Vue from 'vue';
import HiMap from './HiMap.vue';
import store from './store';
import axios from 'axios';

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;


new Vue({
  store,
  render: function (h) { return h(HiMap); }
}).$mount('#app');
