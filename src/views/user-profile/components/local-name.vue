<template>
  <div class="local-name">
    <van-nav-bar
      left-text="取消"
      right-text="确认"
      @click-left="$emit('cancel')"
      @click-right="confirm"
    />
    <van-field
      v-model="localName"
      rows="2"
      autosize
      type="textarea"
      maxlength="11"
      placeholder="输入昵称..."
      show-word-limit
    />
  </div>
</template>

<script>
import { updataUserInfo } from "@/api/user";
export default {
  name: "LocalName",
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      localName: this.value,
    };
  },
  methods: {
    async confirm() {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: "加载中",
      });
      try {
        await updataUserInfo({
          name: this.localName, //修改后的名字
        });
        //关闭弹出层
        this.$emit("cancel");
        //更新视图
        this.$emit("input", this.localName);
        //弹出成功提示
        this.$toast.success("修改成功");
      } catch (error) {
        console.log(error);
        this.$toast.fail("修改失败,请稍后重试");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.local-name {
  .van-nav-bar {
    &::after {
      border: 0;
    }
  }
  /deep/.van-nav-bar__content {
    background-color: #fff;
    .van-nav-bar__text {
      color: blue !important;
    }
  }
  /deep/.van-field {
    .van-cell__value {
      padding: 0 10px;
      background-color: rgb(237, 234, 234);
    }
  }
}
</style>
