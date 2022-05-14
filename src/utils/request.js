//引入axios
import axios from "axios";
import store from "@/store";
import jsonBig from "json-bigint";
//创建axios实例
const request = axios.create({
  baseURL: "http://toutiao.itheima.net",
  // transformResponse 允许自定义原始的响应数据（字符串）
  transformResponse: [
    function (data) {
      try {
        // 如果转换成功则返回转换的数据结果
        return jsonBig.parse(data);
      } catch (err) {
        // 如果转换失败，则包装为统一数据格式并返回
        return {
          data,
        };
      }
    },
  ],
});
//设置拦截器
request.interceptors.request.use(
  function (config) {
    // Do something before request is sent

    if (store.state.user.token) {
      config.headers.Authorization = `Bearer ${store.state.user.token.token}`;
    }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default request;
