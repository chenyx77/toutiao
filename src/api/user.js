import request from "@/utils/request";
import { method } from "lodash";

//登录
export const userLogin = (data) =>
  request({ url: "/v1_0/authorizations", data, method: "post" });
//获取手机验证码
export const mobileCode = (mobile) =>
  request({ url: `/v1_0/sms/codes/${mobile}`, method: "get" });
//获取用户信息
export const getUserInfo = () => request({ url: "/v1_0/user", method: "get" });
//获取用户的频道
export const userChannel = () =>
  request({ url: "/v1_0/user/channels", method: "get" });
//关注用户
export const addFollow = (target) =>
  request({ url: "/v1_0/user/followings", method: "post", data: { target } });
//取消关注用户
export const deleteFollow = (target) =>
  request({ url: `/v1_0/user/followings/${target}`, method: "delete" });
//获取用户个人资料
export const getUserProfile = () =>
  request({
    url: "/v1_0/user/profile",
    method: "get",
  });
//修改用户资料
export const updataUserInfo = (data) => {
  return request({
    url: "/v1_0/user/profile",
    method: "patch",
    data,
  });
};
//编辑用户的头像
export const updataUserPhoto = (data) =>
  request({
    url: "/v1_0/user/photo",
    method: "patch",
    data,
  });
