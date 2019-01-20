/**
 * Package.json config for scripts
 *
 * @package  generator-lilly
 * @author   Martin Herweg <info@martinherweg.de>
 */

'use strict';
const extend = require('deep-extend');

exports.scripts = {
  dev: 'cross-env NODE_ENV=development gulp --env=browser-sync',
  gulp: 'cross-env NODE_ENV=development gulp',
  'gulp:production': 'cross-env NODE_ENV=production gulp --env=production',
  images: 'cross-env NODE_ENV=development gulp move:images',
  init: 'npm run -s init_commands && node ./scripts/createDirs.js',
  // eslint-disable-next-line
  init_commands:
    'cross-env NODE_ENV=development gulp build:production --env=browserSync --changed=false && cross-env NODE_ENV=development webpack --hide-modules --config=webpack/webpack.config.babel.js',
  module: 'node ./scripts/module',
  production: 'npm run gulp:production && npm run webpack:production',
  webpack:
    'cross-env NODE_ENV=production webpack --hide-modules --config=webpack/webpack.config.babel.js',
  'webpack:production':
    'cross-env NODE_ENV=production webpack --hide-modules --config=webpack/webpack.config.babel.js --env.production',
  'webpack:analyze': 'webpack-bundle-analyzer webpack/stats.json dist/public/assets/',
};

exports.packageJsonScripts = function(files = {}) {
  extend(files.pkg, {
    scripts: exports.scripts,
  });
};
