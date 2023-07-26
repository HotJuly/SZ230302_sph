import Vue from 'vue';
import App from './App.vue';

import Header from './components/Header';
import Footer from './components/Footer';
import TypeNav from './components/TypeNav';

import router from '@/router';
import store from '@/store';


import '@/mock';

import * as API from '@/api';

Vue.prototype.$API = API;

Vue.prototype.$bus = new Vue();

Vue.config.productionTip = false;

// 引入.vue文件,可以获取到Header组件的配置对象,然后从中获取到他的name属性进行注册
Vue.component(Header.name,Header);
Vue.component(Footer.name,Footer);
Vue.component(TypeNav.name,TypeNav);

new Vue({
    router,
    store,
    render:h => h(App)
})
.$mount('#app');