<template>
  <h1>
    <h1>pageX:{{ pageX }}</h1>
    <h1>pageY!!!!!!!!!!!!!!!!!!!!!!!!!!!!!:{{ pageY }}</h1>
  </h1>
</template>

<script>
import moveMixin from '@/mixins/moveMixin.js';
export default {
  name: 'Test',
  data(){
    return{
      pageX:-1
    }
  },
  mixins:[moveMixin]
}
</script>

<style lang="less" scoped></style>