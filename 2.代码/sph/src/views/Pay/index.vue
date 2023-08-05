<template>
  <div class="pay-main">
    <div class="pay-container">
      <div class="checkout-tit">
        <h4 class="tit-txt">
          <span class="success-icon"></span>
          <span class="success-info">订单提交成功，请您及时付款，以便尽快为您发货~~</span>
        </h4>
        <div class="paymark">
          <span class="fl">请您在提交订单<em class="orange time">4小时</em>之内完成支付，超时订单会自动取消。订单号：<em>{{ orderId }}</em></span>
          <span class="fr"><em class="lead">应付金额：</em><em class="orange money">￥{{ payInfo.totalFee }}</em></span>
        </div>
      </div>
      <div class="checkout-info">
        <h4>重要说明：</h4>
        <ol>
          <li>尚品汇商城支付平台目前支持<span class="zfb">支付宝</span>支付方式。</li>
          <li>其它支付渠道正在调试中，敬请期待。</li>
          <li>为了保证您的购物支付流程顺利完成，请保存以下支付宝信息。</li>
        </ol>
        <h4>支付宝账户信息：（很重要，<span class="save">请保存！！！</span>）</h4>
        <ul>
          <li>支付帐号：11111111</li>
          <li>密码：111111</li>
          <li>支付密码：111111</li>
        </ul>
      </div>
      <div class="checkout-steps">
        <div class="step-tit">
          <h5>支付平台</h5>
        </div>
        <div class="step-cont">
          <ul class="payType">
            <li><img src="./images/pay3.jpg"></li>
          </ul>

        </div>
        <div class="hr"></div>

        <div class="submit">
          <a class="btn" @click="pay">立即支付</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode';
export default {
  name: 'Pay',
  data() {
    return {
      orderId: null,
      payInfo: {}
    }
  },
  async mounted() {
    // console.log(this.$route.query.orderId)
    this.orderId = this.$route.query.orderId;

    const result = await this.$API.pay.reqCreateNative(this.orderId);
    // console.log(result)
    this.payInfo = result;
  },
  methods: {
    async pay() {
      // 给他一个链接,他会还你一个链接
      // toDataURL方法会返回一个promise对象,其中真正有用的是结果值,所以使用await接收
      const result = await QRCode.toDataURL(this.payInfo.codeUrl);
      // console.log(result)

      const htmlStr = `<img src="${result}" style="width:200px"/>`
      // 弹窗的具体配置
      const options = {
        dangerouslyUseHTMLString: true,
        center: true,
        showClose: false,
        showCancelButton: true,
        cancelButtonText: '支付遇到问题',
        confirmButtonText: '已完成支付',
      }
      // 弹起来！
      this.$alert(htmlStr, '微信扫码支付', {
        ...options,
        callback: () => {
          
          this.$message.warning('兄弟,钱还没付,别跑!!!!');
          this.ws.close();
          clearInterval(this.timer);
        }
      });

      // 此时用户就能看到二维码,那么就可以开始发送请求,请求当前的支付状态
      const token = this.$store.state.user.token;

      // 1.创建ws实例对象
      this.ws = new WebSocket(
        `ws://localhost:3000/api/payment/weixin/queryPayStatus?orderId=${this.orderId}&&token=${token}`
      );

      // 2.给ws对象绑定message事件,用于监视后端返回的数据
      this.ws.onmessage=(e)=>{
        /* 
          data中具有一共具有2个属性,分别是
            type
              type一共具有三个值:1,2,3
                1->建立连接成功
                2->支付成功
                3->还未支付
            data
              内部一般书写的是一些信息,不重要
        */
        const {type,data} = JSON.parse(e.data)
        // console.log(data)
        if(type===1){
          console.log(data)
          return;
        }

        if(type===2){
          console.log(data)

          this.$msgbox.close();
          this.$message.success('支付成功');

          // 支付成功之后,自动关闭当前ws通道,降低前后端压力
          this.ws.close();

          // 支付成功之后,自动关闭心跳请求
          clearInterval(this.timer);
          return;
        }

        if(type===3){
          console.log(data)
          return;
        }
      }

      this.ws.onclose = function(){
        console.log('close')
      }

      // 使用心跳请求,每隔一段时间就请求一次服务器,来检测网络是否通畅
      this.timer = setInterval(()=>{
        this.ws.send('reqPayStatus');
      },5000)
    },
    // async pay() {
    //   // 给他一个链接,他会还你一个链接
    //   // toDataURL方法会返回一个promise对象,其中真正有用的是结果值,所以使用await接收
    //   const result = await QRCode.toDataURL(this.payInfo.codeUrl);
    //   // console.log(result)

    //   const htmlStr = `<img src="${result}" style="width:200px"/>`
    //   // 弹窗的具体配置
    //   const options = {
    //     dangerouslyUseHTMLString: true,
    //     center: true,
    //     showClose: false,
    //     showCancelButton: true,
    //     cancelButtonText: '支付遇到问题',
    //     confirmButtonText: '已完成支付',
    //   }
    //   // 弹起来！
    //   this.$alert(htmlStr, '微信扫码支付', {
    //     ...options,
    //     callback: (type) => {
    //       if (type === 'confirm') {
    //         console.log('您点了确定按钮')
    //       } else {
    //         console.log('您点了取消按钮')
    //         clearInterval(this.timer);
    //       }
    //     }
    //   });

    //   // 此时用户就能看到二维码,那么就可以开始发送请求,请求当前的支付状态
    //   this.timer = setInterval(async () => {
    //     try {
    //       const payStatus = await this.$API.pay.reqPayStatus(this.orderId);
    //       console.log('payStatus', payStatus);

    //       clearInterval(this.timer);

    //       this.$msgbox.close();

    //       this.$message.success('支付成功!!!')
    //     } catch (e) {
    //       console.log('还没支付');
    //     }
    //   },1000)
    // }
  }
}
</script>

