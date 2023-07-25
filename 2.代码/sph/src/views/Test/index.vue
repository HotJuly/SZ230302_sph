<template>
  <h1>
    Test
  </h1>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Test',
  async mounted() {
    const result = await axios.get('http://www.baidu.com/slide');
    console.log('result',result)
  }
}
</script>

<style lang="less" scoped></style>