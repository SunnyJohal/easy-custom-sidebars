const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  ...defaultConfig,

  // optimization: {
  //   ...defaultConfig.optimization,
  //   splitChunks: {
  //     cacheGroups: {
  //       styles: {
  //         name: 'styles',
  //         test: /\.css$/,
  //         enforce: true
  //       }
  //     }
  //   }
  // },

  plugins: [
    ...defaultConfig.plugins,
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],

  module: {
    ...defaultConfig.module,
    rules: [
      ...defaultConfig.module.rules,
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { hmr: process.env.NODE_ENV === 'development' }
          },
          'css-loader'
        ]
      }
    ]
  }
};
