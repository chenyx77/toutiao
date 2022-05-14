<template>
  <div class="home-container">
    <!-- 头部区域 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        to="/search"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- 滚动导航栏 -->
    <van-tabs
      v-model="active"
      swipeable
      animated
      scrollspy
      sticky
      class="tabs-list"
    >
      <van-tab
        v-for="channel in channels"
        :key="channel.id"
        :title="channel.name"
      >
        <!-- 把频道对象channel传给组件 -->
        <Article :channel="channel" />
      </van-tab>

      <div slot="nav-right" class="hamburger" @click="showEdit">
        <i class="toutiao toutiao-gengduo"></i>
      </div>
      <!-- 占位元素 -->
      <div slot="nav-right" class="placeholder"></div>
    </van-tabs>
    <!-- 编辑频道弹出层 -->
    <van-popup
      v-model="isChannelEdit"
      closeable
      position="bottom"
      :style="{ height: '100%' }"
    >
      <channelsEdit
        :mychannels="channels"
        :active="active"
        :isChannelEdit="isChannelEdit"
        @changeChannel="changeChannel"
      />
    </van-popup>
  </div>
</template>

<script>
import { userChannel } from "@/api/user";
import Article from "./article";
import channelsEdit from "@/components/channels-edit";
import { mapState } from "vuex";
import { getItem } from "@/utils/storage";
export default {
  name: "homeIndex",
  components: {
    Article,
    channelsEdit,
  },
  data() {
    return {
      active: 0,
      channels: [],
      isEdit: false,
      isChannelEdit: false,
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user.token,
    }),
  },
  created() {
    this.getUserChannel();
  },
  methods: {
    async getUserChannel() {
      let getChannels = [];
      //登录的，获取用户的频道
      if (this.user) {
        try {
          const { data } = await userChannel();

          getChannels = data.data.channels;
        } catch (error) {
          this.$toast.fail("获取频道失败");
        }
      } else {
        //没有登录，获取本地的频道
        //1，有本地频道直接进行展示
        getChannels = getItem("TOUTIAO_CHANNELS");
        //2.没有本地存储，则发送请求获取服务器默认的频道
        if (!getChannels) {
          try {
            const { data } = await userChannel();

            getChannels = data.data.channels;
          } catch (error) {
            this.$toast.fail("获取频道失败");
          }
        }
      }
      this.channels = getChannels;
    },

    //showEdit点击触发弹出层
    showEdit() {
      this.isChannelEdit = true;
    },
    //编辑频道通过自定义事件，把点击的频道传给父组件
    changeChannel(index, isChannelEdit) {
      this.active = index;
      //关闭弹出层
      this.isChannelEdit = isChannelEdit;
    },
  },
};
</script>

<style lang="less" scoped>
.home-container {
  /deep/.van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      margin-top: 2px;
      font-size: 32px;
      color: #fff;
    }
  }
  .tabs-list {
    position: fixed;
    top: 92px;
    z-index: 1;
    left: 0;
    right: 0;
  }
  //滚动导航栏
  /deep/.van-tabs__wrap {
    height: 82px;
    border-bottom: 1px solid #edeff3;
    .van-tab {
      min-width: 200px;
      color: #777777;
      border-right: 1px solid #edeff3;

      font-size: 30px;
    }
    .van-tabs__nav {
      padding-bottom: 0;
    }
    .van-tabs__line {
      width: 31px;
      height: 6px;
      bottom: 8px;
      background-color: #3296fa;
    }

    .van-tab--active {
      color: #333333;
    }
    //更多
    .hamburger {
      position: fixed;
      //不参与flex计算
      // flex-shrink: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      right: 0;
      width: 100px;
      height: 82px;

      opacity: 0.92;
      i.toutiao {
        font-size: 43px;
      }
      //通过伪元素设置它的左边框，渐变色
      &::before {
        content: "";
        position: absolute;
        left: 0;
        width: 2px;
        height: 100%;
        background: url("~@/assets/gradient-gray-line.png");
        background-size: contain;
      }
    }
    //占位元素
    .placeholder {
      flex-shrink: 0;
      width: 100px;
      height: 100%;
    }
  }
  /deep/.van-popup__close-icon {
    position: absolute;
    left: 30px;
    top: 28px;
    margin-bottom: 40px;
  }
}
</style>
