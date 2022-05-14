<template>
  <van-cell class="cell-title">
    <van-image
      width="55"
      height="55"
      slot="icon"
      round
      fit="cover"
      :src="Comment.aut_photo"
    />
    <div slot="title" class="aut-name">{{ Comment.aut_name }}</div>
    <commentLiked
      :Comment="Comment"
      @isLiking="Comment.is_liking = $event"
      @likeCount="Comment.like_count += $event"
    />

    <div slot="title" class="article-text">
      {{ Comment.content }}
    </div>
    <span slot="label" class="time">{{ Comment.pubdate | relativeTime }}</span>
    <van-button
      slot="label"
      type="info"
      round
      size="mini"
      class="reply"
      @click="$emit('replyComment', Comment)"
      >{{ Comment.reply_count }}&nbsp;回复</van-button
    >
  </van-cell>
</template>

<script>
import commentLiked from "@/components/comment/comment-liked";
export default {
  name: "Comment",
  components: {
    commentLiked,
  },
  props: {
    Comment: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="less" scoped>
.cell-title {
  .van-image {
    margin-right: 25px;
  }
  .aut-name {
    font-size: 27px;
    color: #5f99ea;
    margin-bottom: 35px;
    line-height: 27px;
  }
  .article-text {
    font-size: 33px;
    color: #222222;
  }
  .van-cell__value {
    flex: unset;
    height: 50px;
  }
  .van-cell__label {
    margin-top: 40px;
    display: flex;
    align-items: center;
  }
  .time {
    font-size: 18px;
    color: #222222;
  }
  .reply {
    min-width: 135px;
    height: 48px;
    background-color: #f4f5f6;
    border: 0;
    color: #222222;
    margin-left: 40px;
  }
}
</style>
