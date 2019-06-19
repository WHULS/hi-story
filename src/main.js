import Vue from 'vue';
import HiMap from './HiMap.vue';
import store from './store';
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
Vue.use(ElementUI);

new Vue({
  store,
  render: function (h) { return h(HiMap); }
}).$mount('#app');
