var path = require('path');
var fs = require('fs');

/*
* ludic-vue dev config
*/

module.exports = {
  entry: "./src/main.js",
  output: {
    libraryTarget: 'umd',
    library: 'Ludic',
    path: __dirname + '/dist',
    filename: "ludic-vue.umd.js"
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this nessessary.
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: [
            ["es2015",{modules: false}],
            "stage-1",
          ]
        },
      },
      {
        test: /\.css$/,
        loader: "style!css",
      },
    ]
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src/'),
      components: 'src/components',
    },
    extensions: ['.js', '.vue', '.scss', '.json'],
  },
  externals : {
    ludic: {
      commonjs: '@ludic/ludic',
    },
    vue: 'vue',
  },
  devtool: '#source-map'
};
