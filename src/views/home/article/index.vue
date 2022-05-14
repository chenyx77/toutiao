<template>
  <div class="article-list">
    <!-- 文章详情列表栏 -->
    <!--
      List 列表组件：瀑布流滚动加载，用于展示长列表。

      List 组件通过 loading 和 finished 两个变量控制加载状态，
      当组件初始化或滚动到到底部时，会触发 load 事件并将 loading 自动设置成 true，此时可以发起异步操作并更新数据，
      数据更新完毕后，将 loading 设置成 false 即可。
      若数据已全部加载完毕，则直接将 finished 设置成 true 即可。

      - load 事件：
        + List 初始化后会触发一次 load 事件，用于加载第一屏的数据。
        + 如果一次请求加载的数据条数较少，导致列表内容无法铺满当前屏幕，List 会继续触发 load 事件，直到内容铺满屏幕或数据全部加载完成。

      - loading 属性：控制加载中的 loading 状态
        + 非加载中，loading 为 false，此时会根据列表滚动位置判断是否触发 load 事件（列表内容不足一屏幕时，会直接触发）
        + 加载中，loading 为 true，表示正在发送异步请求，此时不会触发 load 事件

      - finished 属性：控制加载结束的状态
        + 在每次请求完毕后，需要手动将 loading 设置为 false，表示本次加载结束
        + 所有数据加载结束，finished 为 true，此时不会触发 load 事件
     -->
    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      :success-text="refreshSuccessText"
      :success-duration="1500"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <articleItem
          v-for="item in list"
          :key="item.id"
          :item="item"
        ></articleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { articleList } from "@/api/article";
import articleItem from "@/components/article-item";
export default {
  name: "Article",
  components: {
    articleItem,
  },
  props: {
    channel: {
      typeof: Object,
      require: true,
    },
  },
  data() {
    return {
      list: [], //存放数据的数组
      loading: false, //下拉加载更对的数据
      finished: false, //数据以及全部加载完成加载完成，
      timestamp: null, //请求的数据戳
      error: false, //错误提示
      isLoading: false, //下拉刷新
      refreshSuccessText: "刷新成功", //刷新文案提示
    };
  },
  methods: {
    //加载页面发送请求
    async onLoad() {
      // 1.发送请求展示数据，根据当前时间的时间戳

      try {
        const { data } = await articleList({
          channel_id: this.channel.id, //频道id
          timestamp: this.timestamp || Date.now(), //当前时间戳时间
        });

        const { results } = data.data;

        // 2.把获取到的数据放入数组中,利用扩展运算符，把数据里的每个对象加入数组中
        this.list.push(...results);
        // 3.加载状态结束,但是数据为铺满整个屏幕，所以再次发送请求，时间戳在上一次返回的结果中
        this.loading = false; //第一次加载10条数据结束，因为没有满屏所以整个函数将会再次触发
        //根据上一次请求的结果是否为空，判断是否以及加载全部数据
        if (results.length) {
          //更新获取下一页的时间戳，第二次请求的时候携带该时间戳
          this.timestamp = data.data.pre_timestamp;
        } else {
          //数据全部加载完
          this.finished = true;
        }
        //4.数据全部加载完
      } catch (err) {
        this.loading = false; //关闭加载效果
        this.error = true; //开启错误提示
      }
    },
    //下拉刷新
    async onRefresh() {
      try {
        const { data } = await articleList({
          channel_id: this.channel.id, //频道id
          timestamp: Date.now(), //当前时间戳时间
        });

        const results = data.data.results;
        //把最新的数据放入到文章列表头部
        this.list.unshift(...results);
        //关闭加载状态
        this.isLoading = false;
        this.refreshSuccessText = `刷新成功,更新了${results.length}条数据`;
      } catch (err) {
        this.isLoading = false; // 关闭下拉刷新的 loading 状态
        this.refreshSuccessText = "刷新失败,请重试";
      }
    },
  },
  //#region
  /*  onLoad() {
      console.log("onload");
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1);
        }

        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true;
        }
      }, 1000);
    },*/
  //#endregion
};
</script>

<style lang="less" scoped>
.article-list {
  margin-bottom: 100px;
  // margin-top: 174px;
  //设置每个频道自己的滚动容器，记住滚动位置
  height: 100vh;
  overflow-y: auto;
}
</style>
