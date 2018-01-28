process.env.NODE_ENV = 'test';

/* eslint-disable */
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
const fs = require('fs-extra'); // eslint-disable-line no-unused-vars

const {
  configPaths
} = require('../generators/app/modules/packageJson-modules/paths/_distPaths');

const run = () => helpers.run(path.join(__dirname, '../generators/app'));

beforeAll(async () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000000;
  try {
    await run().withPrompts({
      projectUsage: 'craft3'
    });
  } catch (error) {
    console.error(error);
  }
});

describe("it's craft 3 🎉", () => {
  it('installs craft', () => {
    assert.file([
      'dist/web/',
      'dist/vendor/craftcms/',
      'dist/config/',
      'dist/storage'
    ]);
  });

  it('adds nystudio craft-scripts', () => {
    assert.file('dist/scripts');
  });

  it('add dist Paths for Craft', () => {
    assert.jsonFileContent('package.json', {
      distPaths: configPaths.craft3
    });
  });

  it('adds nystudio multienv', () => {
    assert.file(['dist/.env.php']);
  });

  it('adds craft templates to the src folder', () => {
    assert.file([
      'src/views/index.html',
      'src/views/layout/_layout.html',
      'src/views/parts/site-header.html',
      'src/views/_webpack/webpack-header.html',
      'src/views/_webpack/webpack-scripts.html'
    ]);
  });

  it('adds Craft chunks to webpack config', () => {
    assert.fileContent(
      'webpack/webpack.config.babel.js',
      "const chunks_inject = [\n\
      {\n\
        filename: path.resolve(`${config.distPaths.views}_webpack/webpack-header.html`),\n\
        file: config.srcPaths.views + '_webpack/webpack-header.html',\n\
        inject: false,\n\
      },\n\
      {\n\
        filename: path.resolve(`${config.distPaths.views}_webpack/webpack-scripts.html`),\n\
        file: config.srcPaths.views + '_webpack/webpack-scripts.html',\n\
        inject: false,\n\
      }\n\
    ]"
    );
  });
});
