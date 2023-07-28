<template>
    <div id="app">
        <!-- Header区域 -->
        <Header></Header>

        <!-- <TypeNav v-show="whiteList.includes($route.path)"/> -->
        <TypeNav v-show="$route.meta.isShowTypeNav" />

        <!-- 通过transition组件,实现对路由组件之间的切换过渡效果实现 -->
        <transition mode="out-in" enter-active-class="animate__fadeIn" leave-active-class="animate__fadeOut">
            <!-- 路由切换区域 -->
            <router-view class="content animate__animated"></router-view>
        </transition>

        <!-- Footer区域 -->
        <Footer v-show="$route.meta.isShowFooter" />
    </div>
</template>

<script>
import 'animate.css';
export default {
    name: 'App',
    data() {
        return {
            // whiteList:['/home','/search','/detail']
        }
    },
    mounted() {
        // console.log(this.$route)
    }
}
</script>

<style lang="less" scoped>
//   #app{
//     font-size:50px;
//     color:red;
//   }
.content {
    --animate-duration: 0.4s;
}
</style>