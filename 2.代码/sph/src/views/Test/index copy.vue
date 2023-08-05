<template>
  <h1>
    <!-- <el-button type="primary">主要按钮</el-button> -->
    <BigImage :url="url" :srcList="srcList">
      <template #content="listeners">
        <!-- <h1 @click="scope.click">点我放大</h1> -->
        <h1 v-on="listeners">点我放大</h1>
      </template>
    </BigImage>
  </h1>
</template>

<script>
import BigImage from '@/views/Test/components/BigImage'
export default {
  name: 'Test',
    data() {
        return {
            url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
            srcList: [
                'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
                'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
            ]
        }
    },
  components: {
    BigImage
  }
}
</script>

<style lang="less" scoped></style>