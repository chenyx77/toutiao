<template>
  <div class="article-container">
    <!-- 头部导航栏 -->
    <div class="nav-bar">
      <van-nav-bar left-text="返回" left-arrow @click-left="onClickLeft">
        <span slot="title" class="article-details">详情</span>
      </van-nav-bar>
    </div>
    <div class="all-title">
      <!-- 加载模块 -->
      <div class="article-loading" v-if="loadingShow">
        <van-loading color="#1989fa" size="24px" vertical
          >努力加载中...</van-loading
        >
      </div>
      <!-- 加载模块 -->
      <!-- 正文模块 -->
      <div class="article-title" v-else-if="articleMessage.title">
        <div class="article-warp">
          <div class="title-bar">{{ articleMessage.title }}</div>
          <van-cell>
            <van-image
              class="image"
              slot="icon"
              fit="cover"
              round
              :src="articleMessage.aut_photo"
            />
            <span slot="title" class="title">{{
              articleMessage.aut_name
            }}</span>
            <span slot="label">{{
              articleMessage.pubdate | relativeTime
            }}</span>
            <!--   <van-button class="button" icon="plus" round size="mini" type="info"
            >关注</van-button
          > -->
            <!-- 

           
            对于父组件给子组件传递的数据中，并且需要在子组件中进行修改
           可以通过v-model代替
            :isFollowed="articleMessage.is_followed"
           
             @changeIsFollowed="articleMessage.is_followed = $event"
            在子组件接收articleMessage.is_followed 需要用value接收
            默认自定义事件的名称为input

            当然我们进行修改 value和input
           在子组件中使用
           model: {
             prop: 'xxx,
             event: 'xxxx'
           }
           -->
            <Follow
              class="button"
              v-model="articleMessage.is_followed"
              :autId="articleMessage.aut_id"
            />
          </van-cell>
          <div
            ref="textPart"
            class="text-part markdown-body"
            v-html="articleMessage.content"
          ></div>
          <van-divider class="divider">正文结束</van-divider>

          <!-- 评论模块 -->
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
            <Comment
              v-for="(comment, index) in list"
              :key="index"
              :Comment="comment"
              @replyComment="replyComment"
            />
          </van-list>
          <!-- 评论模块 -->
        </div>
        <!-- 评论弹出层 -->
        <van-popup
          v-model="show"
          position="bottom"
          closeable
          close-icon-position="top-left"
          class="article-write"
        >
          <WriteComment
            :articleId="articleMessage.art_id"
            @sendSuccess="sendCommentSuccess"
          />
        </van-popup>
        <!-- 评论弹出层 -->
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            plain
            type="info"
            round
            class="comment-btn"
            @click="onPopup"
            >写评论...</van-button
          >
          <div class="icon">
            <van-icon
              name="chat-o"
              class="icon-btn"
              :badge="totalCount"
            ></van-icon>
            <Collect
              class="icon-btn"
              v-model="articleMessage.is_collected"
              :artId="articleMessage.art_id"
            />
            <!-- like_count=1已经点赞
                           = -1取消点赞
                           = 0未点赞
             -->
            <Liked
              class="icon-btn"
              v-model="articleMessage.attitude"
              :artId="articleMessage.art_id"
            />

            <van-icon name="share-o" class="icon-btn"></van-icon>
          </div>
        </div>
        <!-- 底部区域 -->
      </div>
      <!-- 正文模块 -->

      <!-- 加载失败模块 -->

      <!-- 资源不存在 -->
      <div class="error-warp" v-else-if="errorStatus == 404">
        <van-icon name="failure"></van-icon>
        <p class="error-text">该资源不存在</p>
      </div>
      <!-- 网络请求错误或者服务器端错误 -->
      <div class="error-warp" v-else>
        <van-icon name="failure"></van-icon>
        <p class="error-text">内容加载失败</p>
        <van-button class="error-btn" @click="articleDetail()"
          >请点击重试</van-button
        >
      </div>
    </div>

    <!-- 回复评论模块 -->
    <van-popup
      v-model="replyShow"
      position="bottom"
      closeable
      :style="{ height: '70%' }"
      close-icon-position="top-left"
      class="article-write"
    >
      <!-- 弹出层默认是懒加载，它不会重写渲染里面的内容
       所以当我们切换评论是评论的回复没有变，组件没有从新渲染
       可以在关闭弹出的时候销毁组件
       -->
      <ReplyComment v-if="replyShow" :Comment="replyObj" />
    </van-popup>
    <!-- 回复评论模块 -->
  </div>
</template>

