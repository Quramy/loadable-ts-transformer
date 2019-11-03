const path = require("path");
const merge = require('webpack-merge');
const LoadablePlugin = require('@loadable/webpack-plugin');
const commonConfig = require('./webpack.config');

module.exports = () => {
  return merge(commonConfig, {
    output: {
      path: path.resolve(__dirname, 'public'),
      publicPath: '/assets/',
      filename: '[name].[chunkhash].js',
    },
    entry: {
      main: path.resolve(__dirname, 'src/client.tsx'),
    },
    optimization: {
      splitChunks: {
        name: 'vendor',
        chunks: 'initial',
      },
    },
    plugins: [
      new LoadablePlugin(),
    ],
  });
};
