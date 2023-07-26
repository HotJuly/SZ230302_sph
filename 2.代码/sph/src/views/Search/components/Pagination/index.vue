<template>
    <div class="pagination">
        <!-- <button>上一页</button>
    <button>1</button>
    <span>···</span>
    
    <button>6</button>
    <button>7</button>
    <button class="active">8</button>    
    <button>9</button>
    <button>10</button>
    
    <span>···</span>
    <button>{{ totalPages }}</button>
    <button>下一页</button> -->

    <button 
    v-show="num>=startEnd.start&&num<=startEnd.end"
    :class="{
        active:pageNo === num
    }" v-for="num in 12" :key="num">{{ num }}</button>
    <span>共 {{ total }} 条</span>
    </div>
</template>

<script>
export default {
    name: "Pagination",
    props: ["total", "totalPages", 'pageNo','continues'],
    computed:{
        startEnd(){
            //通过pageNo以及continues来动态计算,当前需要连续显示的数字的开始和结束

            // 假设现在正在26页,连续的开始是24,连续的结束是28
            // 问题:你是怎么知道24和28的数字的?
            // 24 = 26 -2
            // start = pageNo - (continues - 1)/2;
            // end = pageNo + (continues - 1)/2

            const {pageNo,continues} = this;

            const start =  pageNo - (continues - 1)/2;

            const end = pageNo + (continues - 1)/2;

            // console.log(start,end)

            return {
                start,
                end
            }
        }
    }
};
</script>

<style lang="less" scoped>
.pagination {
    text-align: center;

    button {
        margin: 0 5px;
        background-color: #f4f4f5;
        color: gray;
        outline: none;
        border-radius: 2px;
        padding: 0 4px;
        vertical-align: top;
        display: inline-block;
        font-size: 13px;
        min-width: 35.5px;
        height: 28px;
        line-height: 28px;
        cursor: pointer;
        box-sizing: border-box;
        text-align: center;
        border: 0;

        &[disabled] {
            color: #c0c4cc;
            cursor: not-allowed;
        }

        &.active {
            cursor: not-allowed;
            background-color: #c81623;
            color: #fff;
        }
    }

    span {
        display: inline-block;
        line-height: 28px;
        font-size: 14px;
        color: gray;
        vertical-align: middle;
    }
}
</style>