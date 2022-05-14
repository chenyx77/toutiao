<template>
  <div class="photo">
    <img :src="img" ref="img" />
    <div class="cancel-confirm">
      <div @click="$emit('close')">取消</div>
      <div @click="confirm">确认</div>
    </div>
  </div>
</template>

<script>
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
import { updataUserPhoto } from "@/api/user";
export default {
  name: "UserPhoto",
  props: {
    img: {
      //可以是url地址，或者是bolb对象
      type: [String, Object],
      required: true,
    },
  },
  data() {
    return {
      cropper: null,
    };
  },
  mounted() {
    //获取到dom元素节点,
    const image = this.$refs.img;

    this.cropper = new Cropper(image, {
      viewMode: 1, //试图模式，剪切框架不可以超出图片
      dragMode: "move", //移动模式，move可以移动图片
      aspectRatio: 1, //固定裁剪框的比例，一般是正方形，选用1/1 ，简写1
      autoCropArea: 1, //自定义裁剪区的大小，它应该是一个介于 0 和 1 之间的数字。定义自动裁剪区域大小（百分比）
      cropBoxMovable: false, //启用此选项可通过拖动来移动裁剪框。
      cropBoxResizable: false, //启用可以缩放裁剪框的大小
      background: false, //不启用默认的背景
    });
  },
  methods: {
    confirm() {
      // 如果 Content-Type 要求是	application/json	，则 data 传普通对象 {}
      // 如果 Content-Type 要求是	multipart/form-data	，则 data 传 FormData 对象
      // 纵观所有数据接口，你会发现大多数的接口都要求 Content-Type 要求是	application/json
      // 一般只有涉及到文件上传的数据接口才要求Content-Type 要求是	multipart/form-data
      // 这个时候传递一个 FormData 对象
      console.log(this.cropper);
      //纯客户端裁切文件，利用getCroppedCanvas()获取裁切的文件对象
      this.cropper.getCroppedCanvas().toBlob((blob) => {
        const formData = new FormData();
        //向 FormData 中添加新的属性值，FormData 对应的属性值存在也不会覆盖原值，而是新增一个值，如果属性不存在则新增一项属性值。
        formData.append("photo", blob);
        this.updataPhoto(formData);
      });
    },
    async updataPhoto(formData) {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: "加载中",
      });
      try {
        const { data } = await updataUserPhoto(formData);
        //关闭弹出
        this.$emit("close");
        //成功提示
        this.$toast.success("修改成功");
        //更新视图
        this.$emit("updataPhoto", data.data.photo);
      } catch (error) {
        this.$toast.fail("身份过期,请尝试重新登录");
        this.$router.push("/login");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.photo {
  height: 100%;
  background-color: #000;
  img {
    display: block;
    max-width: 100%;
  }
  .cancel-confirm {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    font-size: 30px;

    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    & div {
      width: 90px;
      height: 90px;
      text-align: center;
      line-height: 90px;
      color: #fff;
    }
  }
}
</style>
