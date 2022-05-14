<template>
  <div class="channelsEdit-Container">
    <div class="my-edit">
      <!-- cell导航栏 -->
      <van-cell class="cell-edit">
        <span slot="title" class="text">我的频道</span>
        <van-button
          plain
          type="defaule"
          size="mini"
          round
          class="channel-edit"
          @click="isFinished = !isFinished"
          >{{ isFinished ? "完成" : "编辑" }}</van-button
        >
      </van-cell>
      <!-- 我的频道宫格频道 -->
      <van-grid :gutter="10" class="grid-item my-grid">
        <van-grid-item
          class="item"
          v-for="(channel, index) in mychannels"
          :key="channel.id"
          @click="changeChannel(channel, index)"
        >
          <van-icon
            v-show="isFinished && channel.id != 0"
            slot="icon"
            name="clear"
          />
          <span
            slot="text"
            class="slot-title"
            :class="{ high: active == index }"
            >{{ channel.name }}</span
          >
        </van-grid-item>
      </van-grid>
    </div>
    <!-- 推荐频道 -->
    <div class="recommend-edit">
      <!-- cell导航栏 -->
      <van-cell class="cell-edit">
        <span slot="title" class="text">推荐频道</span>
      </van-cell>
      <!-- 推荐频道宫格频道 -->
      <van-grid :gutter="10" class="grid-item">
        <van-grid-item
          icon="plus"
          class="item"
          v-for="(channel, index) in recommendChannel"
          :key="channel.id"
          @click="addChannel(channel)"
        >
          <span slot="text" class="slot-title">{{ channel.name }}</span>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { allChannels } from "@/api/article";
import { addUserChannels, deleteUserChannels } from "@/api/channels";
import { mapState } from "vuex";
import { setItem } from "@/utils/storage";
export default {
  name: "ChannelEdit",
  props: {
    mychannels: {
      typeof: Array,
      require: true,
    },
    active: {
      typeof: Number,
      require: true,
    },
    isChannelEdit: {
      typeof: Boolean,
      require: true,
    },
  },
  data() {
    return {
      isFinished: false,
      allChannelsList: [], //全部频道列表
      allMyChannelsList: [],
    };
  },
  computed: {
    //映射user判断是否为登录状态
    ...mapState({
      user: (state) => state.user.token,
    }),
    //将所以频道区分为，我的频道和推荐频道
    recommendChannel() {
      this.allMyChannelsList = this.mychannels;
      //过滤数组，在我的频道的数据就不需要在推荐频道展示
      return this.allChannelsList.filter((item) => {
        //find方法会返回符合判断条件的元素
        return !this.allMyChannelsList.find((channel) => item.id == channel.id);
      });
    },
  },
  created() {
    this.getAllChannels();
  },
  methods: {
    async getAllChannels() {
      const { data } = await allChannels();
      this.allChannelsList = data.data.channels;
    },
    //点击选择频道然后显示高亮或者删除频道
    changeChannel(channel, index) {
      if (this.isFinished) {
        if (index == 0) {
          //不删除推荐频道
          return;
        }
        //删除频道
        this.allMyChannelsList.splice(index, 1);
        if (this.user) {
          //发送请求删除线上的请求
          this.deleteChannels(channel);
        } else {
          //删除本地存储
          setItem("TOUTIAO_CHANNELS", this.allMyChannelsList);
        }

        //如果删除的频道在高亮的前面
        if (index < this.active) {
          this.$emit("changeChannel", this.active - 1, true);
        }
      } else {
        //非编辑状态直接跳转，关闭弹出层
        this.$emit("changeChannel", index, false);
      }
    },
    //添加频道
    async addChannel(channel) {
      //添加到我的频道
      this.allMyChannelsList.push(channel);
      //登录转态
      if (this.user) {
        //发送请求保存到线上
        try {
          await addUserChannels([
            {
              id: channel.id, //频道的id
              seq: this.allMyChannelsList.length, //频道的顺序
            },
          ]);
        } catch (error) {
          this.$toast("添加失败");
        }
      } else {
        //未登录转态
        setItem("TOUTIAO_CHANNELS", this.allMyChannelsList);
      }
    },
    //删除指定用户的频道
    async deleteChannels(channel) {
      try {
        await deleteUserChannels(channel.id);
      } catch (error) {
        this.$toast("删除失败");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.channelsEdit-Container {
  padding-top: 85px;
  .van-cell {
    display: flex;
    align-items: center;
    &::after {
      border: 0;
    }
    .text {
      font-size: 32px;
      color: #333333;
    }
    .channel-edit {
      width: 123px;
      height: 49px;
      border: 1px solid #f85959;
      color: #f85959;
    }
  }
  /deep/.grid-item {
    padding-left: 22px;
    &::after {
      border: 0;
    }

    .van-grid-item__content {
      width: 160px;
      height: 86px;
      background-color: #f4f5f6;
      flex-direction: row;
    }
    .slot-title {
      font-size: 28px;
      color: #222;
    }
    .high {
      color: #f85959;
    }
    .van-grid-item__icon-wrapper {
      position: unset;
    }
    .van-icon-clear {
      position: absolute;
      top: -5px;
      right: -5px;
      font-size: 15px;
      opacity: 0.2;
      z-index: 2;
    }
  }
  /deep/.recommend-edit {
    .van-grid-item__content {
      padding: 0;

      .van-icon {
        font-size: 30px;
        margin-right: 6px;
      }
    }
  }
}
</style>
