<template>
  <div class="search-suggestion" v-show="list.length">
    <van-cell
      icon="search"
      v-for="(text, index) in list"
      :key="index"
      @click="toSearch(text)"
    >
      <div slot="title" v-html="higth(text)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestion } from "@/api/search";
import { debounce } from "lodash";
export default {
  name: "SearchSuggestion",
  props: {
    searchText: {
      typeof: String,
      required: true,
    },
  },
  data() {
    return {
      list: [],
    };
  },
  methods: {
    searchSuggestion: debounce(async function () {
      try {
        const { data } = await getSearchSuggestion({
          q: this.searchText,
        });
        this.list = data.data.options;
      } catch (error) {
        this.$toast("获取数据失败");
      }
    }, 200),
    /*   async searchSuggestion() {
      try {
        const { data } = await getSearchSuggestion({
          q: this.searchText,
        });
        this.list = data.data.options;
      } catch (error) {
        this.$toast("获取数据失败");
      }
    }, */
    higth(text) {
      // `<span style="color: #3296fa">${this.searchText}</span>`
      const heightStr = `<span style="color: #3296fa">${this.searchText}</span>`;
      //动态创建一个正则表达式
      /*
      1.第一个参数，匹配的规格，如果是变量 不需要写‘’ 和 //
      2.第二个参数，一些配置，g i 等
      */
      const reg = new RegExp(this.searchText, "gi");
      if (text) {
        return text.replace(reg, heightStr);
      }
    },
    //点击联想建议的框，把本文放入发到输入框中
    toSearch(text) {
      this.$emit("searchTitle", text);
    },
  },
  watch: {
    searchText: {
      //输入框输入文字才会渲染页面，所以第一次输入不会被监听到，因为组件还没有渲染
      handler(value) {
        //根据输入的内容发送请求，获取联想建议的数据，
        this.searchSuggestion();
      },
      //开启立即监听
      immediate: true,
    },
  },
};
</script>

<style lang="less" scoped>
.search-suggestion {
  padding-top: 108px;
}
</style>
