const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const getAssetPath = (file) => `${process.cwd()}/src/scripts/${file}`;

const entry = {
  admin: [getAssetPath('admin/admin.js')],
};

module.exports = {
  ...defaultConfig,
  entry,
  stats: {
    entrypoints: false,
    modules: false,
    warnings: false,
  },
};
