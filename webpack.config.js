const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReplacePlugin = require("./src/MyPlugin/replace-plugin");

module.exports = {
  mode: "development",
  entry: "./src/main.js",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "output"),
  },
  devtool: false,
  // devServer: {
  //   hot: true, // 开启热更新；
  //   port: 3500,
  //   open: true,
  //   static: {
  //     directory: path.join(__dirname, "output")
  //   },
  // },
  module: {
    rules: [
      // {
      //   test: /.css$/,
      //   use: ['style-loader', 'css-loader']
      // },
      // {
      //   test: /.less$/,
      //   use: ['style-loader', 'css-loader', 'less-loader']
      // },
      {
        test: /.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(), // 使用插件
    new HtmlWebpackPlugin({
      title: "ceshi",
      meta: {
        viewport: "width=device-width",
      },
      template: "./src/index.html",
    }),
    new ArchivePlugin(),
  ],
};
