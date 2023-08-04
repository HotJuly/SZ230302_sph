import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";

import "./rewriteNavigate.js";

import Home from "@/views/Home";
import Cart from "@/views/Cart";
import Login from "@/views/Login";
import Search from "@/views/Search";
import Register from "@/views/Register";
import Detail from "@/views/Detail";
import AddCartSuccess from "@/views/AddCartSuccess";
import Test from "@/views/Test";

Vue.use(VueRouter);

const router = new VueRouter({
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
      path: "/addsuccess",
      component: AddCartSuccess,
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

    if (savedPosition) {
      // 这个数据有值,说明返回旧路由了,那么就直接调到之前的位置即可
      return savedPosition;
      // return new Promise((resolve)=>{
      //   setTimeout(()=>{
      //     resolve(savedPosition)
      //   },800);
      // })
    } else {
      // 能进入这里,说明savedPosition没有值,说明是进入新的路由了,直接让他回到顶点
      return {
        x: 0,
        y: 0,
      };
    }
  },
});

// 使用全局守卫来监视用户在该项目中的跳转过程,它不仅可以监视跳转过程,初始化项目也能监视的到
/*
  在全局前置守卫中,检查用户是否有登陆操作
  思路:
      1.如果当前有token
        -如果当前有个人信息
          那么他想去哪就去哪

        -如果当前没有个人信息
          就需要发送请求,用token兑换个人信息
            注意:使用token兑换个人信息不一定会成功
                  因为token会过期,所以可能会兑换失败

      2.如果当前没有token
*/
router.beforeEach(async (to, from, next) => {
  // 获取store中的token数据
  const token = store.state.user.token;

  if (token) {
    // 能进入这里,说明当前具有token

    const userInfo = store.state.user.userInfo;
    if (userInfo.nickName) {
      // 如果能进入这里,就说明当前已经有token,而且还具有用户个人信息

      next();
    } else {
      // 能进入这里,就说明当前有token,没有个人信息
      // 基本上能进入这里,就说明用户登陆过了,然后第二次进入项目

      try {
        await store.dispatch("user/getUserInfo");
        next();
      } catch (e) {
        // 能进入这里,说明白请求个人信息失败了,因为token过期了
        // console.log("token过期了");

        store.dispatch('user/logout');
        next('/login');
      }
    }
  } else {
    // 能进入这里,说明当前没有token
    // 此处暂时都放行,但是后面肯定要做路由跳转的权限控制
    next();
  }
});

export default router;
