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

        <!-- <button 
    v-show="num>=startEnd.start&&num<=startEnd.end"
    :class="{
        active:pageNo === num
    }" 
    v-for="num in 12" 
    :key="num">{{ num }}</button> -->


        <!-- 最新写法 -->
        <!-- 如果当前用户正处在第1页,就不应该能点击上一页 -->
        <button 
        :disabled="pageNo===1"
        @click="changePageNo(pageNo-1)"
        >上一页</button>

        <!-- 如果当前v-for遍历出来的是2开始,那么才显示这个按钮 -->
        <button 
        v-show="startEnd.start>=2"
        @click="changePageNo(1)"
        >1</button>

        <!-- 如果当前v-for的开始按钮,与1按钮之间,具有间隔数字才显示 -->
        <span v-show="startEnd.start>=3">···</span>

        <button 
        :class="{
            active: pageNo === index + startEnd.start
        }" 
        v-for="(num, index) in (startEnd.end - startEnd.start + 1)" 
        @click="changePageNo(index + startEnd.start)"
        :key="num"
        >{{ index + startEnd.start }}
        </button>


        <!-- 如果当前v-for的结束按钮,与最后一页的按钮之间具有间隔,就显示... -->
        <span v-show="totalPages - startEnd.end>=2">···</span>

        <!-- 如果当前v-for已经展示了最后一页的按钮,此处就不应该在显示一个 -->
        <button 
        v-show="startEnd.end!==totalPages"
        @click="changePageNo(totalPages)"
        >{{ totalPages }}</button>

        <!-- 如果当前正处在最后1页,就不能使用下一页按钮 -->
        <button 
        :disabled="pageNo===totalPages"
        @click="changePageNo(pageNo+1)"
        >下一页</button>

        <span>共 {{ total }} 条</span>
    </div>
</template>

<script>
export default {
    name: "Pagination",
    props: ["total", "totalPages", 'pageNo', 'continues'],
    computed: {
        startEnd() {
            //通过pageNo以及continues来动态计算,当前需要连续显示的数字的开始和结束

            // 假设现在正在26页,连续的开始是24,连续的结束是28
            // 问题:你是怎么知道24和28的数字的?
            // 24 = 26 -2
            // start = pageNo - (continues - 1)/2;
            // end = pageNo + (continues - 1)/2

            /*
                问题1:如果当前需要显示的连续页数,超过了数据的总页数,显示个数不对
                解决思路:应该要以总页数为准
                思路:
                    1.如何获取到需要显示的连续页数
                        通过this.continues可以知道

                    2.如何获取到数据的总页数?
                        通过this.totalPages可以知道

                    3.什么叫做超过了?
                        超过某个代表肯定具有数字操作的比较
                            a>b操作
                            this.continues>this.totalPages

                    4.如何控制遍历出来的总页数
                        可以通过start与end进行控制


                问题2:如果当前正在第1页,那么连续页数的第一个按钮会显示-1
                原因:是因为pageNo为1,而continues为5,那么计算得到的start就是-1

                解决思路:如果当前正在第1页,那么start应该为1
            */

            const { pageNo, continues, totalPages } = this;
            let start;
            let end;

            if (continues > totalPages) {
                // 能进入这里说明总页数不足以满足连续显示的要求
                // 所以所有页面应该全部展示
                // start为多少,end为多少
                // 此时start为1,end为totalPages
                start = 1;

                end = totalPages

            } else {
                // 当前总页数满足甚至超过连续显示的要求

                start = pageNo - (continues - 1) / 2;

                end = pageNo + (continues - 1) / 2;

                // 如果开始页数小于1,就从第1页开始显示,显示到第5页结束
                if (start < 1) {
                    start = 1;
                    end = continues;
                }

                // 如果结束页数大于总页数,就从显示到总页数为止
                if (end > totalPages) {
                    end = totalPages;
                    start = totalPages - continues + 1
                }
            }

            return {
                start,
                end
            }
        },
    },
    methods: {
        changePageNo(currentPageNo) {
            this.$emit('update:pageNo', currentPageNo)
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