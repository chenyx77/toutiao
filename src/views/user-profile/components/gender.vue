<template>
  <div class="gender">
    <van-picker
      ref="genderPicker"
      show-toolbar
      title="性别"
      :columns="columns"
      :default-index="value"
      @cancel="$emit('cancel')"
      @confirm="confirm"
      @change="onChange"
    />
  </div>
</template>

<script>
import { updataUserInfo } from "@/api/user";

export default {
  name: "Gender",
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      columns: ["男", "女"],
      localGender: 0,
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
        // 你试过加上这个代码吗
        /*  let gender = parseInt(this.$refs.genderPicker.getIndexes().toString());
        console.log(gender); */
        await updataUserInfo({
          //方法获取到的是一个选择项的数组，我们需要进行转换
          /*  gender: this.$refs.genderPicker.getIndexes().toString(), //修改后的性别 */
          gender: this.localGender,
        });

        //关闭弹出层
        this.$emit("cancel");
        //更新视图
        this.$emit("input", this.localGender);
        //弹出成功提示
        this.$toast.success("修改成功");
      } catch (error) {
        console.log(error);
        this.$toast.fail("修改失败,请稍后重试");
      }
    },
    onChange(picker, values, index) {
      this.localGender = index;
    },
  },
};
</script>

<style lang="less" scoped>
.gender {
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
}
</style>
