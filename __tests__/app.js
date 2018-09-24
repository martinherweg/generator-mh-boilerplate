'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const { getFileContent } = require('./helpers');

/* eslint-disable new-cap, no-multi-str, no-template-curly-in-string, no-unused-vars, no-undef, prettier/prettier */
const fs = require('fs-extra');

const { configPaths } = require('../generators/app/packageJson/paths/_distPaths');
const { scripts } = require('../generators/app/packageJson/_scripts');
const { browsersList } = require('../generators/app/packageJson/_browserlist');
const { faviconEntries } = require('../generators/app/packageJson/_favicon');
const { webpackDependencies } = require('../generators/app/packageJson/devDependencies/_webpack');
const { gulpDependencies } = require('../generators/app/packageJson/devDependencies/_gulp');
const { cssDependencies } = require('../generators/app/packageJson/devDependencies/_css');
const {
  javascriptDependencies,
} = require('../generators/app/packageJson/devDependencies/_javascript');
const { otherDependencies } = require('../generators/app/packageJson/devDependencies/_other');

const run = () => helpers.run(path.join(__dirname, '../generators/app'));

// Define some variables
const project = {
  name: 'boilerplate-test',
  description: 'A small Test Driven Generator',
  version: '0.0.1',
  proxy: 'boilerplate-test.dev',
};
const author = {
  name: 'Martin Herweg',
  email: 'info@martinherweg.de',
  homepage: 'https://martinherweg.de',
};

describe('generator-lilly:app', () => {
  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000000; // eslint-disable-line
    return run().withPrompts({
      projectName: project.name,
      projectVersion: project.version,
      projectDescription: project.description,
      projectProxy: project.proxy,
      authorName: author.name,
      authorEmail: author.email,
      authorHomepage: author.homepage,
    });
  });

  it('fill package.json with correct Information', () => {
    assert.JSONFileContent('package.json', {
      name: project.name,
      description: project.description,
      version: project.version,
      authors: [{ name: author.name, email: author.email, homepage: author.homepage }],
      scripts,
      devDependencies: otherDependencies,
    });
  });

  it('adds browserlist entry to package.json', () => {
    assert.jsonFileContent('package.json', {
      browserslist: browsersList,
    });
  });

  it('adds favicon configuration to package.json', () => {
    assert.jsonFileContent('package.json', {
      favicon: faviconEntries,
    });
  });

  it('adds devDependencies for css work', () => {
    assert.JSONFileContent('package.json', {
      devDependencies: cssDependencies,
    });
  });

  it('adds devDependencies for gulp', () => {
    assert.JSONFileContent('package.json', {
      devDependencies: gulpDependencies,
    });
  });

  it('adds devDependencies for javascript', () => {
    assert.JSONFileContent('package.json', {
      devDependencies: javascriptDependencies,
    });
  });

  it('add webpack devDependencies to package.json', () => {
    assert.JSONFileContent('package.json', {
      devDependencies: webpackDependencies,
    });
  });

  it('adds files for all projects', () => {
    assert.file([
      'babel.config.js',
      '.babelignore',
      '.editorconfig',
      '.eslintrc.js',
      '.gitignore',
      'gulpfile.babel.js',
      'package.json',
      'postcss.config.js',
      'prettier.config.js',
      'tailwind.js',
      'README.md',
      '.stylelintrc',
    ]);
  });

  it('adds javascript', () => {
    assert.file(['src/js/']);
  });

  it('adds scss', () => {
    assert.file(['src/scss/', 'src/scss/tailwind.scss']);
  });

  it('copies gulp tasks', () => {
    assert.file([
      'gulpfile.babel.js',
      'gulpfile/lib/',
      'gulpfile/tasks/',
      'gulpfile/tasks/browser-sync.js',
    ]);
  });

  it('adds webpack config', () => {
    assert.file(['webpack/webpack.config.babel.js', 'webpack/.babelrc']);
  });

  it('adds createDirs scripts', () => {
    assert.file(['scripts/createDirs.js']);
  });

  it('writes prettier config', () => {
    expect(getFileContent('prettier.config.js')).toMatchSnapshot();
  });

  it('writes babel config', () => {
    expect(getFileContent('babel.config.js')).toMatchSnapshot();
  });

  it('writes babel ignore', () => {
    expect(getFileContent('.babelignore')).toMatchSnapshot();
  });

  it('writes postcss config', () => {
    expect(getFileContent('postcss.config.js')).toMatchSnapshot();
  });

  it('writes eslint config', () => {
    expect(getFileContent('.eslintrc.js')).toMatchSnapshot();
  });

  it('writes tailwind config', () => {
    expect(getFileContent('tailwind.js')).toMatchSnapshot();
  });

  it('writes stylelint config', () => {
    expect(getFileContent('stylelint.config.js')).toMatchSnapshot();
  });

  it('writes app.scss', () => {
    expect(getFileContent('src/scss/app.scss')).toMatchSnapshot();
  });
});
