import request from "@/utils/request";
//添加用户频道
export const addUserChannels = (channels) =>
  request({ url: "/v1_0/user/channels", data: { channels }, method: "patch" });
//删除用户频道
export const deleteUserChannels = (target) =>
  request({ url: `/v1_0/user/channels/${target}`, method: "delete" });
