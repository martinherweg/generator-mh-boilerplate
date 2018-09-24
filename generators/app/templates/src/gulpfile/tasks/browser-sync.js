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


<% if(projectUsage === 'laravel') { %>
const filesToIgnore = [
  `${config.distPaths.views}_webpack/webpack-header.blade.php`,
  `${config.distPaths.views}_webpack/webpack-scripts.blade.php`,
];
<% } else if (projectUsage === 'craft' || projectUsage === 'craft3') { %>
const filesToIgnore = [
  `${config.distPaths.views}_webpack/webpack-header.html`,
  `${config.distPaths.views}_webpack/webpack-scripts.html`,
];
<% } %>

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
    ignore: filesToIgnore,
    files: [
      {
        match: [`${config.distPaths.views}**/*.{php,html,twig}`],
        fn(event, file) {
          if (event === 'change' || event === 'add') {
            console.log(chalk`{bgRgb(250,134,223) Reloading because of {yellow ${event}} of {yellow ${file}}}`);
            browserSync.reload();
          }
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
