const PrerenderSPAPlugin = require("prerender-spa-plugin");
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;
const path = require("path");

const staticDir = path.join(path.resolve(__dirname, ".."), "dist", "public");

module.exports = {
  outputDir: staticDir,
  productionSourceMap: false,
  configureWebpack: {
    plugins: process.env.NODE_ENV === 'production' ? [
      new PrerenderSPAPlugin({
        staticDir: staticDir,
        routes: ["/", "/404"],

        renderer: new Renderer({
          headless: true,
        }),
      }),
    ] : [],
    devServer: {
      proxy: {
        "/api": {
          target: "http://localhost:3003",
        },
      },
    },
  },
};
