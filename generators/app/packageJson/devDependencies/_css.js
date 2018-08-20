/**
 * Dependencies for CSS
 *
 * @package  generator-lilly
 * @author   Martin Herweg <info@martinherweg.de>
 */

'use strict';
const extend = require('deep-extend');

const stylelint = {
  stylelint: '^9.5.0',
  'stylelint-config-sass-guidelines': '^5.0.0',
  'stylelint-formatter-pretty': '^1.0.3',
  'stylelint-order': '^1.0.0',
  'stylelint-scss': '^3.3.0',
  'stylelint-selector-bem-pattern': '^2.0.0',
};

const postcss = {
  autoprefixer: '^9.1.1',
  cssnano: '^4.0.5',
  lost: '^8.2.0',
  'postcss-aspect-ratio': '^1.0.2',
  'postcss-assets': '^5.0.0',
  'postcss-flexbugs-fixes': '^4.1.0',
  'postcss-reporter': '^6.0.0',
  'postcss-scss': '^2.0.0',
  'rucksack-css': '^1.0.2',
};

const rest = {
  'family.scss': '^1.0.8',
};

exports.cssDependencies = Object.assign(stylelint, postcss, rest);

exports.packageJsonCss = (files = {}) => {
  extend(files.pkg, {
    devDependencies: exports.cssDependencies,
  });
};