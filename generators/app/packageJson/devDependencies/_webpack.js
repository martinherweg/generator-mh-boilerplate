/**
 * Dependencies for Webpack
 *
 * @package  generator-lilly
 * @author   Martin Herweg <info@martinherweg.de>
 */

'use strict';
const extend = require('deep-extend');

exports.webpackDependencies = {
  'babel-loader': '8.0.0-beta.2',
  'clean-webpack-plugin': '^0.1.19',
  'cross-env': '^5.1.4',
  'css-loader': '^0.28.11',
  'eslint-loader': '^2.0.0',
  'file-loader': '^1.1.11',
  'friendly-errors-webpack-plugin': '^1.6.1',
  'inject-loader': '^4.0.1',
  'html-webpack-plugin': '^3.2.0',
  'http-proxy-middleware': '^0.18.0',
  'mini-css-extract-plugin': '^0.4.0',
  'node-sass': '^4.8.3',
  'optimize-css-assets-webpack-plugin': '^4.0.0',
  'postcss-loader': '^2.1.4',
  'sass-loader': '^7.0.1',
  'style-loader': '^0.21.0',
  'stylelint-webpack-plugin': '^0.10.4',
  'url-loader': '^1.0.1',
  webpack: '^4.6.0',
  webpackbar: '^1.3.0',
  'webpack-cli': '^2.0.15',
  'webpack-bundle-analyzer': '^2.11.1',
  'webpack-config-utils': '^2.3.0',
  'webpack-dev-middleware': '^3.1.2',
  'webpack-hot-middleware': '^2.22.1',
  'webpack-manifest-plugin': '^2.0.1',
  'webpack-stylish': '^0.1.8',
  'write-file-webpack-plugin': '^4.2.0',
};

exports.packageJsonWebpack = (files = {}) => {
  extend(files.pkg, {
    devDependencies: exports.webpackDependencies,
  });
};
