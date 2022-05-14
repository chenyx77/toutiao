import request from "@/utils/request";
//搜索联想建议
export const getSearchSuggestion = (q) =>
  request({ url: "/v1_0/suggestion", params: q, method: "get" });
//搜索结果
export const getSearchResult = (params) =>
  request({ url: "/v1_0/search", method: "get", params });
