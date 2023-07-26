<template>
  <!-- 头部 -->
  <header class="header">
    <!-- 头部的第一行 -->
    <div class="top">
      <div class="container">
        <div class="loginList">
          <p>尚品汇欢迎您！</p>
          <p>
            <span>请</span>
            <router-link to="/login">登录</router-link>
            <router-link to="/register" class="register">免费注册</router-link>
            <router-link to="/test" class="register">测试</router-link>
          </p>
        </div>
        <div class="typeList">
          <a href="###">我的订单</a>
          <router-link to="/cart">我的购物车</router-link>
          <a href="###">我的尚品汇</a>
          <a href="###">尚品汇会员</a>
          <a href="###">企业采购</a>
          <a href="###">关注尚品汇</a>
          <a href="###">合作招商</a>
          <a href="###">商家后台</a>
        </div>
      </div>
    </div>
    <!--头部第二行 搜索区域-->
    <div class="bottom">
      <h1 class="logoArea">
        <router-link to="/home" class="logo" title="尚品汇">
          <img src="./images/logo.png" alt="">
        </router-link>
      </h1>
      <div class="searchArea">
        <form action="###" class="searchForm">
          <input v-model.lazy="keyword" type="text" id="autocomplete" class="input-error input-xxlarge" />
          <button class="sui-btn btn-xlarge btn-danger" type="button" @click="toSearch">搜索</button>
        </form>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  data(){
    return{
      // 数据劫持,会对当前data对象中所有的属性名进行响应式操作
      // 会将所有的属性都变为响应式属性,但是如果你没写该属性,他就不会是响应式的
      keyword:undefined
    }
  },
  mounted(){
    // 箭头函数的this非常特殊,与作用域有关
    // 他会使用外层作用域的this
    this.$bus.$on('clearKeyword',()=>{
      this.keyword = undefined;
    })
  },
  methods: {
    toSearch() {
      // push方法跳转路由,会保留上一个历史记录,所以可以返回上一个路由
      // replace方法跳转路由,会覆盖上一个历史记录,所以无法返回上一个路由

      // 扩展:导航跳转方法其实是异步的
      //    所以push和replace方法都会返回一个Promise
      //    本次跳转成功,该Promise对象的状态就会变为成功状态
      //    本次跳转失败,该Promise对象的状态就会变为失败状态

      /*
        重复跳转会出现报错
          官方原因:重复跳转到同一个路由地址,跳转冗余
          实际原因:返回Promise对象变为了失败状态,所以导致控制台出现报错
      
      */

      // console.log(this)
      this.$router.push({
        path:'/search',
        query:{
          ...this.$route.query,
          keyword:this.keyword
        }
      })
      // const result = this.$router.push('/search');
      // this.$router.replace('/search');

      // console.log(result)

      //解决报错第一种方法
      // .catch方法其实是一个语法糖(新的语法,简化用户操作,实际上还是用的旧的东西)
      //  .catch方法,其实是.then方法的语法糖
      // .catch方法专门用于捕获promise对象出现的报错,需要传入一个回调函数
      // result.catch((error)=>{
      //   console.log('跳转出错了')
      // })

      //解决报错第二种方法
      // .then方法一共接收两个回调函数,第一个是成功回调函数,第二个是失败回调函数
      // 当被监视的promise状态变为成功,就会自动执行第一个回调函数
      // 当被监视的promise状态变为失败,就会自动执行第二个回调函数
      // result.then(
      //   ()=>{
      //     console.log('跳转成功')
      //   },
      //   ()=>{
      //     console.log('跳转失败')
      //   }
      // )

      // 以下写法其实就是.catch方法的原理
      // result.then(
      //   null,
      //   ()=>{
      //     console.log('跳转失败')
      //   }
      // )

      // 解决报错第三种方法
      // const result = this.$router.push(
      //   '/search',
      //   () => {
      //     console.log('成功跳转')
      //   },
      //   () => {
      //     console.log('捕获到失败的跳转')
      //   }
      // );

      // 可以只传入捕获失败的回调函数
      // const result = this.$router.push(
      //   '/search',
      //   null,
      //   () => {
      //     console.log('捕获到失败的跳转')
      //   }
      // );

      // 即便不传入失败的回调函数,底层也会自动解决该报错
      // const result = this.$router.push(
      //   '/search',
      //   () => {
      //     console.log('跳转成功')
      //   }
      // );

      // console.log(this.$router)
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  &>.top {
    background-color: #eaeaea;
    height: 30px;
    line-height: 30px;

    .container {
      width: 1200px;
      margin: 0 auto;
      overflow: hidden;

      .loginList {
        float: left;

        p {
          float: left;
          margin-right: 10px;

          .register {
            border-left: 1px solid #b3aeae;
            padding: 0 5px;
            margin-left: 5px;
          }
        }
      }

      .typeList {
        float: right;

        a {
          padding: 0 10px;

          &+a {
            border-left: 1px solid #b3aeae;
          }
        }

      }

    }
  }

  &>.bottom {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;

    .logoArea {
      float: left;

      .logo {
        img {
          width: 175px;
          margin: 25px 45px;
        }
      }
    }

    .searchArea {
      float: right;
      margin-top: 35px;

      .searchForm {
        overflow: hidden;

        input {
          box-sizing: border-box;
          width: 490px;
          height: 32px;
          padding: 0px 4px;
          border: 2px solid #ea4a36;
          float: left;

          &:focus {
            outline: none;
          }
        }

        button {
          height: 32px;
          width: 68px;
          background-color: #ea4a36;
          border: none;
          color: #fff;
          float: left;
          cursor: pointer;

          &:focus {
            outline: none;
          }
        }
      }
    }
  }
}
</style>