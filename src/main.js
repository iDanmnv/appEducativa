import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueCookie from 'vue-cookie';
import vuetify from './plugins/vuetify';

Vue.use(VueCookie);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
