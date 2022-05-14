module.exports = {
  lintOnSave: false,
  //开启项目热更新
  chainWebpack: (config) => {
    config.resolve.symlinks(true);
  },
};
