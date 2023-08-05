<template>
    <div>
        <img :src="url" alt="" srcset="">
        <el-image v-show="false" ref="image" style="width: 100px; height: 100px" :src="url" :preview-src-list="srcList">
        </el-image>
        <!-- <button @click="handler">点我放大</button> -->
        <slot name="content" :click="handler"></slot>
    </div>
</template>

<script>
export default {
    name: 'BigImage',
    props:["url","srcList"],
    methods:{
        handler(){
            this.$refs.image.clickHandler();
        }
    }
}
</script>

<style lang="less" scoped></style>