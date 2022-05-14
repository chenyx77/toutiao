<template>
  <van-icon
    :name="value === 1 ? 'good-job' : 'good-job-o'"
    :class="{ light: value === 1 }"
    @click="onLiked"
  ></van-icon>
</template>

<script>
import { debounce } from "lodash";
import { addArticleLiked, deleteArticleLiked } from "@/api/article";
export default {
  name: "Liked",
  props: {
    value: {
      typeof: Number,
      required: true,
    },
    artId: {
      typeof: [Number, String, Object],
      required: true,
    },
  },
  methods: {
    onLiked: debounce(async function () {
      try {
        //用户已经点赞 点击取消点赞

        if (this.value === 1) {
          await deleteArticleLiked(this.artId);
        } else {
          //用户未点赞
          await addArticleLiked(this.artId);
        }
        this.$emit("input", this.value === 1 ? -1 : 1);
        //需要拿到修改后的value进行判断，所以需要取反
        this.$toast.success(this.value === 1 ? "取消点赞" : "点赞成功");
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
.light {
  color: rgb(245, 74, 11);
}
</style>
