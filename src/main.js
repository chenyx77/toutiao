import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
//引入全局样式
import "@/style/index.less";

//全局引入vant组件
import Vant from "vant";
import "vant/lib/index.css";
//加载动态设置rem基准值
import "amfe-flexible";
//引入dayjs处理相对时间问题
import "@/utils/dayjs";
Vue.use(Vant);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