<style lang="less" scoped>
.pay-main {
  margin-bottom: 20px;

  .pay-container {
    margin: 0 auto;
    width: 1200px;

    a:hover {
      color: #4cb9fc;
    }

    .orange {
      color: #e1251b;
    }

    .money {
      font-size: 18px;
    }

    .zfb {
      color: #e1251b;
      font-weight: 700;
    }

    .checkout-tit {
      padding: 10px;

      .tit-txt {
        font-size: 14px;
        line-height: 21px;

        .success-icon {
          width: 30px;
          height: 30px;
          display: inline-block;
          background: url(./images/icon.png) no-repeat 0 0;
        }

        .success-info {
          padding: 0 8px;
          line-height: 30px;
          vertical-align: top;
        }
      }

      .paymark {
        overflow: hidden;
        line-height: 26px;
        text-indent: 38px;

        .fl {
          float: left;
        }

        .fr {
          float: right;

          .lead {
            margin-bottom: 18px;
            font-size: 15px;
            font-weight: 400;
            line-height: 22.5px;
          }
        }
      }
    }

    .checkout-info {
      padding-left: 25px;
      padding-bottom: 15px;
      margin-bottom: 10px;
      border: 2px solid #e1251b;

      h4 {
        margin: 9px 0;
        font-size: 14px;
        line-height: 21px;
        color: #e1251b;
      }

      ol {
        padding-left: 25px;
        list-style-type: decimal;
        line-height: 24px;
        font-size: 14px;
      }

      ul {
        padding-left: 25px;
        list-style-type: disc;
        line-height: 24px;
        font-size: 14px;
      }
    }

    .checkout-steps {
      border: 1px solid #ddd;
      padding: 25px;

      .hr {
        height: 1px;
        background-color: #ddd;
      }

      .step-tit {
        line-height: 36px;
        margin: 15px 0;
      }

      .step-cont {
        margin: 0 10px 12px 20px;

        ul {
          font-size: 0;

          li {
            margin: 2px;
            display: inline-block;
            padding: 5px 20px;
            border: 1px solid #ddd;
            cursor: pointer;
            line-height: 18px;
          }
        }
      }
    }

    .submit {
      text-align: center;

      .btn {
        display: inline-block;
        padding: 15px 45px;
        margin: 15px 0 10px;
        font: 18px "微软雅黑";
        font-weight: 700;
        border-radius: 0;
        background-color: #e1251b;
        border: 1px solid #e1251b;
        color: #fff;
        text-align: center;
        vertical-align: middle;
        cursor: pointer;
        user-select: none;
        text-decoration: none;
      }
    }
  }
}
</style>