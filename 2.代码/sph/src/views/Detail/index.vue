<template>
  <div class="detail">

    <!-- 主要内容区域 -->
    <section class="con">
      <!-- 导航路径区域 -->
      <div class="conPoin">
        <span v-for="num in 3" :key="num">
          {{ categoryView[`category${num}Name`] }}
        </span>
      </div>
      <!-- 主要内容区域 -->
      <div class="mainCon">
        <!-- 左侧放大镜区域 -->
        <div class="previewWrap">
          <!--放大镜效果-->
          <Zoom :skuDefaultImg="skuInfo.skuDefaultImg" />
          <!-- 小图列表 -->
          <ImageList :skuDefaultImg="skuInfo.skuDefaultImg" :imageList="skuInfo.skuImageList" />
        </div>
        <!-- 右侧选择区域布局 -->
        <div class="InfoWrap">
          <div class="goodsDetail">
            <h3 class="InfoName">{{ skuInfo.skuName }}</h3>
            <p class="news">推荐选择下方[移动优惠购],手机套餐齐搞定,不用换号,每月还有花费返</p>
            <div class="priceArea">
              <div class="priceArea1">
                <div class="title">价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格</div>
                <div class="price">
                  <i>¥</i>
                  <em>{{ skuInfo.price }}</em>
                </div>
              </div>
            </div>
          </div>

          <div class="choose">
            <div class="chooseArea">
              <div class="choosed"></div>
              <dl v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id">
                <dt class="title">选择{{ saleAttr.saleAttrName }}</dt>
                <dd :class="{
                  active: attrValue.isChecked === '1'
                }" v-for="attrValue in saleAttr.spuSaleAttrValueList" @click="checkAttrValue(saleAttr, attrValue)"
                  :key="attrValue.id">
                  {{ attrValue.saleAttrValueName }}</dd>
              </dl>
            </div>
            <div class="cartWrap">
              <div class="controls">
                <input :value="goodNum" @change="changeGoodNum('input', $event)" autocomplete="off" class="itxt">
                <a @click="changeGoodNum('add')" href="javascript:" class="plus">+</a>
                <a @click="changeGoodNum('sub')" href="javascript:" class="mins">-</a>
              </div>
              <div class="add">
                <a href="javascript:" @click="addCart">加入购物车</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
import ImageList from './components/ImageList/ImageList'
import Zoom from './components/Zoom/Zoom'
import { goodNumReg } from '@/utils/reg';

