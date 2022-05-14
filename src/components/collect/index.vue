<template>
  <van-icon
    :name="value ? 'star' : 'star-o'"
    :class="{ color: value }"
    @click="onCollect"
  ></van-icon>
</template>

<script>
import { addArticleCollect, deleteArticleCollect } from "@/api/article";
//引入防抖函数
import { debounce } from "lodash";
export default {
  name: "Collect",
  props: {
    value: {
      typeof: Boolean,
      required: true,
    },
    artId: {
      typeof: [Number, String, Object],
      required: true,
    },
  },
  methods: {
    onCollect: debounce(async function () {
      try {
        //用户已经收藏 点击取消关注
        if (this.value) {
          await deleteArticleCollect(this.artId);
        } else {
          //用户未关注，点击收藏
          await addArticleCollect(this.artId);
        }
        this.$emit("input", !this.value);
        this.$toast.success(this.value ? "取消收藏" : "收藏成功");
      } catch (error) {
        let message = "获取数据失败,请稍后重试";
        if (error.response && error.response.status === 401) {
          message = "收藏失败,请登录";
        }
        this.$toast.fail(message);
      }
    }, 300),
  },
};
</script>

<style lang="less" scoped>
.color {
  color: yellow;
}
</style>
