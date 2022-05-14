<template>
  <div class="search-container">
    <!-- from表单会手机端的输入键盘添加一个搜索的按键，如果没有则不会 -->
    <form action="/">
      <van-search
        background="#3296fa"
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        @focus="searchEnd = false"
      />
    </form>
    <searchResult v-if="searchEnd" :searchText="searchText" />
    <searchSuggestion
      v-else-if="searchText"
      :searchText="searchText"
      @searchTitle="searchTitle"
    />

    <searchHistoy v-else 
      @searchTitle="searchTitle"
    :searchHistoyShow="searchHistoyShow" />
  </div>
</template>

<script>
import searchHistoy from "./components/search-histoy.vue";
import searchResult from "./components/search-result.vue";
import searchSuggestion from "./components/search-suggestion.vue";
import { setItem, getItem } from "@/utils/storage";
export default {
  name: "Search",
  data() {
    return {
      searchText: "",
      searchEnd: false,
      searchHistoyShow: getItem("SEARCH_HISTOY") || [],
    };
  },
  components: {
    searchHistoy,
    searchResult,
    searchSuggestion,
  },
  methods: {
    //处理历史记录
    searchHiosty() {
      //保存搜索文本
      //历史记录里面不出现重复的记录
      //如果重复搜素，则把原来的移除，把当前的从新添加
      const index = this.searchHistoyShow.indexOf(this.searchText);
      if (index !== -1) {
        //说明搜搜内容重复
        this.searchHistoyShow.splice(index, 1);
      }
      this.searchHistoyShow.unshift(this.searchText);
    },
    //当点击搜索并按下按钮的时候，就会触发该该函数
    onSearch() {
      this.searchHiosty();
      //展示搜索结果
      this.searchEnd = true;
    },
    onCancel() {
      this.$router.back();
    },

    //点击联想建议的内容发送请求然后让输入框的内容也显示为联想建议的内容
    searchTitle(text) {
      //把联想建议中的title展示到搜索框中
      this.searchText = text;
      //保存搜索记录
      this.searchHiosty();
      //展示搜索结果
      this.searchEnd = true;
    },
  },
  watch: {
    //监听的是一个本地存储记录的数组，value为最新的数组
    searchHistoyShow(value) {
      setItem("SEARCH_HISTOY", value);
    },
  },
};
</script>

<style lang="less" scoped>
.search-container {
  .van-search__action {
    color: #fff;
  }
  .van-search {
    position: fixed;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
