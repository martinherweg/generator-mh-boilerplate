/**
 * Dependencies for Webpack
 *
 * @package  generator-lilly
 * @author   Martin Herweg <info@martinherweg.de>
 */

'use strict';
const extend = require('deep-extend');

exports.webpackDependencies = {
  'babel-loader': '^8.0.0-beta.4',
  'clean-webpack-plugin': '^0.1.19',
  'cross-env': '^5.2.0',
  'css-loader': '^1.0.0',
  'eslint-loader': '^2.1.0',
  'file-loader': '^1.1.11',
  'friendly-errors-webpack-plugin': '^1.7.0',
  'inject-loader': '^4.0.1',
  'html-webpack-plugin': '^4.0.0-alpha',
  'http-proxy-middleware': '^0.18.0',
  'mini-css-extract-plugin': '^0.4.1',
  'node-sass': '^4.9.3',
  'optimize-css-assets-webpack-plugin': '^5.0.0',
  'postcss-loader': '^3.0.0',
  'sass-loader': '^7.1.0',
  'style-loader': '^0.22.1',
  'stylelint-webpack-plugin': '^0.10.5',
  'url-loader': '^1.1.1',
  webpack: '^4.16.5',
  webpackbar: '^2.6.3',
  'webpack-cli': '^3.1.0',
  'webpack-bundle-analyzer': '^2.13.1',
  'webpack-config-utils': '^2.3.0',
  'webpack-dev-middleware': '^3.1.3',
  'webpack-hot-middleware': '^2.22.3',
  'webpack-manifest-plugin': '^2.0.3',
  'webpack-stylish': '^0.1.8',
  'write-file-webpack-plugin': '^4.3.2',
};

exports.packageJsonWebpack = (files = {}) => {
  extend(files.pkg, {
    devDependencies: exports.webpackDependencies,
  });
};
