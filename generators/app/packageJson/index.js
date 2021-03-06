/**
 * Bringing together all the package.json extends
 *
 * @package  generator-lilly
 * @author   Martin Herweg <info@martinherweg.de>
 */

const _base = require('./_base');
const { packageJsonScripts } = require('./_scripts');
const { packageJsonWebpack } = require('./devDependencies/_webpack');
const { packageJsonGulp } = require('./devDependencies/_gulp');
const { packageJsonCss } = require('./devDependencies/_css');
const { packageJsonJavascript } = require('./devDependencies/_javascript');
const { packageJsonOther } = require('./devDependencies/_other');
const { packageJsonScriptsDependencies } = require('./devDependencies/_scripts');
const {
  packageJsonCraftDownloadPluginDependencies,
} = require('./devDependencies/_craftDownloadPlugin');
const { writeSrcPaths } = require('./paths/_srcPaths');
const { writeDistPaths } = require('./paths/_distPaths');
const { packageJsonBrowsersList } = require('./_browserlist');
const { packageJsonFavicon } = require('./_favicon');
const { packageJsonSvgo } = require('./_svgo');

const packageJsonModules = (files = {}, context) => {
  _base(files, context);
  packageJsonScripts(files);
  packageJsonBrowsersList(files);
  packageJsonFavicon(files);
  packageJsonSvgo(files);
  packageJsonWebpack(files);
  packageJsonGulp(files);
  packageJsonCss(files);
  packageJsonJavascript(files);
  packageJsonOther(files);
  packageJsonScriptsDependencies(files);
  writeSrcPaths({
    files,
  });

  if (context.props.projectUsage === 'craft') {
    packageJsonCraftDownloadPluginDependencies(files);
    writeDistPaths({
      files,
      projectUsage: 'craft',
    });
  }

  if (context.props.projectUsage === 'craft3') {
    packageJsonCraftDownloadPluginDependencies(files);
    writeDistPaths({
      files,
      projectUsage: 'craft3',
    });
  }

  if (context.props.projectUsage === 'laravel') {
    writeDistPaths({
      files,
      projectUsage: 'laravel',
    });
  }

  if (context.props.projectUsage === 'vueapp') {
    writeDistPaths({
      files,
    });
  }
};

module.exports = packageJsonModules;
