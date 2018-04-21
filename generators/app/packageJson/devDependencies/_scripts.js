/**
 * Dependencies for Node Scripts
 *
 * @package  generator-lilly
 * @author   Martin Herweg <info@martinherweg.de>
 */

'use strict';
const extend = require('deep-extend');

exports.scriptsDependencies = {
  'fs-extra': '^5.0.0',
  'mem-fs': '^1.1.3',
  'mem-fs-editor': '^4.0.0',
  inquirer: '^5.0.1',
};

exports.packageJsonScriptsDependencies = (files = {}) => {
  extend(files.pkg, {
    devDependencies: exports.scriptsDependencies,
  });
};
