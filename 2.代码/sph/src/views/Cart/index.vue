<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul class="cart-list" v-for="(good,index) in cartList" :key="good.id">
          <li class="cart-list-con1">
            <input :checked="good.isChecked" type="checkbox" name="chk_list" @change="changeCheck(good)">
          </li>
          <li class="cart-list-con2">
            <img :src="good.imgUrl">
            <div class="item-msg">{{ good.skuName }}</div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{ good.skuPrice }}</span>
          </li>
          <li class="cart-list-con5">
            <a href="javascript:void(0)" class="mins">-</a>
            <input autocomplete="off" type="text" :value="good.skuNum" minnum="1" class="itxt">
            <a href="javascript:void(0)" class="plus">+</a>
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{ good.skuPrice * good.skuNum }}</span>
          </li>
          <li class="cart-list-con7">
            <a class="sindelet" @click="deleteGood(good,index)">删除</a>
            <br>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <!-- <input :checked="isAllSelected" class="chooseAll" type="checkbox" @change="changeAllSelect"> -->
        <input v-model="isAllSelected" class="chooseAll" type="checkbox">
        <span>全选</span>
      </div>
      <div class="option">
        <a @click="deleteGoods">删除选中的商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择
          <span>0</span>件商品
        </div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">0</i>
        </div>
        <div class="sumbtn">
          <a class="sum-btn" href="###" target="_blank">结算</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShopCart',
  data() {
    return {
      cartList: []
    }
  },
  async created() {
    const result = await this.$API.cart.reqCartList();
    // console.log(result)
    this.cartList = result[0].cartInfoList;
  },
  methods: {
    changeCheck(good) {

      // 1.用于控制当前页面的展示效果,让用户可以观察到自己做的操作效果
      good.isChecked = Number(!good.isChecked)
      // good.isChecked = good.isChecked?0:1;

      // 注意,购物车中用到的商品id,全是sourceId
      // 2.用于发送请求,控制服务器的数据进行选中状态的变更
      this.$API.cart.reqChangeCheck(good.sourceId, good.isChecked);
    },
    changeAllSelect() {
      const flag = Number(!this.isAllSelected);
      // console.log(flag)

      // 1.用于将购物车中所有的商品改变选中状态,但是只是前端内存中的操作,并没有影响到服务器
      const idList = this.cartList.map((good) => {
        good.isChecked = flag;
        return good.sourceId;
      })

      //2.发送请求告知服务器,本次所有商品的改变状态
      this.$API.cart.reqChangeAllSelected(flag, idList)
    },
    deleteGood(good,index){
      const id = good.sourceId;

      this.cartList.splice(index,1);

      this.$API.cart.reqDeleteGood(id);
    },
    deleteGoods(){
      // 通过reduce方法,来统计当前已选中的商品的id
      // 由于cartList和产生idList长度不一定一样,所以排除使用map
      // 由于cartList和产生idList内部存储的数据类型也不一样,所以排除使用filter
      const idList = this.cartList.reduce((pre,good)=>{
        if(good.isChecked){
          // 能进入这里说明当前遍历得到的商品是已选中的,也就是说要删除的
          pre.push(good.sourceId);
        }
        return pre;
      },[]);

      // 发送请求告知服务器哪些需要删除
      this.$API.cart.reqDeleteGoods(idList);

      // 通过filter方法,对内存中存储的商品进行过滤,重新赋值给data数据,导致页面重新渲染
      // 更新出最新结果
      this.cartList = this.cartList.filter((good)=>{
        return !good.isChecked
      });
      
    }
  },
  computed: {
    // isAllSelected(){
    //   /*
    //     需求:
    //       1.如果当前购物车中所有商品都是选中状态,那么全选按钮就是选中状态
    //       2.如果购物车中有至少一个商品是未选中状态,那么全选按钮就是未选中状态
    //       3.如果购物车中没有商品,那么全选按钮就是未选中状态

    //     返回值:布尔值
    //       由于全选按钮只有两种情况,所以布尔值类型的数据是最好使用的
    //   */
    //  if(!this.cartList.length)return false;
    //  const result = this.cartList.every((good)=>{
    //   return good.isChecked
    //  })

    //  return result;
    // },
    isAllSelected: {
      get() {
        // 如果代码想要读取当前计算属性的结果,就会执行get方法
        // 例如:在模版中展示该数据,在js中,this.isAllSelected使用也算读取

        if (!this.cartList.length) return false;
        const result = this.cartList.every((good) => {
          return good.isChecked
        })

        return result;
      },
      set(newVal) {
        // 如果代码中对当前计算属性进行赋值操作,就会执行set方法
        // const flag = Number(!this.isAllSelected);

        const flag =  Number(newVal);
        // 1.用于将购物车中所有的商品改变选中状态,但是只是前端内存中的操作,并没有影响到服务器
        const idList = this.cartList.map((good) => {
          good.isChecked = flag;
          return good.sourceId;
        })

        //2.发送请求告知服务器,本次所有商品的改变状态
        this.$API.cart.reqChangeAllSelected(flag, idList)
      }
    }
  }
}

</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      &>div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        &>li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con4 {
          width: 10%;
        }

        .cart-list-con5 {
          width: 17%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
            text-decoration: none;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 31px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
            text-decoration: none;
          }
        }

        .cart-list-con6 {
          width: 10%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }


      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
          text-decoration: none;

          &hover {
            color: white !important;
          }
        }
      }
    }
  }
}
</style>