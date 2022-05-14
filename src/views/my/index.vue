<template>
  <div class="my-container">
    <!-- 登录状态下的头部部 -->
    <div class="header user-header" v-if="user">
      <div class="user-info">
        <div class="left">
          <van-image round fit="cover" class="photo" :src="personInfo.photo" />
          <span class="text">{{ personInfo.name }}</span>
        </div>
        <router-link class="right" to="/user/profile">编辑资料</router-link>
      </div>
      <div class="user-data">
        <div class="info-item">
          <span class="num">{{ personInfo.art_count }}</span>
          <span class="text">头条</span>
        </div>
        <div class="info-item">
          <span class="num">{{ personInfo.follow_count }}</span>
          <span class="text">关注</span>
        </div>
        <div class="info-item">
          <span class="num">{{ personInfo.fans_count }}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="info-item">
          <span class="num">{{ personInfo.like_count }}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- 我的头部未登录状态 -->
    <div class="header base-header" v-else>
      <div class="not-login" @click="$router.push('/login')">
        <img src="@/assets/mobile.png" class="mobile-img" />
        <span class="text">登录&nbsp;/&nbsp;注册</span>
      </div>
    </div>

    <!--收藏历史栏 -->
    <van-grid :column-num="2" class="van-grid" clickable:true>
      <van-grid-item text="收藏">
        <i slot="icon" class="toutiao toutiao-shoucang"></i>
      </van-grid-item>
      <van-grid-item text="历史">
        <i slot="icon" class="toutiao toutiao-lishi"></i>
      </van-grid-item>
    </van-grid>
    <!-- 宫格栏 -->

    <van-cell title="消息通知" is-link />
    <van-cell title="小智同学" is-link class="md9" />
    <van-cell
      title="退出登录"
      class="cell-loginOut"
      v-if="user"
      @click="logout"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getUserInfo } from "@/api/user";
export default {
  name: "myIndex",
  data() {
    return {
      personInfo: {},
    };
  },
  computed: {
    ...mapState({
      user: (state) => {
        return state.user.token;
      },
    }),
  },
  methods: {
    //请求用户的数据
    async userInfo() {
      try {
        const result = await getUserInfo();
        this.personInfo = result.data.data;
      } catch (error) {
        console.log("获取信息失败");
      }
    },
    //退出登录提示
    logout() {
      this.$dialog
        .confirm({
          title: "确定退出登录吗？",
        })
        .then(() => {
          // on confirm
          //确定退出登录的回调
          this.$store.commit("setUser", null);
        })
        .catch(() => {
          // on cancel
        });
    },
  },
  mounted() {
    //页面挂载完成发送请求
    this.userInfo();
  },
};
</script>

<style lang="less" scoped>
.my-container {
  .header {
    height: 361px;
    background: url("~@/assets/banner.png");
    background-size: cover;
  }
  //为登录头部栏
  .base-header {
    display: flex;
    justify-content: center;
    align-items: center;
    .not-login {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-flow: column;
    }
    .mobile-img {
      width: 132px;
      height: 132px;
    }
    .text {
      font-size: 28px;
      color: #ffffff;
    }
  }

  //登录状态下头部的样式
  .user-header {
    .user-info {
      height: 231px;
      // background-color: pink;
      box-sizing: border-box;
      padding: 74px 32px 22px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        .photo {
          width: 132px;
          height: 132px;
          border: 2px solid #ffffff;
          margin-right: 22px;
        }
        .text {
          font-size: 30px;
          color: #ffffff;
        }
      }
      .right {
        font-size: 20px;
        width: 150px;
        height: 45px;
        text-align: center;
        line-height: 45px;
        border-radius: 20px;
        background-color: #ffffff;
      }
    }
    //粉丝关注栏
    .user-data {
      height: 130px;
      // background-color: aquamarine;
      display: flex;
      justify-content: center;
      align-items: center;
      .info-item {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column;
        .num {
          font-size: 36px;
          color: #ffffff;
        }
        .text {
          font-size: 26px;
          color: #ffffff;
        }
      }
    }
  }
  //grid-nav
  .van-grid {
    margin-bottom: 10px;
    .text {
      font-size: 28px;
    }
    .toutiao {
      font-size: 45px;
    }
    .toutiao-shoucang {
      color: #eb5253;
    }
    .toutiao-lishi {
      color: #ff9d1d;
    }
  }
  .cell-loginOut {
    margin-top: 10px;
    text-align: center;
    color: #eb5253;
  }
}
</style>
