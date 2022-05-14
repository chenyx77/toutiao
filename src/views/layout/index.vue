<template>
  <div class="layout-container">
    <router-view />
    <!-- route开始路由模式 -->
    <van-tabbar route>
      <van-tabbar-item to="/home">
        <i slot="icon" class="toutiao toutiao-shouye"></i>
        <span class="text">首页</span>
      </van-tabbar-item>
      <van-tabbar-item to="/qa">
        <i slot="icon" class="toutiao toutiao-wenda"></i>
        <span class="text">问答</span>
      </van-tabbar-item>
      <van-tabbar-item to="/video">
        <i slot="icon" class="toutiao toutiao-shipin"></i>
        <span class="text">视频</span>
      </van-tabbar-item>
      <van-tabbar-item to="/my">
        <i slot="icon" class="toutiao toutiao-wode"></i>
        <span class="text">{{
          $store.state.user.token ? "我的" : "未登录"
        }}</span>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "Layout",
  data() {
    return {};
  },
};
</script>

<style lang="less" scoped>
.layout-container {
  i.toutiao {
    // width: 40px;
    font-size: 40px;
  }
  span.text {
    font-size: 22px;
  }
}
</style>
