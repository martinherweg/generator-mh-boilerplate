'use strict';
/* eslint-disable */
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const fs = require('fs-extra');
const { flatten } = require('lodash');

const { configPaths } = require('../generators/app/packageJson/paths/_distPaths');
const { srcPaths } = require('../generators/app/packageJson/paths/_srcPaths');

describe('testing basic webpack functionality', () => {
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
        projectUsage: 'laravel',
        laravelInstall: true,
        projectFramework: 'vue',
        projectVuePlugin: ['vuerouter', 'vuex'],
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

  afterAll(() => {
    rootFolder = testFolder;
    fs.removeSync(rootFolder + '/webpack/webpack.config.babel.js');
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

describe('craft2 | testing file generation', () => {
  const testFolder = path.resolve(__dirname, '../../tmp/test/');
  let rootFolder;
  let webpack2Config;
  let webpackStats;
  let webpackOutputPath;
  let assetsPath;

  beforeAll(async () => {
    jest.resetModules();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000000;
    console.log('Running craft2 generator');
    await helpers
      .run(path.join(__dirname, '../generators/app'))
      .cd(testFolder)
      .withPrompts({
        projectUsage: 'craft',
        craftInstall: false,
        projectFramework: 'vue',
        projectVuePlugin: ['vuerouter', 'vuex'],
      })
      .withOptions({ skipInstall: true });
    const mocks = path.resolve(__dirname, '__mocks__');

    fs.copySync(mocks + '/images/', testFolder + '/src/images/');
    fs.copySync(mocks + '/fonts/', testFolder + '/src/fonts/');

    rootFolder = testFolder;
    assetsPath = rootFolder + '/' + configPaths.craft.base + '/assets';
    webpack2Config = await import(rootFolder + '/webpack/webpack.config.babel.js'); //
    webpack2Config = webpack2Config.default({ production: true });
    // eslint-disable-line
    webpack2Config.entry.testApp = path.resolve(__dirname, '__mocks__/testapp.js');
    const webpack = require(rootFolder + '/node_modules/webpack');
    return new Promise((resolve, reject) => {
      webpack(webpack2Config, (err, stats) => {
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

  afterAll(() => {
    rootFolder = testFolder;
    fs.removeSync(rootFolder + '/webpack/webpack.config.babel.js');
    fs.removeSync(`${rootFolder}/${configPaths.craft.views}_webpack/webpack-header.html`);
    fs.removeSync(`${rootFolder}/${configPaths.craft.views}_webpack/webpack-scripts.html`);
  });

  it('generates header and scripts file', () => {
    assert.file(`${rootFolder}/${configPaths.craft.views}_webpack/webpack-header.html`);
    assert.file(`${rootFolder}/${configPaths.craft.views}_webpack/webpack-scripts.html`);
  });

  it('references to webpack files', () => {
    assert.fileContent(
      `${rootFolder}/${srcPaths.defaults.views}layout/_layout.html`,
      "{% include '_webpack/webpack-scripts' %}",
    );
    assert.fileContent(
      `${rootFolder}/${srcPaths.defaults.views}parts/site-header.html`,
      "{% include '_webpack/webpack-header' %}",
    );
  });

  it('has webpack generated assets linked', () => {
    if (!webpackStats) return undefined;

    const { assets } = webpackStats;
    const jsFiles = assets
      .filter(asset => asset.name.includes('js/'))
      .filter(asset => !asset.name.includes('.map'))
      .map(file => file.name);
    const cssFiles = assets
      .filter(asset => asset.name.includes('css/'))
      .filter(asset => !asset.name.includes('.map'))
      .map(file => file.name);

    jsFiles.forEach(file => {
      assert.fileContent(
        `${rootFolder}/${configPaths.craft.views}_webpack/webpack-scripts.html`,
        `<script src="/assets/${file}"></script>`,
      );
    });

    cssFiles.forEach(file => {
      assert.fileContent(
        `${rootFolder}/${configPaths.craft.views}_webpack/webpack-header.html`,
        `<link href="/assets/${file}" rel="stylesheet">`,
      );
    });
  });
});

describe('craft3 | testing file generation', () => {
  const testFolder = path.resolve(__dirname, '../../tmp/test/');
  let rootFolder;
  let webpack3Config;
  let webpackStats;
  let webpackOutputPath;
  let assetsPath;

  beforeAll(async () => {
    jest.resetModules();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000000;
    console.log('Running craft3 generator');
    await helpers
      .run(path.join(__dirname, '../generators/app'))
      .cd(testFolder)
      .withPrompts({
        projectUsage: 'craft3',
        craftInstall: false,
        projectFramework: 'vue',
        projectVuePlugin: ['vuerouter', 'vuex'],
      })
      .withOptions({ skipInstall: true });
    const mocks = path.resolve(__dirname, '__mocks__');

    fs.copySync(mocks + '/images/', testFolder + '/src/images/');
    fs.copySync(mocks + '/fonts/', testFolder + '/src/fonts/');

    rootFolder = testFolder;
    assetsPath = rootFolder + '/' + configPaths.craft3.base + '/assets';

    webpack3Config = await import(rootFolder + '/webpack/webpack.config.babel.js'); //
    webpack3Config = webpack3Config.default({ production: true });
    // eslint-disable-line
    webpack3Config.entry.testApp = path.resolve(__dirname, '__mocks__/testapp.js');
    const webpack = require(rootFolder + '/node_modules/webpack');
    return new Promise((resolve, reject) => {
      webpack(webpack3Config, (err, stats) => {
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

  afterAll(() => {
    rootFolder = testFolder;

    fs.removeSync(rootFolder + '/webpack/webpack.config.babel.js');
    fs.removeSync(`${rootFolder}/${configPaths.craft3.views}_webpack/webpack-header.html`);
    fs.removeSync(`${rootFolder}/${configPaths.craft3.views}_webpack/webpack-scripts.html`);
  });

  it('generates header and scripts file', () => {
    assert.file(`${rootFolder}/${configPaths.craft3.views}_webpack/webpack-header.html`);
    assert.file(`${rootFolder}/${configPaths.craft3.views}_webpack/webpack-scripts.html`);
  });

  it('references to webpack files', () => {
    assert.fileContent(
      `${rootFolder}/${srcPaths.defaults.views}layout/_layout.html`,
      "{% include '_webpack/webpack-scripts' %}",
    );
    assert.fileContent(
      `${rootFolder}/${srcPaths.defaults.views}parts/site-header.html`,
      "{% include '_webpack/webpack-header' %}",
    );
  });

  it('has webpack generated assets linked', () => {
    if (!webpackStats) return undefined;

    const { assets } = webpackStats;
    const jsFiles = assets
      .filter(asset => asset.name.includes('js/'))
      .filter(asset => !asset.name.includes('.map'))
      .map(file => file.name);
    const cssFiles = assets
      .filter(asset => asset.name.includes('css/'))
      .filter(asset => !asset.name.includes('.map'))
      .map(file => file.name);

    jsFiles.forEach(file => {
      assert.fileContent(
        `${rootFolder}/${configPaths.craft3.views}_webpack/webpack-scripts.html`,
        `<script src="/assets/${file}"></script>`,
      );
    });

    cssFiles.forEach(file => {
      assert.fileContent(
        `${rootFolder}/${configPaths.craft3.views}_webpack/webpack-header.html`,
        `<link href="/assets/${file}" rel="stylesheet">`,
      );
    });
  });
});

describe('Laravel | testing file generation', () => {
  const testFolder = path.resolve(__dirname, '../../tmp/test/');
  let rootFolder;
  let webpackConfig;
  let webpackStats;
  let webpackOutputPath;
  let assetsPath;

  beforeAll(async () => {
    jest.resetModules();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000000;
    console.log('Running laravel generator');
    await helpers
      .run(path.join(__dirname, '../generators/app'))
      .cd(testFolder)
      .withPrompts({
        projectUsage: 'laravel',
        laravelInstall: false,
        projectFramework: 'vue',
        projectVuePlugin: ['vuerouter', 'vuex'],
      })
      .withOptions({ skipInstall: true });
    const mocks = path.resolve(__dirname, '__mocks__');

    fs.copySync(mocks + '/images/', testFolder + '/src/images/');
    fs.copySync(mocks + '/fonts/', testFolder + '/src/fonts/');

    rootFolder = testFolder;
    assetsPath = rootFolder + '/' + configPaths.laravel.base + '/assets';

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

  afterAll(() => {
    rootFolder = testFolder;

    fs.removeSync(rootFolder + '/webpack/webpack.config.babel.js');
    fs.removeSync(`${rootFolder}/${configPaths.laravel.views}_webpack/webpack-header.blade.php`);
    fs.removeSync(`${rootFolder}/${configPaths.laravel.views}_webpack/webpack-scripts.blade.php`);
  });

  it('generates header and scripts file', () => {
    assert.file(`${rootFolder}/${configPaths.laravel.views}_webpack/webpack-header.blade.php`);
    assert.file(`${rootFolder}/${configPaths.laravel.views}_webpack/webpack-scripts.blade.php`);
  });

  it('references to webpack files', () => {
    assert.fileContent(
      `${rootFolder}/${srcPaths.defaults.views}_layout/_layout.blade.php`,
      "@include('_webpack.webpack-scripts')",
    );
    assert.fileContent(
      `${rootFolder}/${srcPaths.defaults.views}_parts/site-header.blade.php`,
      "@include('_webpack.webpack-header')",
    );
  });

  it('has webpack generated assets linked', () => {
    if (!webpackStats) return undefined;


    const { assets } = webpackStats;
    const jsFiles = assets
      .filter(asset => asset.name.includes('js/'))
      .filter(asset => !asset.name.includes('.map'))
      .map(file => file.name);
    const cssFiles = assets
      .filter(asset => asset.name.includes('css/'))
      .filter(asset => !asset.name.includes('.map'))
      .map(file => file.name);

    jsFiles.forEach(file => {
      assert.fileContent(
        `${rootFolder}/${configPaths.laravel.views}_webpack/webpack-scripts.blade.php`,
        `<script src="/assets/${file}"></script>`,
      );
    });

    cssFiles.forEach(file => {
      assert.fileContent(
        `${rootFolder}/${configPaths.laravel.views}_webpack/webpack-header.blade.php`,
        `<link href="/assets/${file}" rel="stylesheet">`,
      );
    });
  });
});
