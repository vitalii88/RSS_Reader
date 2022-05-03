import path, { dirname } from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import { fileURLToPath } from 'url';

const dir = dirname(fileURLToPath(import.meta.url));

export default {
  mode: process.env.NODE_ENV || 'development',
  output: {
    path: path.resolve(dir, 'dist'),
  },

  module: {
    rules: [
      {
        test: /\.s?css/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath: '' },
          },
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],

  devtool: 'source-map',
  devServer: {
    static: {
      directory: path.join(dir, 'dist'),
    },
    port: 9000,
    compress: true,
  },
};
