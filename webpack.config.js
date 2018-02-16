const path = require('path');

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
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'picstore.js',
    library: 'picostore',
    libraryTarget: 'umd',
  },
};
