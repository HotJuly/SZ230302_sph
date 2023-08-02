<template>
  <h1>
    <el-button type="primary">主要按钮</el-button>
  </h1>
</template>

<script>
import { Button } from 'element-ui';
export default {
  name: 'Test',
  async mounted() {
  },
  components:{
    [Button.name]:Button
  }
}
</script>

<style lang="less" scoped></style>