import Vue from "vue";
import VueRouter from "vue-router";

import "./rewriteNavigate.js";

import Home from "@/views/Home";
import Cart from "@/views/Cart";
import Login from "@/views/Login";
import Search from "@/views/Search";
import Register from "@/views/Register";
import Detail from "@/views/Detail";
import Test from "@/views/Test";

Vue.use(VueRouter);

export default new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/home",
      component: Home,
      meta: {
        isShowTypeNav: true,
        isShowFooter: true,
      },
    },
    {
      path: "/cart",
      component: Cart,
      meta: {
        isShowFooter: true,
      },
    },
    {
      path: "/login",
      component: Login,
    },
    {
      path: "/register",
      component: Register,
    },
    {
      path: "/search",
      component: Search,
      meta: {
        isShowTypeNav: true,
        isShowFooter: true,
      },
    },
    {
      path: "/detail/:id",
      component: Detail,
      meta: {
        isShowTypeNav: true,
        isShowFooter: true,
      },
    },
    {
      path: "/test",
      component: Test,
    },
    {
      path: "*",
      redirect: "/home",
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // 当路由发生跳转的时候,就会执行该函数
    // 该函数只有在使用前进后退按钮的时候才会触发
    // 他的用处就是用来控制滚动条的位置的

    // to->存储即将到达的路由信息
    // from->存储的是当前离开的路由信息
    // savedPosition->该参数内部会存储上一次保留的位置
    // 如果本次跳转的是新的路由,就会是null,反之,如果去的是已经展示过的路由,就会有之前的位置信息
    // console.log(savedPosition);

    if(savedPosition){
        // 这个数据有值,说明返回旧路由了,那么就直接调到之前的位置即可
        return savedPosition
    }else{
        // 能进入这里,说明savedPosition没有值,说明是进入新的路由了,直接让他回到顶点
        return{
            x:0,
            y:0
        }
    }
  },
});
