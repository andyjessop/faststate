const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js)$/,
        loader: 'eslint-loader',
        include: /src\//,
        exclude: /node_modules|dist/,
        options: {
          formatter: require('eslint-friendly-formatter'), // eslint-disable-line
          failOnError: false,
          failOnWarning: false,
        },
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'picstore.min.js',
    library: 'picostore',
    libraryTarget: 'umd',
  },
  plugins: [
    new UglifyJSPlugin(),
  ],
};
