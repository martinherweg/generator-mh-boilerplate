/**
 * Dependencies and devDependencies for VueJs
 *
 * @package  generator-lilly
 * @author   Martin Herweg <info@martinherweg.de>
 */

'use strict';
const extend = require('deep-extend');

exports.dependencies = {
  vue: '^2.5.17',
};

exports.devDependencies = {
  'eslint-plugin-vue': '^4.7.1',
  'vue-loader': '^15.4.0',
  'vue-style-loader': '^4.1.2',
  'vue-template-compiler': '^2.5.17',
};

exports.vueXDependencies = {
  vuex: '^3.0.1',
};

exports.routerDependencies = {
  'vue-router': '^3.0.1',
};

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
    scripts: {
      'module:vue': 'yarn module -- --vue=true',
    },
    dependencies: exports.dependencies,
  });
};
