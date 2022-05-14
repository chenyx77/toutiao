<template>
  <div class="search-histoy">
    <van-cell>
      <span slot="title">搜索历史</span>
      <div v-show="clearShow">
        <span @click="allDeleteHistoy">全部删除</span>
        &nbsp;&nbsp;
        <span @click="clearShow = false">完成</span>
      </div>
      <van-icon name="delete-o" v-show="!clearShow" @click="clearShow = true" />
    </van-cell>
    <van-cell
      icon="search"
      v-for="(item, index) in searchHistoyShow"
      :key="index"
      @click="toSearch(item)"
    >
      <span slot="title">{{ item }}</span>
      <van-icon name="close" v-show="clearShow" @click="deleteHistoy(index)" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: "SearchHistoy",
  data() {
    return {
      clearShow: false,
    };
  },
  props: {
    searchHistoyShow: {
      typeof: [],
      required: true,
    },
  },
  methods: {
    //删除全部信息
    allDeleteHistoy() {
      this.searchHistoyShow.splice(0);
      this.clearShow = false;
    },
    //删除一条信息
    deleteHistoy(index) {
      this.searchHistoyShow.splice(index, 1);
    },
    //点击联想建议的框，把本文放入发到输入框中
    toSearch(text) {
      console.log(111);
      this.$emit("searchTitle", text);
    },
  },
};
</script>

<style lang="less" scoped>
.search-histoy {
  padding-top: 108px;
}
</style>
