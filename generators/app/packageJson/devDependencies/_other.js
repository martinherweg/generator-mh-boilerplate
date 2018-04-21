/**
 * Dependencies for everything that doesn't match css, javascript, gulp or webpack
 *
 * @package  generator-lilly
 * @author   Martin Herweg <info@martinherweg.de>
 */

'use strict';
const extend = require('deep-extend');

exports.otherDependencies = {
  'browser-sync': '^2.23.6',
  chalk: '^2.3.0',
  del: '^3.0.0',
  path: '^0.12.7',
};

exports.packageJsonOther = (files = {}) => {
  extend(files.pkg, {
    devDependencies: exports.otherDependencies,
  });
};