export default {
  name: 'Detail',
  // 我们书写的mounted和created不是生命周期
  // 我们写的是生命周期钩子函数,我们可以通过钩子函数决定在这一瞬间要做什么,
  // 但是我们没法决定组件有没有这一瞬间
  // 这些生命周期都是一个很特殊的时间点,说明在这些生命周期之前一定做了一些很特殊的事情
  /*
    beforeCreate之前,Vue初始化事件和生命周期
    beforeCreate之后created之前,Vue正在初始化数据注入和数据响应式
      数据注入:
        指的是将一些数据输入到this身上,方便开发者使用,例如:
          1.data中的数据(数据代理)
          2.props中的数据
          3.methods中的函数
          4.computed中的计算属性
          5.provide和inject传递的数据
            ...
  
      数据响应式(数据劫持):
        其实就是将data返回的所有属性进行数据劫持,变成响应式属性

      created和mounted都可以发送请求,那么区别呢?
      回答:
        1.速度方面,created早于mounted执行
          请求是越早出去越早回来,所以其实在工作中很多人都会在created发请求
          因为js引擎是单线程解析代码的,所以created执行时机比mounted更早

        2.mounted比created更稳
          因为mounted钩子函数执行的时候,所有的操作都已经结束了,节点也已经挂载结束
            所以没有什么是这个时候不能做

          而created内部不能操作真实DOM,因为还没有挂载

        注意:千万不要在created中做大量的逻辑操作,因为js引擎会单线程解析代码
            如果在created阻塞10秒,后续页面的挂载也会慢10秒
        
  */
  data() {
    return {
      // 用于存储当前商品的三级分类信息
      categoryView: {},
      // 用于存储当前商品的相关信息
      skuInfo: {},
      // 用于存储当前商品可选的销售属性,通过不同的销售属性组合可以得到另外一个兄弟商品
      spuSaleAttrList: [],

      // 用于存储当前这个商品所有的细化商品id
      skuIds: {},

      goodNum: 1,

      id: null
    }
  },
  async created() {
    this.id = this.$route.params.id;

    this.reqSkuInfo();

    // console.log(this.categoryView)
  },
  mounted() {
  },
  methods: {
    changeGoodNum(type, event) {
      /*
        目前想要触发这个回调函数,有三种手段
          1.通过input框修改触发
          2.通过点击+号按钮触发

          3.通过点击-号按钮触发
      */
      if (type === "add") {
        // 200是我们开发者设定的默认库存
        if (this.goodNum < 200) {
          this.goodNum += 1;
        }
      } else if (type === "sub") {

        if (this.goodNum > 1) {
          this.goodNum -= 1;
        }

      } else {
        // 能进入这里,说明用户是通过输入框触发的事件
        // 那么就需要获取到输入框中的内容,然后进行赋值操作
        /*
          注意:用户输入的数据需要经过校验才会赋值
            要求:
              1.必须是数字
              2.数字必须大于等于1
              3.数字必须小于等于200
        
          注意:此时出现了一个BUG
            1.Vue更新数据是同步的,而且如果多次更新的数据相同,页面不会渲染多次
        */


        const result = event.target.value * 1;
        if (goodNumReg.test(result)) {
          this.goodNum = result;
        } else if (result > 200) {
          this.goodNum = 200;
          // 上述代码等同于以下两行

          // 该行代码的目的,是为了防止Vue没有更新页面,所以我们自己主动更新
          // event.target.value = 200;

          // 该行代码的目的,是为了更新Vue的响应式属性,让他帮我们更新页面,但是有可能会不更新页面
          // 因为,如果上次的数据与本次赋值的相同,那么本次就不会更新页面
          // this.goodNum = event.target.value;
          /*
            Object.defineProperty(data,"goodNum",{
              get(){},
              set(newVal){
                if(newVal===val){
                  return;
                }

                val = newVal;

                dep.notify();
              }
            })
          
          
          */
        } else {
          this.goodNum = event.target.value = 1;
        }
      }
    },
    checkAttrValue(saleAttr, attrValue) {
      // console.log(attrValue)
      // /此处实现排他效果,也就是先将当前分类,所有的选项都变为未选中状态,再将点击的改为选中
      let oldSelected;
      saleAttr.spuSaleAttrValueList.forEach((saleAttrValue) => {
        if (saleAttrValue.isChecked === '1') {
          oldSelected = saleAttrValue;
        }
        saleAttrValue.isChecked = '0';
      })
      // 只要用户点击触发该回调函数,就说明用户想要选中该属性
      attrValue.isChecked = '1';

      /*
        想要通过遍历所有的销售属性数组,来得到当前用户选中的所有的销售属性
        返回值的意思:获取到所有已选中的销售属性对象组合而成的数组
        返回值的数据类型:Array
          数组的长度与原先的数组长度相同
            原来有两个销售属性的大类,而我们想要的是两个选中的销售属性的值
      */
      const result = this.spuSaleAttrList.map((saleAttr) => {
        const checkedValue = saleAttr.spuSaleAttrValueList.find((value) => {
          return value.isChecked === '1'
        })
        return checkedValue;
      });

      /*
        通过遍历得到的已选中属性对象组成的数组,得到他们id累加的属性名
        返回值:id组成的属性名
        返回值数据类型:string
      */
      let key = result.reduce((pre, item) => {
        // 通过return来返回本次处理完的数据,给下次执行回调函数使用
        const id = item.id;
        // console.log(id)
        return pre + "|" + id;
      }, "")
      key = key.substring(1);

      const newGoodId = this.skuIds[key];
      // console.log(newGoodId)


      if (!newGoodId) {
        alert(`您选购的商品,暂时没有库存,请挑选其他的商品`);
        // 此处就是将用户新选得属性改为未选中,将之前的选中的重新改为选中状态
        attrValue.isChecked = "0";
        oldSelected.isChecked = '1';
        return;
      }

      // 如果有该商品,就发送请求,没有就重置选择条件
      this.id = newGoodId;

      this.reqSkuInfo();
    },
    async reqSkuInfo() {

      const { categoryView: categoryView, skuInfo, spuSaleAttrList, valuesSkuJson } = await this.$API.detail.reqDetailInfo(this.id);
      // console.log(result)
      this.categoryView = categoryView;
      this.skuInfo = skuInfo;
      this.spuSaleAttrList = spuSaleAttrList;

      this.skuIds = JSON.parse(valuesSkuJson);
    },
    addCart(){
      this.$router.push('/addsuccess')
    }
  },
  components: {
    ImageList,
    Zoom
  }
}
</script>

