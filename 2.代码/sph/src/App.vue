<template>
    <div id="app">
        <!-- Header区域 -->
        <Header></Header>

        <!-- 路由切换区域 -->
        <router-view></router-view>

        <!-- Footer区域 -->
        <Footer/>
    </div>
</template>

<script>
export default {
    name: 'App'
}
</script>

<style lang="less" scoped>
//   #app{
//     font-size:50px;
//     color:red;
//   }
</style>