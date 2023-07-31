<template>
  <swiper class="swiper-container" :options="swiperOptions">

    <swiper-slide v-for="image in imageList" :key="image.id" class="swiper-slide">
      <img :class="{
        active: image.imgUrl === selectedImgUrl
      }" @click="changeBigImage(image.imgUrl)" :src="image.imgUrl">
    </swiper-slide>


    <div class="swiper-button-next" slot="button-next"></div>
    <div class="swiper-button-prev" slot="button-prev"></div>
  </swiper>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import 'swiper/css/swiper.css';
export default {
  name: "ImageList",
  props: ["imageList", "skuDefaultImg"],
  data() {
    // data函数只会在beforeCreate到created之间才会执行
    // 而首次挂载Detail组件的时候,detail组件还没有数据,所以传下来的skuDefaultImg是undefined
    // 所以data函数执行的时候,会将selectedImgUrl的值也修改为undefined
    // 然而当Detail组件请求成功之后,detail的数据发生变化,就会update(更新)Detail组件
    // 此时子组件也会更新，但是更新阶段不会在执行data函数了
    // 所以props接收到的skuDefaultImg内部有图片链接,但是selectedImgUrl中没有
    return {
      // 当前data属性的值,等于接收到的props数据的值
      // 但是需要注意,挂载阶段的时候props到底有没有数据
      // selectedImgUrl:this.skuDefaultImg,
      selectedImgUrl: "",
      swiperOptions: {
        slidesPerView: "auto",
        spaceBetween: 10,
        allowTouchMove: false,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      }
    }
  },
  // 因为updated可以监视当前组件所有的数据变化
  // 像是集体监视,他不针对于某个响应式数据,只要组件中的任何一个响应式属性变化,他就会执行
  // updated(){
  //   this.selectedImgUrl = this.skuDefaultImg;
  // },
  watch: {
    skuDefaultImg(newVal) {
      this.selectedImgUrl = newVal;
    }
  },
  methods: {
    changeBigImage(url) {
      // console.log(url)
      this.selectedImgUrl = url;
      this.$bus.$emit('sendImgUrl', url)
    }
  },
  components: {
    Swiper,
    SwiperSlide
  },
}
</script>

<style lang="less" scoped>
.swiper-container {
  height: 56px;
  width: 402px;
  box-sizing: border-box;
  padding: 0 12px;

  .swiper-slide {
    width: 56px;
    height: 56px;

    img {
      width: 100%;
      height: 100%;
      border: 1px solid #ccc;
      padding: 2px;
      width: 50px;
      height: 50px;
      display: block;

      &.active {
        border: 2px solid #f60;
        padding: 1px;
      }

      &:hover {
        border: 2px solid #f60;
        padding: 1px;
      }
    }
  }

  .swiper-button-next {
    left: auto;
    right: 0;
  }

  .swiper-button-prev {
    left: 0;
    right: auto;
  }

  .swiper-button-next,
  .swiper-button-prev {
    box-sizing: border-box;
    width: 12px;
    height: 56px;
    background: rgb(235, 235, 235);
    border: 1px solid rgb(204, 204, 204);
    top: 0;
    margin-top: 0;

    &::after {
      font-size: 12px;
    }
  }
}

.active {
  border: 2px solid #f60;
  padding: 1px;
}
</style>