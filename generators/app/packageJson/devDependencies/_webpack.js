/**
 * Dependencies for Webpack
 *
 * @package  generator-lilly
 * @author   Martin Herweg <info@martinherweg.de>
 */

'use strict';
const extend = require('deep-extend');

exports.webpackDependencies = {
  'babel-loader': '8.0.0-beta.0',
  'clean-webpack-plugin': '^0.1.18',
  'copy-webpack-plugin': '^4.3.1',
  'cross-env': '^5.1.3',
  'css-loader': '^0.28.9',
  'eslint-loader': '^1.9.0',
  'extract-text-webpack-plugin': '^3.0.2',
  'file-loader': '^1.1.6',
  'friendly-errors-webpack-plugin': '^1.6.1',
  'image-webpack-loader': '^4.0.0',
  'inject-loader': '^3.0.1',
  'html-webpack-plugin': '^2.30.1',
  'http-proxy-middleware': '^0.17.4',
  'json-loader': '^0.5.7',
  'lodash-webpack-plugin': '^0.11.4',
  'node-sass': '^4.7.2',
  'optimize-css-assets-webpack-plugin': '^3.2.0',
  'postcss-loader': '^2.0.10',
  'sass-loader': '^6.0.6',
  'style-loader': '^0.20.1',
  'stylelint-webpack-plugin': '^0.10.1',
  'url-loader': '^0.6.2',
  webpack: '^3.10.0',
  'webpack-bundle-analyzer': '^2.3.1',
  'webpack-config-utils': '^2.3.0',
  'webpack-dev-middleware': '^2.0.4',
  'webpack-hot-middleware': '^2.21.0',
  'write-file-webpack-plugin': '^4.2.0',
};

exports.packageJsonWebpack = (files = {}) => {
  extend(files.pkg, {
    devDependencies: exports.webpackDependencies,
  });
};