<script>
import "github-markdown-css/github-markdown.css";
import { getArticleDetail, addArticleComment } from "@/api/article";
import { ImagePreview } from "vant";
import Follow from "@/components/follow";
import Collect from "@/components/collect";
import Liked from "@/components/liked";
import Comment from "@/components/comment";
import WriteComment from "@/components/comment/write-comment";
import ReplyComment from "./components/comment-reply.vue";
/*ImagePreview({
  images: [
    "https://img01.yzcdn.cn/vant/apple-1.jpg",
    "https://img01.yzcdn.cn/vant/apple-2.jpg",
  ],
  startPosition: 1,
}); */
export default {
  name: "Article",
  components: {
    Follow,
    Collect,
    Liked,
    Comment,
    WriteComment,
    ReplyComment,
  },
  props: {
    article_id: {
      type: [Number, String, Object],
      required: true,
    },
  },
  data() {
    return {
      loadingShow: true, //是否处于加载模块
      articleMessage: {},
      errorStatus: 0, //错误的类型
      imagesSrc: [], //存放照片的img
      list: [], //文章评论列表
      loading: false,
      finished: false,
      error: false,
      offset: null, // 请求下一页数据的页码
      limit: 10, //一次请求评论数
      totalCount: 0, // 总数据条数
      show: false, //是否展示评论弹出层
      replyShow: false, //是否展示回复评论弹出层
      replyObj: {}, //评论对象
    };
  },
  created() {
    this.articleDetail();
  },

  watch: {
    //this.$nextTick(() => this.onLoad());
    articleMessage() {
      this.$nextTick(() => this.onLoad());
    },
  },
  methods: {
    onClickLeft() {
      this.$router.back();
    },
    //获取文章详情
    async articleDetail() {
      try {
        const result = await getArticleDetail(this.article_id);

        /*   if (Math.random() > 0.3) {
          JSON.parse("fshidfs");
        } */

        this.loadingShow = false;
        this.articleMessage = result.data.data;
        //这里需要加入nextTicl钩子函数，他会在下一次dom更新个循环结合后执行，因为直接获取dom页面还没有渲染处理这样是拿不到dom节点的
        setTimeout(() => {
          this.getImage();
        }, 0);
        /*  this.$nextTick(() => {
          this.getImage();
        }); */
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.errorStatus = 404;
        }
        this.loadingShow = false;
      }
    },
    //获取文本中的图片
    getImage() {
      const div = this.$refs.textPart;
      const images = div.querySelectorAll("img");
      images.forEach((img) => {
        img.onclick = () => {
          ImagePreview({
            images: this.imagesSrc,
            startPosition: 0,
            showIndex: false,
          });
        };
        this.imagesSrc.push(img.src);
      });
    },
    //获取评论
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
          type: "a", //评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.articleMessage.art_id, //源id，文章id或评论id
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
    //发表评论成功
    sendCommentSuccess(data) {
      this.show = false;
      this.list.unshift(data.new_obj);
    },
    //写写评论触发弹出层
    onPopup() {
      this.show = true;
    },
    //回复评论
    replyComment(obj) {
      this.replyShow = true;
      this.replyObj = obj; //拿到评论对象
    },
  },
};
</script>

<style lang="less" scoped>
@import "./github-markdown.css";
.article-container {
  background-color: #fff;
  .all-title {
    .article-warp {
      padding: 92px 25px 0;
    }
  }
  .nav-bar {
    position: fixed;
    left: 0;
    right: 0;
    z-index: 2;

    /deep/.van-nav-bar__left {
      .van-icon {
        color: #fff;
      }
      .van-nav-bar__text {
        color: #fff;
      }
    }
    .article-details {
      color: #fff;
      font-size: 32px;
    }
  }
  //加载模块

  .article-loading {
    padding-top: 200px;
    height: 80vh;
  }
  //正文模块
  .van-cell {
    padding: 0;
    margin-bottom: 46px;
    &::after {
      border: 0;
    }
  }
  .title-bar {
    padding: 30px 0;
  }
  //作者导航栏模块
  .article-title {
    background-color: #fff;
    .title-bar {
      font-size: 48px;
      color: #3a3a3a;
    }
    .image {
      width: 80px;
      height: 80px;
    }
    .van-cell__title {
      margin-left: 16px;
      display: flex;
      flex-flow: column;
      justify-content: center;
      .title {
        line-height: unset;
        font-size: 28px;
        color: #3a3a3a;
      }

      .van-cell__label {
        font-size: 20px;
        margin-top: 1px;
        color: #b4b4b4;
      }
    }
    .van-cell__value {
      line-height: 58px;
    }
    .button {
      font-size: 28px;
      width: 170px;

      height: 58px;
      border: 0;
      background-color: #3296fa;
      color: #fff;
    }
  }
  .van-divider {
    margin: 20px 0;
    padding-bottom: 50px;
  }
  .article-bottom {
    position: fixed;
    bottom: 0;
    z-index: 99;
    width: 100%;
    height: 98px;
    display: flex;
    align-items: center;
    border-top: 1px solid #d8d8d8;
    background-color: #ffffff;
    .comment-btn {
      width: 400px;
      height: 65px;
      margin-left: 30px;
      color: #a7a7a7;
      border: 1px solid #a7a7a7;
    }
    .icon {
      flex: 1;
      display: flex;
      justify-content: space-around;
      .icon-btn {
        font-size: 40px;
      }
    }
  }
  //载失败的模块

  .error-warp {
    display: flex;
    flex-flow: column;
    align-items: center;
    padding-top: 200px;
    .error-text {
      font-size: 32px;
      color: #b4b4b4;
    }
    .error-btn {
      border: 0;
      color: #b4b4b4;
      height: 70px;
    }
  }
  /deep/.van-icon-failure {
    font-size: 200px;
    color: #b4b4b4;
  }
  .van-list {
    padding-bottom: 80px;
  }
  //弹出层样式
  .van-popup {
    padding-top: 100px;
  }

  .article-write {
    .van-cell {
      margin-bottom: 10px;
    }
  }
}
</style>
