const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
  resolveLoader: {
    // //配置别名
    // alias: {
    //     'inline1-loader': path.resolve(__dirname, 'loaders', 'inline1-loader.js'),
    //     'inline2-loader': path.resolve(__dirname, 'loaders', 'inline2-loader.js'),
    //     'babel-loader': path.resolve(__dirname, 'loaders', 'babel-loader')
    // },
    //配置去哪些目录里找loader
    modules: ["node_modules", path.resolve(__dirname, "src/MyLoader")],
  },
  module: {
    rules: [
      {
        test: /.(js)$/,
        exclude: /node_modules/,
        enforce: 'pre',
        use: ["pre1-loader", "pre2-loader"],
      },
      {
        test: /.(js)$/,
        exclude: /node_modules/,
        use: ["normal1-loader", "normal2-loader"],
      },
      {
        test: /.(js)$/,
        exclude: /node_modules/,
        enforce: 'post',
        use: ["post1-loader", "post2-loader"],
      },
      // {
      //   test: /.css$/,
      //   use: ['style-loader', 'css-loader']
      // },
      // {
      //   test: /.less$/,
      //   use: ['style-loader', 'css-loader', 'less-loader']
      // },
      // {
      //   test: /.(js|jsx)$/,
      //   exclude: /node_modules/,
      //   use: 'babel-loader'
      // }
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
  ],
};