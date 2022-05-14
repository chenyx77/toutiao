<template>
  <div class="replyComment">
    <van-cell>{{ Comment.reply_count }}条回复</van-cell>

    <div class="replyComment-list">
      <commentItem :Comment="Comment" />
      <span class="all-comment">全部评论</span>
      <van-list
        :immediate-check="false"
        v-model="loading"
        :finished="finished"
        loading-text
        finished-text="没有更多了"
        @load="onLoad"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
      >
        <CommentItem
          v-for="(comment, index) in list"
          :key="index"
          :Comment="comment"
        />
      </van-list>
      <van-popup
        v-model="show"
        position="bottom"
        closeable
        close-icon-position="top-left"
        class="article-write"
      >
        <WriteComment
          :articleId="Comment.com_id"
          :targetId="Comment.aut_id"
          @sendSuccess="sendSuccess"
        />
      </van-popup>
    </div>
    <van-button
      type="default"
      size="small"
      class="reply-comment"
      @click="show = true"
      >写评论</van-button
    >
  </div>
</template>

<script>
import CommentItem from "@/components/comment";
import { addArticleComment } from "@/api/article";
import WriteComment from "@/components/comment/write-comment";
export default {
  name: "CommentReply",
  components: {
    CommentItem,
    WriteComment,
  },
  props: {
    Comment: {
      type: Object,
      required: true,
    },
  },
  created() {
    console.log(this.replyShow);
    this.onLoad();
  },
  data() {
    return {
      list: [], //文章评论列表
      loading: false,
      finished: false,
      error: false,
      offset: null, // 请求下一页数据的页码
      limit: 10, //一次请求评论数
      show: false,
    };
  },
  methods: {
    async onLoad() {
      /*     setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1);
        }

        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true;
        }
      }, 1000); */
      // 异步更新数据
      try {
        //1.获取文章的评论
        const { data } = await addArticleComment({
          type: "c", //评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.Comment.com_id.toString(), //源id，文章id或评论id
          offset: this.offset, //获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit, //获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        });

        const { results } = data.data;

        //2.把数据放入数组中
        this.list.push(...results);
        //3.关闭加载状态
        this.loading = false;
        //更新总评论数
        this.totalCount = data.data.total_count;

        //4.判断是否还有数据,如果还有数据则把上一次获取到的评论最后一条的id作为offset

        if (results.length) {
          this.offset = data.data.last_id;
        } else {
          this.finished = true;
        }
      } catch (error) {
        console.log(error);
        this.loading = false;
        this.error = true; //显示错误提示
        console.log("出错误了");
      }
    },

    sendSuccess(data) {
      this.show = false;
      this.Comment.reply_count++;
      this.list.unshift(data.new_obj);
    },
  },
};
</script>

<style lang="less" scoped>
.replyComment {
  .replyComment-list {
    position: fixed;
    left: 0;
    right: 0;
    top: 480px;
    bottom: 80px;
    overflow-y: auto;
  }
  .van-cell {
    padding-top: 0;
    &::after {
      border: 0;
    }

    .van-cell__value {
      text-align: center;
    }
  }
  .all-comment {
    font-size: 25px;
    margin-left: 30px;
  }
  .reply-comment {
    width: 100%;
    height: 80px;
    border-bottom: 0;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -1;
  }
  .van-list {
    margin-top: 30px;
  }
  //弹出层样式
  .van-popup {
    padding-top: 100px;
  }

  /* .article-write {
    z-index: 99;
    .van-cell {
      margin-bottom: 10px;
    }
  } */
}
</style>
