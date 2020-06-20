import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueCookie from 'vue-cookie';
import vuetify from './plugins/vuetify';
import VuetifyDialog from "vuetify-dialog";
import VueYouTubeEmbed from 'vue-youtube-embed'

Vue.use(VueCookie);
Vue.use(VuetifyDialog);
Vue.use(VueYouTubeEmbed, { global: true, componentId: "youtube-media" });

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
