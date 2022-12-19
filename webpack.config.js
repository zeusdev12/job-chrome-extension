// const path = require("path")
// const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  watch: true,
  entry: {
    'index': './js/react/index.js'
  },
  devtool: 'cheap-module-source-map',
  plugins: [
    // new HtmlWebpackPlugin({
    //     chunks: ["samplepage1"],
    //     template: "src/pages/samplepage1/samplepage1.html",
    //     filename: "samplepage1.html"
    // }),
    // new HtmlWebpackPlugin({
    //     chunks: ["samplepage2"],
    //     template: "src/pages/samplepage2/samplepage2.html",
    //     filename: "samplepage2.html"
    // }),
    // new HtmlWebpackPlugin({
    //     chunks: ["popup"],
    //     template: "src/pages/popup/popup.html",
    //     filename: "popup.html"
    // }),
  ],
  // resolve: {
  //     alias: {
  //         src: path.resolve(__dirname, "src"),
  //         components: path.resolve(__dirname, "src", "components")
  //     }
  // },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
        options: {
          presets: [
            "@babel/preset-env",
            "@babel/preset-react"
          ]
        }
      }
    },
    {
      test: /\.css$/i,
      use: ['style-loader', 'css-loader'],
    },
     {
      test: /\.svg|.png|.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
      use: ['file-loader']
    }]
  }
}