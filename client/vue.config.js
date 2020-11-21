module.exports = {
  outputDir: "../dist/public",
  productionSourceMap: false,
  configureWebpack: {
    devServer: {
      proxy: {
        "/api": {
          target: "http://localhost:3003",
        },
      },
    },
  },
};
