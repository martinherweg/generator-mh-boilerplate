/**
 * Dependencies for Webpack
 *
 * @package  generator-lilly
 * @author   Martin Herweg <info@martinherweg.de>
 */

'use strict';
const extend = require('deep-extend');

exports.webpackDependencies = require('./_webpackDependencies');

exports.packageJsonWebpack = (files = {}) => {
  extend(files.pkg, {
    devDependencies: exports.webpackDependencies,
  });
};
