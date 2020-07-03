const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const getAssetPath = file => `${process.cwd()}/src/scripts/${file}`;
const getStylePath = file => `${process.cwd()}/src/styles/${file}`;

const entry = {
  admin: [getAssetPath('admin.js'), getStylePath('admin.css')]
};

module.exports = {
  ...defaultConfig,
  entry,
  stats: {
    entrypoints: false,
    modules: false,
    warnings: false
  }
};
