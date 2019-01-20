/**
 * Dependencies for everything that doesn't match css, javascript, gulp or webpack
 *
 * @package  generator-lilly
 * @author   Martin Herweg <info@martinherweg.de>
 */

'use strict';
const extend = require('deep-extend');

exports.otherDependencies = require('./_otherDependencies');

exports.packageJsonOther = (files = {}) => {
  extend(files.pkg, {
    devDependencies: exports.otherDependencies,
  });
};
