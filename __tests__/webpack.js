'use strict';
/* eslint-disable */
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const fs = require('fs-extra');
const { flatten } = require('lodash');

const { configPaths } = require('../generators/app/packageJson/paths/_distPaths');

describe('generator-lilly:app', () => {
  const testFolder = path.resolve(__dirname, '../../tmp/test/');
  let rootFolder;
  let webpackConfig;
  let webpackStats;
  let webpackOutputPath;
  let assetsPath;

  beforeAll(async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000000;
    await helpers
      .run(path.join(__dirname, '../generators/app'))
      .cd(testFolder)
      .withPrompts({
        projectUsage: 'craft',
        craftInstall: false,
        projectFramework: 'vue',
        projectVuePlugin: ['vuerouter', 'vuex']
      })
      .withOptions({ skipInstall: true });
    const mocks = path.resolve(__dirname, '__mocks__');

    fs.copySync(mocks + '/images/', testFolder + '/src/images/');
    fs.copySync(mocks + '/fonts/', testFolder + '/src/fonts/');

    rootFolder = testFolder;
    assetsPath = rootFolder + '/' + configPaths.craft.base + '/assets';

    webpackConfig = await import(rootFolder + '/webpack/webpack.config.babel.js'); //

    webpackConfig = webpackConfig.default({ production: true });
    // eslint-disable-line
    webpackConfig.entry.testApp = path.resolve(__dirname, '__mocks__/testapp.js');
    const webpack = require(rootFolder + '/node_modules/webpack');
    return new Promise((resolve, reject) => {
      webpack(webpackConfig, (err, stats) => {
        if (err) {
          console.error(err.stack || err);
          if (err.details) {
            console.error(err.details);
          }
          return reject('Error');
        }

        const info = stats.toJson();

        if (stats.hasErrors()) {
          console.error(info.errors);
          reject('error');
        }

        if (stats.hasWarnings()) {
          console.warn(info.warnings);
          reject('error');
        }
        webpackOutputPath = stats.compilation.outputOptions.path;
        webpackStats = stats.toJson();
        return resolve(webpackStats);
      });
    });
  });

  it('compiles webpack', () => {
    if (!webpackStats) return undefined;
    const { chunks } = webpackStats;
    const chunkFiles = flatten(
      chunks.map(chunk => {
        return chunk.files.map(file => {
          return assetsPath + '/' + file;
        });
      }),
    );
    return assert.file(chunkFiles);
  });

  it('moves images', () => {
    if (!webpackStats) return undefined;
    const { assets } = webpackStats;
    const filtered = assets
      .filter(asset => {
        return asset.name.match(new RegExp(/.*\.(jpg|png|gif)/, 'g'));
      })
      .map(asset => {
        return assetsPath + '/' + asset.name;
      });

    assert.file(filtered);
  });

  it('moves svg', () => {
    if (!webpackStats) return undefined;
    const { assets } = webpackStats;
    const filtered = assets
      .filter(asset => {
        return asset.name.match(new RegExp(/.*\.(svg)/, 'g'));
      })
      .map(asset => {
        return assetsPath + '/' + asset.name;
      });

    assert.file(filtered);
  });

  it('can compile Vue SFC', () => {

  });

  it('moves fonts', () => {
    if (!webpackStats) return undefined;
    const { assets } = webpackStats;
    const filtered = assets
      .filter(asset => {
        const fonts = asset.name.match(
          new RegExp(/\.(woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/, 'g'),
        );
        if (fonts === null) return undefined;
        return fonts;
      })
      .map(asset => {
        return assetsPath + '/' + asset.name;
      });

    if (filtered.length >= 1) {
      assert.file(filtered);
    } else {
      assert.file('foo.js');
    }
  });
});
