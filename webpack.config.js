const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: "./src/widget.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "widget.js",
    libraryTarget: "umd",
    library: "AIChat",
    umdNamedDefine: true,
    globalObject: "this", // Añadido para asegurar compatibilidad cross-platform
    publicPath: "/", // Añadido para asegurar rutas correctas
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "index.html",
    }),
    new Dotenv(),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 3010,
    hot: true,
  },
};
