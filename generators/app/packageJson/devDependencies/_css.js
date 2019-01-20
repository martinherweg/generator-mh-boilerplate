/**
 * Dependencies for CSS
 *
 * @package  generator-lilly
 * @author   Martin Herweg <info@martinherweg.de>
 */

'use strict';
const extend = require('deep-extend');
const cssDependencies = require('./_cssDependencies');

const stylelint = cssDependencies.stylelint;

const postcss = cssDependencies.postcss;

const rest = cssDependencies.rest;

exports.cssDependencies = Object.assign(stylelint, postcss, rest);

exports.packageJsonCss = (files = {}) => {
  extend(files.pkg, {
    devDependencies: exports.cssDependencies,
  });
};
