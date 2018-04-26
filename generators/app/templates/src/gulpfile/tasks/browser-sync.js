import chalk from 'chalk';

/**
 |--------------------------------------------------------------------------
 | gulp browser-sync
 |--------------------------------------------------------------------------
 *
 * Browser Sync
 * @description Refresh the Brwoser after File Change.
 * Combined with webpack for HMR or Content Reload
 *
 * @package  generator-lilly
 * @author   Martin Herweg <info@martinherweg.de>
 */

/*
 |--------------------------------------------------------------------------
 | browser-sync.js
 |--------------------------------------------------------------------------
 */

import config from '../../package.json';
import gulp from 'gulp';
import browserSync from 'browser-sync';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackSettings from '../../webpack/webpack.config.babel';

import yargs from 'yargs';
const argv = yargs.argv;
const env = argv.env || 'development';

const browserSyncTask = () => {
  if (env !== 'browser-sync') return;
  const bundler = webpack(webpackSettings({ development: true }));
  browserSync.init({
    proxy: {
      target: config.proxy,
      ws: true,
    },
    ghostMode: {
      clicks: true,
      forms: true,
      scroll: false,
    },
    logLevel: 'info',
    watchTask: true,
    open: false,
    stream: true,
    ui: {
      port: 8090,
    },
    middleware: [
      webpackDevMiddleware(bundler, {
        logLevel: 'silent',
        path: webpackSettings({ development: true }).output.path,
        publicPath: webpackSettings({ development: true }).output.publicPath,
        stats: {
          colors: true,
        },
      }),
      webpackHotMiddleware(bundler, {
        log: false,
      }),
    ],
    files: [
      {
        match: [
          `!${config.distPaths.views}parts/webpack-header.html`,
          `!${config.distPaths.views}parts/site-scripts.html`,
          `${config.distPaths.views}**/*.{php,html,twig}`,
          `${config.distPaths.images.base}**/*.{jpg,png,gif,svg}`,
        ],
        fn(event, file) {
          if (event === 'change' || event === 'add') {
            browserSync.reload();
          }
        },
      },
      {
        match: [`${config.distPaths.css}**/*.{css}`],
        fn(event, file) {
          if (event === 'change') {
            browserSync.reload('*.css');
          }
        },
        options: {
          ignore: [
            `${config.distPaths.views}parts/webpack-header.html`,
            `${config.distPaths.views}parts/site-scripts.html`,
          ],
        },
      },
    ],
  });
};

const browserSyncReload = () => {
  browserSync.reload();
};

gulp.task('browser-sync', browserSyncTask);
gulp.task('bs-reload', browserSyncReload);

export { browserSyncTask, browserSyncReload };
