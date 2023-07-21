<template>
  <h1>
    Test
  </h1>
</template>

<script>
import request from '@/utils/request.js';
export default {
  name: 'Test',
  async mounted() {
    // axios发送请求,会返回一个promise对象,如果请求成功那么这个对象就会变为成功状态
    /*
      await的作用
        1.阻塞后续代码执行
          只要await右侧的promise对象是pending,那么后续代码就暂时不会执行

        2.await表达式的返回值
          他会将右侧promise的结果值作为表达式本身的返回值进行返回
          简单来说,就是将axios请求到的数据,直接返回给左侧变量存储
    
    */
    const result = await request.get('/api/product/getBaseCategoryList');
    console.log('result', result);
  }
}
</script>

<style lang="less" scoped></style>