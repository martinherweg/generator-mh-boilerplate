/**
 * Dependencies for Gulp
 *
 * @package  generator-lilly
 * @author   Martin Herweg <info@martinherweg.de>
 */

'use strict';
const extend = require('deep-extend');

exports.gulpDependencies = {
  gulp: '^3.9.1',
  'gulp-changed': '^3.2.0',
  'gulp-cheerio': '^0.6.3',
  'gulp-debug': '^3.2.0',
  'gulp-favicons': '^2.2.7',
  'gulp-if': '^2.0.2',
  'gulp-imagemin': '^4.1.0',
  'gulp-load-plugins': '^1.5.0',
  'gulp-notify': '^3.2.0',
  'gulp-plumber': '^1.2.0',
  'gulp-rename': '^1.2.2',
  'gulp-sourcemaps': '^2.6.4',
  'gulp-svg-sprite': '^1.3.7',
  'gulp-watch': '^5.0.0',
  'require-dir': '^0.3.2',
  'run-sequence': '^2.2.1',
  util: '^0.10.3',
  yargs: '^11.0.0',
};

exports.packageJsonGulp = (files = {}) => {
  extend(files.pkg, {
    devDependencies: exports.gulpDependencies,
  });
};
