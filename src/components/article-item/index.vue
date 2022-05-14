<template>
  <div class="article-item">
    <van-cell-group>
      <van-cell :to="'/article/' + item.art_id">
        <div slot="title" class="cell-text van-multi-ellipsis--l2">
          {{ item.title }}
        </div>
        <!-- 定义右侧一张图片插槽 -->
        <van-image
          v-if="item.cover.type === 1"
          slot="default"
          width="100"
          height="100"
          :src="item.cover.images[0]"
          fit="cover"
          class="one-img"
        />
        <!-- 定义三张图片时候的插槽 -->
        <div class="label-images" slot="label" v-if="item.cover.type === 3">
          <van-image
            v-for="(img, index) in item.cover.images"
            :key="index"
            width="100"
            height="100"
            :src="img"
            fit="cover"
          />
        </div>
        <!-- 使用插槽定义图片下方的小体文字 -->
        <div class="label-text" slot="label">
          <span class="item">{{ item.aut_name }}</span>
          <span class="item">{{ item.comm_count }}评论</span>
          <!-- <span class="item">{{ item.pubdate | relativeTime }}</span> -->
        </div>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  name: "articleItem",
  props: {
    item: {
      type: Object,
      require: true,
    },
  },
};
</script>

<style lang="less" scoped>
.article-item {
  .van-cell__value {
    flex: unset;
    width: 232px;
    height: 146px;
    margin-left: 25px;
  }
  .one-img {
    width: 100%;
    height: 146px !important;
  }
  .cell-text {
    font-size: 32px;
  }
  .label-images {
    height: 168px;
    display: flex;
    padding: 10px 0 30px;
    .van-image {
      height: 168px !important;
      flex: 1;
      &:not(:last-child) {
        margin-right: 5px;
      }
    }
  }
  .label-text {
    font-size: 23px;
    span.item {
      margin-right: 30px;
    }
  }
}
</style>
