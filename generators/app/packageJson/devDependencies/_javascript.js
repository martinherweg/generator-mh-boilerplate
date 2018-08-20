/**
 * Dependencies for Javascript
 *
 * @package  generator-lilly
 * @author   Martin Herweg <info@martinherweg.de>
 */

'use strict';
const extend = require('deep-extend');

const eslint = {
  eslint: '^5.4.0',
  'eslint-config-airbnb-base': '^13.1.0',
  'eslint-config-defaults': '^9.0.0',
  'eslint-config-prettier': '^3.0.1',
  'eslint-friendly-formatter': '^4.0.1',
  'eslint-import-resolver-webpack': '^0.10.1',
  'eslint-plugin-html': '^4.0.5',
  'eslint-plugin-import': '^2.14.0',
  'eslint-plugin-vue': '^4.7.1',
};

const babel = {
  '@babel/core': '^7.0.0-rc.1',
  '@babel/plugin-proposal-object-rest-spread': '^7.0.0-rc.1',
  '@babel/plugin-syntax-dynamic-import': '^7.0.0-rc.1',
  '@babel/polyfill': '^7.0.0-rc.1',
  '@babel/preset-env': '^7.0.0-rc.1',
  '@babel/register': '^7.0.0-rc.1',
  'babel-eslint': '8.2.6',
};

exports.javascriptDependencies = Object.assign(eslint, babel);

exports.packageJsonJavascript = (files = {}) => {
  extend(files.pkg, {
    devDependencies: exports.javascriptDependencies,
  });
};
