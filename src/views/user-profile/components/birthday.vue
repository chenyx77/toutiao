<template>
  <div class="birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择生日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('cancel')"
      @confirm="confirm"
    />
  </div>
</template>

<script>
import { updataUserInfo } from "@/api/user";
import dayjs from "dayjs";
export default {
  name: "Birthday",
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      minDate: new Date(1950, 0, 1), //可以选择最小时间
      maxDate: new Date(), //可以选最大时间,令他等于当前时间
      currentDate: new Date(this.value), //当前时间
    };
  },
  methods: {
    async confirm() {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: "加载中",
      });
      let date = dayjs(this.currentDate).format("YYYY-MM-DD");
      try {
        await updataUserInfo({
          birthday: date, //所选的格式化后的时间
        });
        //弹出成功提示
        this.$toast.success("修改成功");
        //关闭弹出层
        this.$emit("close");
        //渲染视图
        this.$emit("input", date);
      } catch (error) {
        console.log(error);
        this.$toast.fail("获取数据失败,请重试");
      }
    },
  },
};
</script>

<style></style>
