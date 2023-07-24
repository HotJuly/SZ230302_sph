<template>
    <div id="app">
        <!-- Header区域 -->
        <Header></Header>

        <!-- <TypeNav v-show="whiteList.includes($route.path)"/> -->
        <TypeNav v-show="$route.meta.isShowTypeNav"/>

        <!-- 路由切换区域 -->
        <router-view></router-view>

        <!-- Footer区域 -->
        <Footer/>
    </div>
</template>

<script>
export default {
    name: 'App',
    data(){
        return{
            // whiteList:['/home','/search','/detail']
        }
    },
    mounted(){
        // console.log(this.$route)
    }
}
</script>

<style lang="less" scoped>
//   #app{
//     font-size:50px;
//     color:red;
//   }
</style>