<template>
  <div class="login-nav">
    <van-nav-bar class="title-nav" title="登录">
      <i slot="left" class="title-left">
        <van-icon
          name="arrow-left"
          color="#fff"
          size="25px"
          @click="$router.back()"
        />
      </i>
    </van-nav-bar>
    <van-form @submit="onSubmit" ref="loginMobile">
      <van-field
        name="mobile"
        type="number"
        maxlength="11"
        placeholder="请输入手机号"
        :rules="loginRules.mobileRules"
        v-model="user.mobile"
      >
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field
        type="number"
        name="code"
        placeholder="输入验证码"
        v-model="user.code"
        :rules="loginRules.codeRules"
      >
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <template #button>
          <van-count-down
            :time="1000 * 60"
            v-if="countTimeShow"
            @finish="countTimeShow = false"
            ref="countDown"
          >
            <template #default="timeData">
              <span class="block">{{ timeData.seconds }}s后从新获取</span>
            </template>
          </van-count-down>
          <van-button
            v-else
            class="send-sms-btn"
            size="small"
            round
            type="default"
            native-type="button"
            @click="onSendSms"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div class="sub-btn">
        <van-button block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { userLogin, mobileCode } from "@/api/user";

export default {
  name: "Login",
  data() {
    return {
      user: {
        mobile: "",
        code: "",
      },
      //设置验证规则
      /*
       required说明为必选项，
       如果手机号没写那么只会进行第一项验证，第二项验证不会触发
      */
      loginRules: {
        mobileRules: [
          { required: true, message: "请输入手机号" },
          //利用正则进行验证
          { pattern: /^1[3,4,5,6,7,8,9]\d{9}$/, message: "手机号格式错误" },
        ],
        codeRules: [
          { required: true, message: "请输入验证码" },
          { pattern: /^\d{6}$/, message: "验证码错误" },
        ],
      },
      countTimeShow: false,
    };
  },

  methods: {
    //点击登录
    async onSubmit() {
      this.$toast.loading({
        message: "登录中...",
        forbidClick: true,
        duration: 0, // 持续展示 toast
      });
      const user = this.user;
      try {
        const result = await userLogin(user);
        // console.log(result);
        if (result.status === 201) {
          //显示登录成功,会把前面的轻提示覆盖
          this.$toast.success("登录成功");
          //result.data.data
          this.$store.commit("setUser", result.data.data);

          this.$router.back();
        }
      } catch (error) {
        if (error.response.status === 400) {
          this.$toast.fail("验证码错误");
        } else {
          //如果不是400则有可能是服务器错误而
          this.$toast.fail("登录失败,请稍后重试");
        }
      }
    },
    //点击获取验证码
    async onSendSms() {
      //1.验证手机号
      try {
        await this.$refs.loginMobile.validate("mobile");
      } catch (error) {
        return console.log("手机号错误");
      }
      //2.倒计时
      this.countTimeShow = true;
      //3.发送请求

      try {
        await mobileCode(this.user.mobile);

        this.$toast.success("发送成功");
      } catch (error) {
        this.$toast.fail("发送失败,请稍后重试");
        this.countTimeShow = false;
      }
    },
  },
};
</script>

<style lang="less">
.login-nav {
  .title-nav {
    background-color: #919191;
  }
  .title-left {
    color: #fff;
  }
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 170px;
    height: 46px;
    line-height: 46px;
    font-size: 22px;
    background-color: #ededed;
    color: #b6b6b6;
  }
  .sub-btn {
    padding: 64px 25px;
  }
  .block {
    font-size: 12px;
    color: #919191;
  }
}
</style>
