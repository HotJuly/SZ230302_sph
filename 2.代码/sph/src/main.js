import Vue from "vue";
import App from "./App.vue";
// 这是全局引入语法
import ElementUI from "element-ui";

// 这是按需引入语法
// import { Button } from 'element-ui';
import "element-ui/lib/theme-chalk/index.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import TypeNav from "./components/TypeNav";

import router from "@/router";
import store from "@/store";

import VueLazyload from 'vue-lazyload'
import picture from '@/assets/images/dazuo.jpeg'


import "@/mock";

import * as API from "@/api";

// 这种UI库的第一种使用方法,全局引入
// 也就是说当前UI库中所有的组件都会引入打包
Vue.use(ElementUI);

Vue.use(VueLazyload,{
	loading:picture
})

// 这是UI库的第二种使用方法,按需引入
// 问题:全局引入那么方便,为什么还要推出按需引入?
// 回答:因为性能,假设当前UI库有200个组件,全局引入就代表所有组件都会被打包到项目的js文件中
//  然而用户只使用了其中一个,使用按需引入就可以只让这一个组件的代码进入js文件中
//  也就是说全局引入会增加项目的体积,增加用户的网络请求时间,增加页面白屏时长
// Vue.component(Button.name, Button);


Vue.prototype.$API = API;

Vue.prototype.$bus = new Vue();

Vue.config.productionTip = false;

// 引入.vue文件,可以获取到Header组件的配置对象,然后从中获取到他的name属性进行注册
Vue.component(Header.name, Header);
Vue.component(Footer.name, Footer);
Vue.component(TypeNav.name, TypeNav);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
