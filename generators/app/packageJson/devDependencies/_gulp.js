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
  'gulp-debug': '^4.0.0',
  'gulp-favicons': '^2.2.7',
  'gulp-if': '^2.0.2',
  'gulp-imagemin': '^4.1.0',
  'gulp-load-plugins': '^1.5.0',
  'gulp-notify': '^3.2.0',
  'gulp-plumber': '^1.2.0',
  'gulp-rename': '^1.4.0',
  'gulp-sourcemaps': '^2.6.4',
  'gulp-svg-sprite': '^1.4.0',
  'gulp-watch': '^5.0.1',
  'require-dir': '^1.0.0',
  'run-sequence': '^2.2.1',
  util: '^0.11.0',
  yargs: '^12.0.1',
};

exports.packageJsonGulp = (files = {}) => {
  extend(files.pkg, {
    devDependencies: exports.gulpDependencies,
  });
};
