/**
 * Dependencies for Javascript
 *
 * @package  generator-lilly
 * @author   Martin Herweg <info@martinherweg.de>
 */

'use strict';
const extend = require('deep-extend');

const eslint = {
  eslint: '^4.16.0',
  'eslint-config-airbnb-base': '^12.1.0',
  'eslint-config-defaults': '^9.0.0',
  'eslint-config-prettier': '^2.6.0',
  'eslint-friendly-formatter': '^4.0.1',
  'eslint-import-resolver-webpack': '^0.8.4',
  'eslint-plugin-html': '^4.0.2',
  'eslint-plugin-import': '^2.8.0',
  'prettier-eslint-cli': '^4.7.0',
};

const babel = {
  '@babel/core': '^7.0.0-beta.38',
  '@babel/plugin-proposal-object-rest-spread': '^7.0.0-beta.38',
  '@babel/plugin-syntax-dynamic-import': '^7.0.0-beta.38',
  '@babel/polyfill': '^7.0.0-beta.38',
  '@babel/preset-env': '^7.0.0-beta.38',
  '@babel/register': '^7.0.0-beta.38',
  'babel-eslint': '7',
};

exports.javascriptDependencies = Object.assign(eslint, babel);

exports.packageJsonJavascript = (files = {}) => {
  extend(files.pkg, {
    devDependencies: exports.javascriptDependencies,
  });
};
