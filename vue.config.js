const { defineConfig } = require('@vue/cli-service')
const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")


module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, 'src/'),
        "store": path.resolve(__dirname, 'src/store'),
        "components": path.resolve(__dirname, 'src/components'),
        "composition": path.resolve(__dirname, 'src/composition'),
      },
      fallback: {
        "stream": require.resolve("stream-browserify"),
        "assert": require.resolve("assert/"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "url": require.resolve("url/")
      }
    },
    plugins: [
      new NodePolyfillPlugin()
    ]
  },
})
