/**
 * Dependencies for Javascript
 *
 * @package  generator-lilly
 * @author   Martin Herweg <info@martinherweg.de>
 */

'use strict';
const extend = require('deep-extend');
const jsDependencies = require('./_javascriptDependencies');

const eslint = jsDependencies.eslint;

const babel = jsDependencies.babel;

exports.javascriptDependencies = Object.assign(eslint, babel);

exports.packageJsonJavascript = (files = {}) => {
  extend(files.pkg, {
    devDependencies: exports.javascriptDependencies,
  });
};
