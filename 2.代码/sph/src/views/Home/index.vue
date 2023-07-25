<template>
  <div class="home">

    <ListContainer/>

    <Recommend/>

    <Rank/>

    <Like/>

    <Floor :floor="floor" v-for="floor in floorList" :key="floor.id"/>

    <Brand/>
  </div>
</template>

<script>
import ListContainer from './components/ListContainer';
import Floor from './components/Floor';
import Brand from './components/Brand';
import Like from './components/Like';
import Rank from './components/Rank';
import Recommend from './components/Recommend';
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
    Floor,
    Brand,
    Like,
    Rank,
    Recommend
  }
}
</script>

<style lang="less" scoped></style>