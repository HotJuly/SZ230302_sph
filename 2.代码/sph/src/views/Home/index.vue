<template>
  <div class="home">

    <ListContainer/>

    <Floor :floor="floor" v-for="floor in floorList" :key="floor.id"/>
  </div>
</template>

<script>
import ListContainer from './components/ListContainer';
import Floor from './components/Floor';
export default {
  name: 'Home',
  data(){
    return{
      floorList:[]
    }
  },
  async mounted(){
    const floorList = await this.$API.home.reqFloor();
    this.floorList = floorList;
  },
  components:{
    ListContainer,
    Floor
  }
}
</script>

<style lang="less" scoped></style>