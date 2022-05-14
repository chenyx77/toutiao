<template>
  <van-button
    :loading="loading"
    v-if="isFollow"
    class="followed"
    type="info"
    round
    size="mini"
    @click="onFollow"
    >已关注</van-button
  >
  <van-button
    :loading="loading"
    v-else
    icon="plus"
    type="info"
    round
    size="mini"
    @click="onFollow"
    >关注</van-button
  >
</template>

<script>
import { addFollow, deleteFollow } from "@/api/user";
export default {
  name: "Follow",
  data() {
    return {
      loading: false,
    };
  },

  model: {
    prop: "isFollow",
    event: "updateFollowed",
  },
  props: {
    isFollow: {
      typeof: Boolean,
      required: true,
    },
    autId: {
      typeof: [Number, String, Object],
      required: true,
    },
  },
  methods: {
    async onFollow() {
      this.loading = true;
      try {
        //已经关注 点击取消关注
        if (this.isFollow) {
          await deleteFollow(this.autId);
        } else {
          //未关注点击关注
          await addFollow(this.autId);
        }
        this.$emit("updateFollowed", !this.isFollow);
        this.loading = false;
      } catch (error) {
        this.loading = false;
        let message = "获取数据失败 请稍后重试";
        if (error.response && error.response.status === 400) {
          message = "不能关注自己!";
        }
        this.$toast(message);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.followed {
  border: 1px solid #dbd8d8 !important;
  color: #918b8b !important;
  background-color: #ffffff !important;
}
</style>
