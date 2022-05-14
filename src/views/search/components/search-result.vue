<template>
  <div class="result-container">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
    >
      <van-cell
        v-for="(item, index) in list"
        :key="index"
        :title="item.title"
        :to="'/article/' + item.art_id"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from "@/api/search";
export default {
  name: "SearchResult",
  props: {
    searchText: {
      typeof: String,
      required: true,
    },
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      per_page: 20,
      error: false,
    };
  },
  created() {},
  methods: {
    async onLoad() {
      // 异步更新数据

      try {
        const { data } = await getSearchResult({
          page: this.page, //请求的页码数
          per_page: this.per_page, //请求的每页数量
          q: this.searchText, //请求的关键词
        });

        /*  if (Math.random() > 0.5) {
          JSON.parse("jiof");
        } */
        const { results } = data.data;
        //2.把数据放入list数组中
        this.list.push(...results);
        //3.关闭加载中的转态
        this.loading = false;
        //4.判读是否还有数据
        if (results.length) {
          //页码数加一
          this.page++;
        } else {
          //没有数据则把finished设为true
          this.finished = true;
        }
      } catch (err) {
        //如果请求失败
        this.error = true;
        this.loading = false;

        this.$toast("获取数据失败");
      }

      // 加载状态结束
    },
  },
};
</script>

<style lang="less" scoped>
.result-container {
  padding-top: 108px;
}
</style>
