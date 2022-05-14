<template>
  <van-icon
    :name="Comment.is_liking ? 'good-job' : 'good-job-o'"
    :class="{ org: Comment.is_liking }"
    @click="onLiked"
    >{{ Comment.like_count || "赞" }}</van-icon
  >
</template>

<script>
import {
  addArticleCommentLiked,
  deleteArticleCommentLiked,
} from "@/api/article";
import { debounce } from "lodash";
export default {
  name: "CommentLiked",
  props: {
    Comment: {
      type: Object,
      required: true,
    },
  },

  methods: {
    onLiked: debounce(async function () {
      try {
        //已经点赞取消点赞
        if (this.Comment.is_liking) {
          await deleteArticleCommentLiked(this.Comment.com_id);
          this.$emit("likeCount", -1);
        } else {
          //没有点赞则点赞
          await addArticleCommentLiked(this.Comment.com_id);
          this.$emit("likeCount", 1);
        }
        this.$emit("isLiking", !this.Comment.is_liking);

        //提示信息
        this.$toast.success(!this.Comment.is_liking ? "取消点赞" : "点赞成功");
      } catch (error) {
        console.log(error);
        this.$toast.fail("点赞失败,请稍后重试");
      }
    }, 200),
  },
};
</script>

<style lang="less" scoped>
.org {
  color: orangered;
}
</style>
