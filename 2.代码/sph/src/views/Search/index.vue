<template>
  <h1>
    Search
  </h1>
</template>

<script>
  export default {
    name:'Search',
    mounted(){
      console.log(this.$route.query)
    }
  }
</script>

<style lang="less" scoped>
  
</style>