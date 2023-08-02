<template>
  <div class="register-container">
    <!-- 注册内容 -->
    <div class="register">
      <h3>注册新用户
        <span class="go">我有账号，去 <router-link to="/login">登录</router-link>
        </span>
      </h3>
      <div class="content">
        <label>手机号:</label>
        <input v-model.trim="phone" type="text" placeholder="请输入你的手机号">
        <span v-show="errorMsg.phoneMsg" class="error-msg">{{ errorMsg.phoneMsg }}</span>
      </div>
      <div class="content">
        <label>验证码:</label>
        <input v-model.trim="code" type="text" placeholder="请输入验证码">
        <button class="getcode" @click="sendCode">获取验证码</button>
        <span v-show="errorMsg.codeMsg" class="error-msg">{{ errorMsg.codeMsg }}</span>
      </div>
      <div class="content">
        <label>登录密码:</label>
        <input v-model.trim="password" type="text" placeholder="请输入你的登录密码">
        <span v-show="errorMsg.passwordMsg" class="error-msg">{{ errorMsg.passwordMsg }}</span>
      </div>
      <div class="content">
        <label>确认密码:</label>
        <input v-model.trim="rePwd" type="text" placeholder="请输入确认密码">
        <span v-show="errorMsg.rePwdMsg" class="error-msg">{{ errorMsg.rePwdMsg }}</span>
      </div>
      <div class="controls">
        <input v-model="agree" name="m1" type="checkbox">
        <span>同意协议并注册《尚品汇用户协议》</span>
        <span v-show="errorMsg.agreeMsg" class="error-msg">{{ errorMsg.agreeMsg }}</span>
      </div>
      <div class="btn">
        <button @click="register">完成注册</button>
      </div>
    </div>

    <!-- 底部 -->
    <div class="copyright">
      <ul>
        <li>关于我们</li>
        <li>联系我们</li>
        <li>联系客服</li>
        <li>商家入驻</li>
        <li>营销中心</li>
        <li>手机尚品汇</li>
        <li>销售联盟</li>
        <li>尚品汇社区</li>
      </ul>
      <div class="address">地址：北京市昌平区宏福科技园综合楼6层</div>
      <div class="beian">京ICP备19006430号
      </div>
    </div>
  </div>
</template>

<script>
import { phoneReg, pwdReg, codeReg } from '@/utils/reg';
export default {
  name: 'Register',
  data() {
    return {
      phone: "",
      password: "",
      code: "",
      rePwd: "",
      agree: false,

      errorMsg: {
        phoneMsg: "",
        codeMsg: "",
        passwordMsg: "",
        rePwdMsg: "",
        agreeMsg: "",
      }
    }
  },
  methods: {
    async sendCode() {
      const { phone } = this;
      const code = await this.$API.user.reqCode(phone);
      this.code = code;
    },
    async register() {
      /*
        注册流程:
          1.收集数据
          2.处理数据格式
          3.前端数据校验
            检查数据是否合格,如果不合格就没有必要发送请求
            前端表单校验可以减少服务器的请求压力

          4.发送请求
          5.成功做什么
            失败做什么

      
      
      */

      const { phone, password, code, rePwd, agree } = this;

      if (!phoneReg.test(phone)) {
        this.errorMsg.phoneMsg = "手机号格式不正确"
        return;
      }
      this.errorMsg.phoneMsg = "";

      if (!codeReg.test(code)) {
        this.errorMsg.codeMsg = "验证码格式不正确"
        return;
      }
      this.errorMsg.codeMsg = "";

      if (!pwdReg.test(password)) {
        this.errorMsg.passwordMsg = "密码格式不正确"
        return;
      }
      this.errorMsg.passwordMsg = "";

      if (password !== rePwd) {
        this.errorMsg.rePwdMsg = "请确定输入的密码,两次密码不相同"
        return;
      }
      this.errorMsg.rePwdMsg = "";

      if (!agree) {
        this.errorMsg.agreeMsg = "请认真阅读协议,并勾选同意"
        return;
      }
      this.errorMsg.agreeMsg = "";

      await this.$API.user.reqRegister({
        phone,
        password,
        code
      });

      this.resetData();

      this.$router.replace('/login');
    },
    resetData(){
      const newData = this.$options.data();
      Object.assign(this.$data,newData);
    }
  }
}
</script>

<style lang="less" scoped>
.register-container {
  .register {
    width: 1200px;
    height: 445px;
    border: 1px solid rgb(223, 223, 223);
    margin: 0 auto;

    h3 {
      background: #ececec;
      margin: 0;
      padding: 6px 15px;
      color: #333;
      border-bottom: 1px solid #dfdfdf;
      font-size: 20.04px;
      line-height: 30.06px;

      span {
        font-size: 14px;
        float: right;

        a {
          color: #e1251b;
        }
      }
    }

    div:nth-of-type(1) {
      margin-top: 40px;
    }

    .content {
      padding-left: 390px;
      margin-bottom: 18px;
      position: relative;

      label {
        font-size: 14px;
        width: 96px;
        text-align: right;
        display: inline-block;
      }

      input {
        width: 270px;
        height: 38px;
        padding-left: 8px;
        box-sizing: border-box;
        margin-left: 5px;
        outline: none;
        border: 1px solid #999;
      }

      img {
        vertical-align: sub;
      }

      .error-msg {
        position: absolute;
        top: 100%;
        left: 495px;
        color: red;
      }
    }

    .controls {
      text-align: center;
      position: relative;

      input {
        vertical-align: middle;
      }

      .error-msg {
        position: absolute;
        top: 100%;
        left: 495px;
        color: red;
      }
    }

    .btn {
      text-align: center;
      line-height: 36px;
      margin: 17px 0 0 55px;

      button {
        outline: none;
        width: 270px;
        height: 36px;
        background: #e1251b;
        color: #fff !important;
        display: inline-block;
        font-size: 16px;
      }
    }

    .getcode {
      height: 38px;
      margin-left: 10px;
      padding: 5px;
    }
  }

  .copyright {
    width: 1200px;
    margin: 0 auto;
    text-align: center;
    line-height: 24px;

    ul {
      li {
        display: inline-block;
        border-right: 1px solid #e4e4e4;
        padding: 0 20px;
        margin: 15px 0;
      }
    }
  }
}
</style>