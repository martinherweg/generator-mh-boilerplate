'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const { configPaths } = require('../generators/app/packageJson/paths/_distPaths'); // eslint-disable-line
const run = () => helpers.run(path.join(__dirname, '../generators/app'));

/* eslint-disable new-cap, no-multi-str, no-template-curly-in-string */

describe('generator-lilly:app', () => {
  beforeAll(async () => {
    await run().withPrompts({
      projectUsage: 'craft',
      craftInstall: false,
    });
  });

  it('fills package.json with project type craft', () => {
    assert.JSONFileContent('package.json', {
      projectType: 'craft',
    });
  });

  it('adds downloadPlugin Script to scripts Folder', () => {
    assert.file(['scripts/downloadPlugin.js']);
  });

  it('adds pluginFolder directory, craftPlugins Section and download script to package.json', () => {
    assert.jsonFileContent('package.json', {
      craftPluginDownloader: {
        tmpFolder: 'tmp/',
        pluginPath: 'dist/craft/plugins/',
        plugins: [],
      },
      scripts: {
        'install:craftPlugins': 'node scripts/downloadPlugin.js --scripts',
        'install:craftPlugin': 'node scripts/downloadPlugin.js',
        'update:craftPlugins': 'node scripts/downloadPlugin.js --update',
      },
      distPaths: {
        pluginFolder: 'dist/craft/plugins',
      },
    });
  });

  it('adds downloadPlugin dependencies to package.json', () => {
    assert.jsonFileContent('package.json', {
      devDependencies: {
        'fs-extra': '^5.0.0',
        'mem-fs': '^1.1.3',
        'mem-fs-editor': '^4.0.0',
        inquirer: '^5.0.1',
        'deep-extend': '^0.5.0',
        download: '^6.2.5',
        progress: '^2.0.0',
      },
    });
  });

  it('add dist Paths for Craft', () => {
    assert.jsonFileContent('package.json', {
      distPaths: configPaths.craft,
    });
  });

  it('add craft to .gitignore', () => {
    assert.noFileContent(
      '.gitignore',
      '&lt;%- if(craftEnv == &#39;nystudio&#39;) { %&gt;',
    );
    assert.fileContent('.gitignore', 'dist/craft/storage/*');
  });

  it('adds craft templates to the src folder', () => {
    assert.file([
      'src/views/index.html',
      'src/views/layout/_layout.html',
      'src/views/parts/site-header.html',
      'src/views/_webpack/webpack-header.html',
      'src/views/_webpack/webpack-scripts.html',
    ]);
  });

  it('adds webpack content to scripts and header', () => {
    assert.fileContent(
      'src/views/_webpack/webpack-scripts.html',
      `<% for (var chunk in htmlWebpackPlugin.files.chunks) { if (!chunk.match(/font/)) { %>
<script src="<%= htmlWebpackPlugin.files.chunks[chunk].entry %>"></script>
<% }} %>
`,
    );
    assert.fileContent(
      'src/views/_webpack/webpack-header.html',
      `<% for (var css in htmlWebpackPlugin.files.css) { %>
  <link href="<%= htmlWebpackPlugin.files.css[css] %>" rel="stylesheet">
<% } %>
<% for (var chunk of webpack.chunks) {
for (var file of chunk.files) {
if (file.match(/\\.(js|css)$/) && !file.match(/cp/)) { %>
<link rel="<%= chunk.initial?'preload':'prefetch' %>" href="<%= htmlWebpackPlugin.files.publicPath + file %>" as="<%= file.match(/\\.css$/)?'style':'script' %>"><% }}} %>
`,
    );
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
    ]",
    );
  });

  it('adds a fresh copy of nystudio craft-scripts to the dist folder', () => {
    assert.file(['dist/craft-scripts/', 'dist/craft-scripts/craft2-example.env.sh']);
  });
});

describe('it is a craft project with NY Studio Environment', () => {
  beforeAll(async () => {
    await run().withPrompts({
      projectUsage: 'craft',
      craftInstall: false,
      craftEnv: 'nystudio',
    });
  });

  it('adds environment file', () => {
    assert.file(['dist/.env.example.php', 'dist/.env.php']);
  });

  it('adds .env.php to gitignore', () => {
    assert.noFileContent(
      '.gitignore',
      '&lt;%- if(craftEnv == &#39;nystudio&#39;) { %&gt;',
    );
    assert.fileContent('.gitignore', '.env.php');
  });

  it('adds the nystudio general and db file', () => {
    assert.fileContent(
      'dist/craft/config/db.php',
      `// All environments
        '*' => array(
            'tablePrefix' => 'craft',
            'server' => getenv('CRAFTENV_DB_HOST'),
            'database' => getenv('CRAFTENV_DB_NAME'),
            'user' => getenv('CRAFTENV_DB_USER'),
            'password' => getenv('CRAFTENV_DB_PASS'),
        ),`,
    );

    assert.fileContent(
      'dist/craft/config/general.php',
      `'siteUrl' => getenv('CRAFTENV_SITE_URL'),`,
    );
  });

  it('add nystudio index.php to systemFiles', () => {
    assert.fileContent('src/systemFiles/index.php', `if (file_exists('../.env.php'))`);
  });
});

describe.skip('it downloads craft', () => {
  beforeEach(async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000000; // eslint-disable-line
    await run().withPrompts({
      projectUsage: 'craft',
      craftInstall: true,
    });
  });

  it('If the user wants to it downloads Craft', async () => {
    assert.file(['dist/craft/']);
  });
});
