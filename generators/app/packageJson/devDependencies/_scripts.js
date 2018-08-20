/**
 * Dependencies for Node Scripts
 *
 * @package  generator-lilly
 * @author   Martin Herweg <info@martinherweg.de>
 */

'use strict';
const extend = require('deep-extend');

exports.scriptsDependencies = {
  'fs-extra': '^7.0.0',
  'mem-fs': '^1.1.3',
  'mem-fs-editor': '^5.1.0',
  inquirer: '^6.1.0',
};

exports.packageJsonScriptsDependencies = (files = {}) => {
  extend(files.pkg, {
    devDependencies: exports.scriptsDependencies,
  });
};
