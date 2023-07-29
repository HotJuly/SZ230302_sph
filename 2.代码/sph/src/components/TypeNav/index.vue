<template>
    <div class="type-nav">
        <div class="container">
            <div class="nav-left" @mouseenter="handleEnter" @mouseleave="handleLeave">
                <h2 class="all">全部商品分类</h2>

                <transition enter-active-class="animate__fadeIn" leave-active-class="animate__fadeOut">
                    <div class="sort animate__animated" v-show="isShowSort">
                        <div class="all-sort-list2" @click.prevent="toSearch">
                            <div class="item" v-for="c1 in categoryList" :key="c1.categoryId">
                                <h3>
                                    <a href="" :data-id="c1.categoryId" data-level="1">{{ c1.categoryName }}</a>
                                </h3>
                                <div class="item-list clearfix">
                                    <div class="subitem" v-for="c2 in c1.categoryChild" :key="c2.categoryId">
                                        <dl class="fore">
                                            <dt>
                                                <a href="" :data-id="c2.categoryId" data-level="2">{{ c2.categoryName }}</a>
                                            </dt>
                                            <dd>
                                                <em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
                                                    <a href="" :data-id="c3.categoryId" data-level="3">{{ c3.categoryName
                                                    }}</a>
                                                </em>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
            <nav class="nav">
                <a href="###">服装城</a>
                <a href="###">美妆馆</a>
                <a href="###">尚品汇超市</a>
                <a href="###">全球购</a>
                <a href="###">闪购</a>
                <a href="###">团购</a>
                <a href="###">有趣</a>
                <a href="###">秒杀</a>
            </nav>
        </div>
    </div>
</template>

<script>
import 'animate.css';
import { mapState } from 'vuex';
export default {
    name: 'TypeNav',
    data() {
        return {
            // categoryList:[],
            // msg:123m
            isShowSort: this.$route.path === "/home"
        }
    },
    async mounted() {
        // const result = await this.$API.home.reqBaseCategoryList();
        // console.log(result)

        // this.categoryList=result;

        this.$store.dispatch('home/getCategoryList');
    },
    methods: {
        toSearch(event) {
            // 需要实现路由传参
            // 一共需要收集三个数据
            // 1.当前的分类id
            // 2.当前分类的级别
            // 3.当前分类的名称

            const { id, level } = event.target.dataset;
            // this.$router.push({
            //     path:"/search",
            //     query:{
            //         categoryName:event.target.innerText,
            //         id,
            //         level
            //     }
            // })


            // 出现了BUG,点击分类中的空白区域也会发生跳转
            // 解决方法:在跳转路由之前,需要对本次点击的内容进行角色区分
            // 满足条件:
            //  1.点击的必须是a标签才跳转

            // 获取到当前的目标元素
            // const target = event.target;

            // 对目标元素的身份进行区分,如果是a标签就跳转
            // if(target.matches('a')){
            if (id) {
                const key = `category${level}Id`;

                this.$router.push({
                    path: "/search",
                    query: {
                        // 在路径中,使用query传参的数据一共只有三大种
                        // 1.分类名称
                        // 2.分类id
                        // 3.关键字

                        // 分类的id属性名很有可能不一样,因为用户上次点击1级分类,这次可以点击2级分类,会出现同时保留两个分类id的效果
                        // 所以不要使用...this.$route.query
                        keyword:this.$route.query.keyword,
                        categoryName: event.target.innerText,
                        [key]: id
                    }
                })
            }
        },
        handleEnter() {
            this.isShowSort = true;
        },
        handleLeave() {
            // 其实鼠标移出的时候,也不一定是隐藏,也要看当前所在的页面
            this.isShowSort = this.$route.path === "/home";
        }
    },
    watch: {
        // msg(){
        // }
        "$route.path"(newVal, oldVal) {
            // watch回调函数,会接收到两个参数
            // 第一个是本次最新的数据,第二个是上一次的旧数据
            // if(newVal==="/home"){
            //     // 能进入这里,就说明正在首页
            //     this.isShowSort = true;
            // }else{
            //     this.isShowSort = false;
            // }

            this.isShowSort = newVal === "/home";
        }
    },
    computed: {
        // abc(){
        //     console.log('abc')
        //     return this.msg;
        // }

        // 获取到Vuex中state数据的第一种方法
        // categoryList(){
        //     return this.$store.state.home.categoryList;
        // },
        // 获取到Vuex中state数据的第二种方法,使用频率中等,因为它可以解决重名问题
        // ...mapState('home',{
        //     categoryList:"categoryList"
        // }),
        // 获取到Vuex中state数据的第三种方法,使用频率最高,因为它最方便
        ...mapState('home', ["categoryList"]),
    }
}
</script>

