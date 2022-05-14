<template>
  <div>
    <van-field
      v-model.trim="commentText"
      maxlength="300"
      placeholder="写评论..."
      type="textarea"
      autosize
    />
    <div class="comment-btn">
      <van-button
        class="send-btn"
        type="info"
        size="mini"
        @click="onSend"
        :disabled="isSend"
        >发送</van-button
      >
    </div>
  </div>
</template>

<script>
import { sendArticleComment } from "@/api/article";
export default {
  name: "WriteComment",
  props: {
    articleId: {
      type: [Number, Object, String],
      required: true,
    },
    targetId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      commentText: "", //写评论的内容
      isSend: true,
    };
  },
  watch: {
    commentText() {
      this.isSend = false;
    },
  },
  methods: {
    async onSend() {
      try {
        const { data } = await sendArticleComment({
          target: this.articleId, //文章的id或者评论的id
          content: this.commentText, //评论的内容
          art_id: this.targetId, //对评论回复时需要传文章的id
        });

        this.$toast.success("发表成功");
        this.commentText = "";
        this.$emit("sendSuccess", data.data);
      } catch (error) {
        console.log(error);
        this.$toast.fail("发表失败,稍后重试");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.van-cell {
  padding: 0;
}

/deep/.van-cell__value {
  height: 200px;
  margin-bottom: 10px;
  padding: 0 15px;
  background-color: #f4f1f1;
}
.comment-btn {
  position: relative;
  width: 100%;
  height: 100px;
  .send-btn {
    position: absolute;
    right: 0;
    top: 0;
    width: 100px;
    height: 50px;
    border: 0;
    background-color: rgb(242, 240, 240);
    color: #5f99ea;
  }
}
</style>
