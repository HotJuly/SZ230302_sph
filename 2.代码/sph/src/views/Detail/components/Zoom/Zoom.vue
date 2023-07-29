<template>
  <div class="spec-preview">
    <!-- <img src="../../images/s1.png" />
    <div class="event"></div>
    <div class="big">
      <img src="../../images/s1.png" />
    </div>
    <div class="mask"></div> -->

    <vue-photo-zoom-pro :high-url="newImgUrl||skuDefaultImg" :out-zoomer="true" :width="200" :height="200">
      <img :src="newImgUrl||skuDefaultImg" style="width:400px;height:400px;" />
    </vue-photo-zoom-pro>
  </div>
</template>

<script>
import VuePhotoZoomPro from 'vue-photo-zoom-pro'
import 'vue-photo-zoom-pro/dist/style/vue-photo-zoom-pro.css'
export default {
  name: "Zoom",
  data(){
    return{
      newImgUrl:""
    }
  },
  props: ['skuDefaultImg'],
  components: {
    VuePhotoZoomPro
  },
  mounted(){
    this.$bus.$on('sendImgUrl',(imgUrl)=>{
      // console.log('sendImgUrl',imgUrl)
      this.newImgUrl = imgUrl;
    })
  }
}
</script>

<style lang="less">
.spec-preview {
  position: relative;
  width: 400px;
  height: 400px;
  border: 1px solid #ccc;

  img {
    width: 100%;
    height: 100%;
  }

  .zoomer {
    z-index: 9;
  }

  .selector {
    background-color: rgba(255, 0, 0, 0.327);
  }
}

.zoomer {
  z-index: 5;
  top: 0 !important;
  left: 10px !important;
}
</style>