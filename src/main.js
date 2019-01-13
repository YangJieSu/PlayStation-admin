// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
// axios 套件
import axios from 'axios';
import VueAxios from 'vue-axios';
// Bootstrap 套件
import 'bootstrap';
// loading 套件
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.min.css';
// 驗證套件
import VeeValidate from 'vee-validate';
import zh_TW from 'vee-validate/dist/locale/zh_TW';

Vue.use(VueAxios, axios);


Vue.use(VeeValidate);
VeeValidate.Validator.localize('zh_TW', zh_TW);

Vue.component('Loading', Loading);
Vue.component('Pagination', pagination);
Vue.filter('currency', currencyFilter);
Vue.filter('date', dateFilter);

import App from './App';
import router from './router';
import pagination from './components/Pagination';
import currencyFilter from './filters/currency';
import dateFilter from './filters/date';
import './bus';

Vue.config.productionTip = false;
axios.defaults.withCredentials = true;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})


router.beforeEach((to, from, next) => {
  let api = `${process.env.API_PATH}/api/user/check`;
  if (to.meta.requiresAuth) {
    axios.post(api).then((response) => {
      if (response.data.success) {
        next();
      } else {
        next({
          path: '/sign_in',
        });
      };
    });
  } else {
    next();
  };
})