<style lang="less" scoped>
.detail {
  .con {
    width: 1200px;
    margin: 15px auto 0;

    .conPoin {
      padding: 9px 15px 9px 0;

      &>span+span:before {
        content: "/\00a0";
        padding: 0 5px;
        color: #ccc;
      }
    }

    .mainCon {
      overflow: hidden;
      margin: 5px 0 15px;

      .previewWrap {
        float: left;
        width: 400px;
        position: relative;
      }

      .InfoWrap {
        width: 700px;
        float: right;

        .InfoName {
          font-size: 14px;
          line-height: 21px;
          margin-top: 15px;
        }

        .news {
          color: #e12228;
          margin-top: 15px;
        }

        .priceArea {
          background: #fee9eb;
          padding: 7px;
          margin: 13px 0;

          .priceArea1 {
            overflow: hidden;
            line-height: 28px;
            margin-top: 10px;

            .title {
              float: left;
              margin-right: 15px;
            }

            .price {
              float: left;
              color: #c81623;

              i {
                font-size: 16px;
              }

              em {
                font-size: 24px;
                font-weight: 700;
              }

              span {
                font-size: 12px;
              }
            }

            .remark {
              float: right;
            }
          }

          .priceArea2 {
            overflow: hidden;
            line-height: 28px;
            margin-top: 10px;

            .title {
              margin-right: 15px;
              float: left;
            }

            .fixWidth {
              width: 520px;
              float: left;

              .red-bg {
                background: #c81623;
                color: #fff;
                padding: 3px;
              }

              .t-gray {
                color: #999;
              }
            }
          }


        }

        .support {
          border-bottom: 1px solid #ededed;
          padding-bottom: 5px;

          .supportArea {
            overflow: hidden;
            line-height: 28px;
            margin-top: 10px;

            .title {
              margin-right: 15px;
              float: left;
            }

            .fixWidth {
              width: 520px;
              float: left;
              color: #999;
            }
          }
        }

        .choose {
          .chooseArea {
            overflow: hidden;
            line-height: 28px;
            margin-top: 10px;

            dl {
              overflow: hidden;
              margin: 13px 0;

              dt {
                margin-right: 15px;
                float: left;
              }

              dd {
                float: left;
                margin-right: 5px;
                color: #666;
                line-height: 24px;
                padding: 2px 14px;
                border-top: 1px solid #eee;
                border-right: 1px solid #bbb;
                border-bottom: 1px solid #bbb;
                border-left: 1px solid #eee;

                &.active {
                  color: green;
                  border: 1px solid green;
                }
              }
            }
          }

          .cartWrap {
            .controls {
              width: 48px;
              position: relative;
              float: left;
              margin-right: 15px;

              .itxt {
                width: 38px;
                height: 37px;
                border: 1px solid #ddd;
                color: #555;
                float: left;
                border-right: 0;
                text-align: center;
              }

              .plus,
              .mins {
                width: 15px;
                text-align: center;
                height: 17px;
                line-height: 17px;
                background: #f1f1f1;
                color: #666;
                position: absolute;
                right: -8px;
                border: 1px solid #ccc;
              }

              .mins {
                right: -8px;
                top: 19px;
                border-top: 0;
              }

              .plus {
                right: -8px;
              }
            }

            .add {
              float: left;

              a {
                background-color: #e1251b;
                padding: 0 25px;
                font-size: 16px;
                color: #fff;
                height: 36px;
                line-height: 36px;
                display: block;
              }
            }
          }
        }
      }
    }
  }

  .product-detail {
    width: 1200px;
    margin: 30px auto 0;
    overflow: hidden;

    .aside {
      width: 210px;
      float: left;
      border: 1px solid #ccc;

      .tabWraped {
        height: 40px;

        h4 {
          border-top: 3px solid #fff;
          float: left;
          line-height: 37px;
          width: 105px;
          text-align: center;
          border-bottom: 1px solid #ccc;

          &.active {
            border-top: 3px solid #e1251b;
            border-bottom: 0;
            font-weight: normal;
          }
        }
      }

      .tabContent {
        padding: 10px;

        .tab-pane {
          display: none;

          &.active {
            display: block;
          }

          &:nth-child(1) {
            .partList {
              overflow: hidden;

              li {
                width: 50%;
                float: left;
                border-bottom: 1px dashed #ededed;
                line-height: 28px;
              }
            }

            .goodsList {
              &>li {
                margin: 5px 0 15px;
                border-bottom: 1px solid #ededed;
                padding-bottom: 5px;

                .list-wrap {
                  .p-img {
                    text-align: center;

                    img {
                      width: 152px;
                    }
                  }

                  .price {
                    font-size: 16px;
                    color: #c81623;
                  }

                  .operate {
                    text-align: center;
                    margin: 5px 0;

                    a {
                      background-color: transparent;
                      border: 1px solid #8c8c8c;
                      color: #8c8c8c;
                      display: inline-block;
                      padding: 2px 14px;
                      line-height: 18px;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    .detail {
      width: 980px;
      float: right;

      .fitting {
        border: 1px solid #ddd;
        margin-bottom: 15px;

        .kt {
          border-bottom: 1px solid #ddd;
          background: #f1f1f1;
          color: #333;
          padding: 5px 0 5px 15px;
        }

        .good-suits {
          height: 170px;
          padding-top: 10px;

          .master {
            width: 127px;
            height: 165px;
            text-align: center;
            position: relative;
            float: left;

            img {
              width: 87px;
            }

            p {
              color: #c81623;
              font-size: 16px;
              font-weight: 700;
            }

            i {
              position: absolute;
              top: 48px;
              right: -25px;
              font-size: 16px;
            }
          }

          .suits {
            width: 668px;
            height: 165px;
            float: left;

            .suitsItem {
              float: left;
              width: 127px;
              padding: 0 20px;
              text-align: center;

              img {
                width: 120px;
                height: 130px;
              }

              p {
                font-size: 12px;
              }

              label {
                display: block;
                position: relative;

                input {
                  vertical-align: middle;
                }

                span {
                  vertical-align: middle;
                }
              }
            }
          }

          .result {
            border-left: 1px solid #ddd;
            width: 153px;
            height: 165px;
            padding-left: 20px;
            float: left;

            .num {
              font-size: 14px;
              margin-bottom: 10px;
              margin-top: 10px;
            }

            .price-tit {
              font-weight: bold;
              margin-bottom: 10px;
            }

            .price {
              color: #B1191A;
              font-size: 16px;
              margin-bottom: 10px;
            }

            .addshopcar {
              background-color: #e1251b;
              border: 1px solid #e1251b;
              padding: 10px 25px;
              font-size: 16px;
              color: #fff;
              display: inline-block;
              box-sizing: border-box;
            }
          }
        }
      }

      .intro {
        .tab-wraped {
          background: #ededed;
          // border: 1px solid #ddd;
          overflow: hidden;

          li {
            float: left;

            &+li>a {
              border-left: 1px solid #ddd;
            }

            &.active {
              a {
                // border: 0;
                background: #e1251b;
                color: #fff;
              }
            }

            a {
              display: block;
              height: 40px;
              line-height: 40px;
              padding: 0 11px;
              text-align: center;
              color: #666;
              background: #fcfcfc;
              border-top: 1px solid #ddd;
              border-bottom: 1px solid #ddd;
            }
          }
        }

        .tab-content {
          .tab-pane {
            display: none;

            &.active {
              display: block;
            }

            &:nth-child(1) {
              .goods-intro {
                padding-left: 10px;

                li {
                  margin: 10px 0;
                }
              }

              .intro-detail {
                img {
                  width: 100%;
                }
              }
            }
          }

        }
      }
    }
  }
}
</style>