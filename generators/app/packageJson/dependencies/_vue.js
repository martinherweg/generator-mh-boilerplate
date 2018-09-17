/**
 * Dependencies and devDependencies for VueJs
 *
 * @package  generator-lilly
 * @author   Martin Herweg <info@martinherweg.de>
 */

'use strict';
const extend = require('deep-extend');
const vueDependencies = require('./_vueDependencies');

exports.dependencies = vueDependencies.dependencies;

exports.devDependencies = vueDependencies.devDependencies;

exports.vueXDependencies = vueDependencies.VueX;

exports.routerDependencies = vueDependencies.VueRouter;

exports.packageJsonVue = (files = {}, context) => {
  extend(files.pkg, {
    devDependencies: exports.devDependencies,
  });

  if (
    typeof context.props.projectVuePlugins !== 'undefined' ||
    context.props.projectUsage === 'vueapp'
  ) {
    if (context.props.projectUsage === 'vueapp') {
      context.props.projectVuePlugins = [];
      context.props.projectVuePlugins.push('vuex');
      context.props.projectVuePlugins.push('vuerouter');
    }

    if (context.props.projectVuePlugins.includes('vuex')) {
      exports.dependencies = Object.assign(
        exports.dependencies,
        exports.vueXDependencies,
      );
    }

    if (context.props.projectVuePlugins.includes('vuerouter')) {
      exports.dependencies = Object.assign(
        exports.dependencies,
        exports.routerDependencies,
      );
    }
  }

  extend(files.pkg, {
    dependencies: exports.dependencies,
  });
};
