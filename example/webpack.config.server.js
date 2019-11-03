const path = require("path");
const merge = require('webpack-merge');
const commonConfig = require('./webpack.config');

module.exports = () => {
  return merge(commonConfig, {
    target: 'node',
    output: {
      path: path.resolve(__dirname, 'dist-server'),
      filename: '[name].js',
    },
    entry: {
      server: path.resolve(__dirname, 'src/server.tsx'),
    },
  });
};
