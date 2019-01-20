/**
 * Dependencies for Node Scripts
 *
 * @package  generator-lilly
 * @author   Martin Herweg <info@martinherweg.de>
 */

'use strict';
const extend = require('deep-extend');

exports.scriptsDependencies = require('./_scriptsDependencies');

exports.packageJsonScriptsDependencies = (files = {}) => {
  extend(files.pkg, {
    devDependencies: exports.scriptsDependencies,
  });
};
