<template>
  <div id="app">
    <router-link to="/home">首页</router-link>
    <router-link to="/hot">热门</router-link>
    <router-link to="/like">经典</router-link>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

export default {
  name: 'App'
}
</script>

<style>
.content{
  border:1px solid;
  width:100%;
  height:400px;
  text-align: center;
}
</style>
