import { setItem, getItem } from "@/utils/storage";
const userModule = {
  state: {
    // 你这个getItem首次是会执行的，但是里面并没有东西，只有初始化的时候会执行一次，后面需要mutation去更改，初始化的时候里面是null，你页面刷新的时候它会重新初始化的
    token: getItem("TOKEN_USER"),
  },
  mutations: {
    setUser(state, data) {
      setItem("TOKEN_USER", data);
      state.token = data;
     
    },
  },

  getters: {},
};

export default userModule;
