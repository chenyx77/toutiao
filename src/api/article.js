import request from "@/utils/request";
//获取推荐新闻
export const articleList = (params) =>
  request({
    url: "/v1_0/articles?",
    params,
    method: "get",
  });

//获取所以频道列表
export const allChannels = () =>
  request({
    url: "/v1_0/channels",
    method: "get",
  });
//获取文章的详情
export const getArticleDetail = (article_id) =>
  request({
    url: `/v1_0/articles/${article_id}`,
    method: "get",
  });
//收藏文章
export const addArticleCollect = (target) =>
  request({
    url: "/v1_0/article/collections",
    method: "post",
    data: { target },
  });
//取消文章收藏
export const deleteArticleCollect = (target) =>
  request({
    url: `/v1_0/article/collections/${target}`,
    method: "delete",
  });
//文章点赞
export const addArticleLiked = (target) =>
  request({
    url: "/v1_0/article/likings",
    method: "post",
    data: { target },
  });
//取消文章点赞
export const deleteArticleLiked = (target) =>
  request({
    url: `/v1_0/article/likings/${target}`,
    method: "delete",
  });
//获取文章评论或者回复评论
export const addArticleComment = (params) =>
  request({
    url: "/v1_0/comments",
    method: "get",
    params,
  });
//对评论或者评论回复点赞
export const addArticleCommentLiked = (target) =>
  request({
    url: "/v1_0/comment/likings",
    method: "post",
    data: { target },
  });
//取消对评论或者评论回复点赞
export const deleteArticleCommentLiked = (target) =>
  request({
    url: `/v1_0/comment/likings/${target}`,
    method: "delete",
  });
//对文章进行评论
export const sendArticleComment = (data) =>
  request({
    url: "/v1_0/comments",
    data,
    method: "post",
  });
