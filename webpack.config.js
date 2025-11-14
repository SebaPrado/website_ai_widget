const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
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
      {
        test: /\.svg$/,
        exclude: /public/,
        type: 'asset/inline',  // Esto convertirá los SVG a base64
      }
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "public",
          to: ".",
          filter: (resourcePath) => {
            // Copiar todos los archivos excepto index.html (que se maneja con HtmlWebpackPlugin)
            return !resourcePath.endsWith("index.html");
          },
        },
      ],
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