<style lang="less" scoped>
.type-nav {
    border-bottom: 2px solid #e1251b;

    .container {
        width: 1200px;
        margin: 0 auto;
        display: flex;
        position: relative;

        .all {
            width: 210px;
            height: 45px;
            background-color: #e1251b;
            line-height: 45px;
            text-align: center;
            color: #fff;
            font-size: 14px;
            font-weight: bold;
        }

        .nav {
            a {
                height: 45px;
                margin: 0 22px;
                line-height: 45px;
                font-size: 16px;
                color: #333;
            }
        }

        .sort {
            position: absolute;
            left: 0;
            top: 45px;
            width: 210px;
            height: 461px;
            position: absolute;
            background: #fafafa;
            z-index: 999;

            --animate-duration: 0.4s;

            .all-sort-list2 {
                .item {
                    h3 {
                        line-height: 30px;
                        font-size: 14px;
                        font-weight: 400;
                        overflow: hidden;
                        // padding: 0 20px;
                        margin: 0;

                        a {
                            color: #333;
                            display: block;
                            width: 100%;
                            height: 100%;
                            padding: 0 20px;
                        }
                    }

                    .item-list {
                        display: none;
                        position: absolute;
                        width: 734px;
                        min-height: 460px;
                        background: #f7f7f7;
                        left: 210px;
                        border: 1px solid #ddd;
                        top: 0;
                        z-index: 9999 !important;

                        .subitem {
                            float: left;
                            width: 650px;
                            padding: 0 4px 0 8px;

                            dl {
                                border-top: 1px solid #eee;
                                padding: 6px 0;
                                overflow: hidden;
                                zoom: 1;

                                &.fore {
                                    border-top: 0;
                                }

                                dt {
                                    float: left;
                                    width: 54px;
                                    line-height: 22px;
                                    text-align: right;
                                    padding: 3px 6px 0 0;
                                    font-weight: 700;
                                }

                                dd {
                                    float: left;
                                    width: 415px;
                                    padding: 3px 0 0;
                                    overflow: hidden;

                                    em {
                                        float: left;
                                        height: 14px;
                                        line-height: 14px;
                                        padding: 0 8px;
                                        margin-top: 5px;
                                        border-left: 1px solid #ccc;
                                    }
                                }
                            }
                        }
                    }

                    &:hover {
                        .item-list {
                            display: block;
                        }
                    }
                }
            }
        }
    }
}

/*TypeNav的样式*/
h3 {
    line-height: 30px;
    font-size: 14px;
    font-weight: 400;
    overflow: hidden;
    //   padding: 0 20px;
    margin: 0;

    &:hover {
        background-color: #e1251b;

        a {
            color: white!important;;
        }
    }

    a {
        color: #333;
    }
}

dd {
    /*********/
    width: 520px;
    /*********/
}

dt {
    /*********/
    width: 68px;
    /*********/
}

/*reset.css*/
/* 重置文本格式元素 */
a:link:hover {
    color: rgb(79, 76, 212) !important;
    text-decoration: none;
}
</style>