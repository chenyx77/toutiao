<template>
  <div class="user-profile">
    <van-nav-bar
      title="个人信息"
      left-arrow
      left-text="返回"
      @click-left="$router.back()"
    />
    <input type="file" hidden ref="file" @change="onFileChange" />
    <van-cell title="头像" @click="onChangePhoto" is-link>
      <van-image class="header-image" round fit="cover" :src="user.photo" />
    </van-cell>
    <van-cell
      title="昵称"
      is-link
      :value="user.name"
      @click="localNameShow = true"
    ></van-cell>
    <van-cell
      title="性别"
      is-link
      :value="gender[user.gender]"
      @click="genderShow = true"
    ></van-cell>
    <van-cell
      title="生日"
      @click="birthdayShow = true"
      is-link
      :value="user.birthday"
    ></van-cell>

    <!-- 修改姓名 -->
    <van-popup
      v-model="localNameShow"
      position="bottom"
      :style="{ height: '50%' }"
    >
      <LocalName
        v-if="localNameShow"
        @cancel="localNameShow = false"
        v-model="user.name"
      />
    </van-popup>
    <!-- 修改姓名 -->
    <!-- 修改性别 -->
    <van-popup v-model="genderShow" position="bottom">
      <Gender
        v-if="genderShow"
        v-model="user.gender"
        @cancel="genderShow = false"
      />
    </van-popup>

    <!-- 修改性别 -->
    <!-- 修改生日 -->
    <van-popup v-model="birthdayShow" position="bottom">
      <Birthday
        v-model="user.birthday"
        @close="birthdayShow = false"
        v-if="birthdayShow"
        @cancel="birthdayShow = false"
      />
    </van-popup>
    <!-- 修改生日 -->
    <!-- 修改头像 -->
    <van-popup
      v-model="userPhotoShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <UserPhoto
        :img="img"
        @close="userPhotoShow = false"
        @updataPhoto="user.photo = $event"
      />
    </van-popup>
    <!-- 修改头像 -->
  </div>
</template>

<script>
import { getUserProfile } from "@/api/user";
import LocalName from "./components/local-name";
import Gender from "./components/gender";
import Birthday from "./components/birthday";
import UserPhoto from "./components/user-photo";
export default {
  name: "UserProfile",
  components: {
    LocalName,
    Gender,
    Birthday,
    UserPhoto,
  },
  created() {
    this.userProfile();
  },

  data() {
    return {
      user: {},
      gender: ["男", "女"],
      localNameShow: false, //修改姓名弹出层
      genderShow: false,
      birthdayShow: false,
      userPhotoShow: false,
      img: null, //点击选择的图片的地址
    };
  },
  methods: {
    async userProfile() {
      try {
        const { data } = await getUserProfile();
        this.user = data.data;
      } catch (error) {
        console.log(error);
        this.$toast.fail("身份过期,请重新登录");
      }
    },
    //点击头像
    onChangePhoto() {
      //因为input框已经隐藏了，通过点击其他的框来触发原来的input的的点击事件
      this.$refs.file.click();
    },
    //@change这个事件什么时候触发?pc端为例: 在选择了电脑文件并点击确认后触发
    onFileChange() {
      /*
      this.$refs.file.files[0] 
      获取到的是一个复杂对象，里面包含图片的大小，图片的类型，当前的时间
       console.log(1111, this.$refs.file.files[0]);
      */
      /* 
      进过window.URL.createObjectURL会获得一个http格式的url路径
     */
      this.img = window.URL.createObjectURL(this.$refs.file.files[0]);

      //展示弹出层
      this.userPhotoShow = true;
      //当第二次选择同一个文件时，@change函数就会不被触发，我们可以令this.$refs.file的value等于空
      this.$refs.file.value = "";
    },
  },
};
</script>

<style lang="less" scoped>
.user-profile {
  /deep/.van-nav-bar__content {
    .van-icon {
      color: #fff;
    }
    .van-nav-bar__text {
      color: #fff;
    }
    .van-nav-bar__title {
      color: #fff;
    }
  }
  .van-cell {
    align-items: center;
    font-size: 30px;

    .van-cell__value {
      padding: 0;
      padding-top: 5px;
    }
  }
  .header-image {
    width: 80px;
    height: 80px;
  }
}
</style>
