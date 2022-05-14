export default [
  {
    path: "/article/:article_id",
    name: "article",
    component: () => import("@/views/article"),
    //使用props解耦路由参数
    props: true,
  },
  //编辑用户资料
  {
    path: "/user/profile",
    name: "user-profile",
    component: () => import("@/views/user-profile"),
    //使用props解耦路由参数
  },
  //登录页面
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login"),
  },
  //搜素模块
  {
    path: "/search",
    name: "search",
    component: () => import("@/views/search"),
  },
  {
    path: "/layout",
    name: "layout", //设置了默认子路由，那么父路由的name属性将会无效
    component: () => import("@/views/layout"),
    children: [
      {
        path: "/home",
        name: "home",
        component: () => import("@/views/home"),
      },
      {
        path: "/qa",
        name: "qa",
        component: () => import("@/views/qa"),
      },
      {
        path: "/video",
        name: "video",
        component: () => import("@/views/video"),
      },
      {
        path: "/my",
        name: "my",
        component: () => import("@/views/my"),
      },
    ],
  },
  //从定向
  {
    path: "/",
    redirect: "/home",
  },
];
