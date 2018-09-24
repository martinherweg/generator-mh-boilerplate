import fs from 'fs';
import webpack from 'webpack';
import { getIfUtils, removeEmpty } from 'webpack-config-utils';
import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WriteFilePlugin from 'write-file-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import WebpackBar from 'webpackbar';
import StylelintPlugin from 'stylelint-webpack-plugin';
import ManifestPlugin from 'webpack-manifest-plugin';
import Stylish from 'webpack-stylish';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import PurgeCssPlugin from 'purgecss-webpack-plugin';
import glob from 'glob-all';
import { whitelist, whitelistPatterns, whitelistPatternsChildren} from '../../purgecss.config';

<% if(projectUsage === 'vueapp' || projectFramework === 'vue') { %>
import { VueLoaderPlugin } from 'vue-loader';
<% } %>

const config = require('../package.json');

/*
 |--------------------------------------------------------------------------
 | Setting some paths for our Application
 |--------------------------------------------------------------------------
 */
const BASE_PATH = path.join(path.resolve(__dirname, '../'));
const ASSETS_ROOT = path.resolve(BASE_PATH, config.distPaths.base, 'assets');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

let chunks = [];

<% if (projectUsage === 'craft' || projectUsage === 'craft3') { %>
  const chunks_inject = [
      {
        filename: path.resolve(`${config.distPaths.views}_webpack/webpack-header.html`),
        file: config.srcPaths.views + '_webpack/webpack-header.html',
        inject: false,
      },
      {
        filename: path.resolve(`${config.distPaths.views}_webpack/webpack-scripts.html`),
        file: config.srcPaths.views + '_webpack/webpack-scripts.html',
        inject: false,
      }
    ]
    <% } else if (projectUsage === 'laravel') { %>
  const chunks_inject = [
      {
        filename: path.resolve(`${config.distPaths.views}_webpack/webpack-header.blade.php`),
        file: config.srcPaths.views + '_webpack/webpack-header.blade.php',
        inject: false,
      },
      {
        filename: path.resolve(`${config.distPaths.views}_webpack/webpack-scripts.blade.php`),
        file: config.srcPaths.views + '_webpack/webpack-scripts.blade.php',
        inject: false,
      }
    ]
    <% } else if (projectUsage === 'vueapp') { %>
  const chunks_inject = [
      {
        filename: path.resolve(`${config.distPaths.views}/index.html`),
        file: config.srcPaths.views + 'index.html',
        inject: true,
      }
    ]
    <% } %>

chunks_inject.forEach((chunk) => {
  const plugin = new HtmlWebpackPlugin({
    filename: chunk.filename,
    template: chunk.file,
    inject: chunk.inject,
    minify: false,
    // necessary to consistently work with multiple chunks via CommonsChunkPlugin
  });

  chunks.push(plugin);
});

// Custom PurgeCSS extractor for Tailwind that allows special characters in
// class names.
//
// https://github.com/FullHuman/purgecss#extractor
class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-Za-z0-9-_:\/]+/g) || [];
  }
}

// webpack Config
module.exports = (env = { development: true }) => {
  const { ifProduction, ifDevelopment } = getIfUtils(env);
  const hot_client =
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true&overlay=true';
  const entry_points = {
    app: './src/js/app.js',
  };
  if (ifDevelopment()) {
    Object.keys(entry_points).forEach(
      entry => (entry_points[entry] = [hot_client].concat(entry_points[entry])),
    );
  }


  const CSS_LOADERS = [
    ifDevelopment('style-loader', MiniCssExtractPlugin.loader),
    {
      loader: 'css-loader',
      options: { importLoaders: 1, minimize: ifDevelopment(false, true) },
    },
    'postcss-loader',
    {
      loader: 'sass-loader',
      options: {
        includePaths: [resolve(config.srcPaths.base), resolve(config.srcPaths.css)],
        data: '@import \'settings\';\n' +
        '@import \'tools\';'
      },
    },
  ];

  return {
    devtool: ifDevelopment('eval-source-map', 'source-map'),
    mode: ifDevelopment('development', 'production'),
    context: BASE_PATH,
    entry: removeEmpty(entry_points),
    output: {
      path: ASSETS_ROOT,
      publicPath: '/assets/',
      filename: ifDevelopment('js/[name].js', 'js/[name].[chunkhash].js'),
    },
    stats: 'none',
    performance: {
      hints: false,
    },
    optimization: {
      splitChunks: {
        chunks: 'initial',
      },
      runtimeChunk: {
        name: 'manifest',
      },
    },
    resolve: {
      extensions: ['.js', '.json'<%_ if (projectFramework === 'vue' || projectUsage === 'vueapp' ) { _%>, '.vue'<%_ } _%>],
      modules: [resolve(config.srcPaths.base), resolve('node_modules')],
      alias: {
        <%_ if (projectFramework === 'vue' || projectUsage === 'vueapp') { _%>
        'vue$': 'vue/dist/vue.esm.js',
        <%_ } _%>
        '@Src': resolve(config.srcPaths.base),
        '@Css': resolve(config.srcPaths.css),
        '@Js': resolve(config.srcPaths.js),
        '@Images': resolve(config.srcPaths.images.base),
        '@Svg': resolve(config.srcPaths.images.svg.base),
        '@Fonts': resolve(config.srcPaths.fonts),
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          options: {
            formatter: require('eslint-friendly-formatter'),
          },
          enforce: 'pre',
          include: resolve(config.srcPaths.base),
        },
        {
          test: /\.js$/,
          use: 'babel-loader',
          include: resolve(config.srcPaths.base),
        },
        {
          test: /\.css$/,
          use: ifProduction(
            [MiniCssExtractPlugin.loader, 'css-loader'],
            ['style-loader', 'css-loader'],
          ),
        },
        {
          test: /\.scss$/,
          include: resolve(config.srcPaths.base),
          use: CSS_LOADERS,
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          test: /\.svg$/,
          loader: 'url-loader',
          include: resolve(config.srcPaths.base),
          options: {
            limit: 100,
            name: filePath => {
              const filename = path.basename(filePath);
              const folder = path
                .relative(config.srcPaths.images.svg.base, filePath)
                .replace(filename, '');
              return `images/svg/${folder}[name].[hash:4].[ext]`;
            },
            publicPath: '/',
          },
        },
        {
          test: /\.(png|jpg|gif)$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: filePath => {
              const filename = path.basename(filePath);
              const folder = path
                .relative(config.srcPaths.images.base, filePath)
                .replace(filename, '');
              return `images/bitmap/${folder}[name].[hash:4].[ext]`;
            },
            publicPath: '/',
          },
        },
        {
          // Match woff2 in addition to patterns like .woff?v=1.1.1.
          test: /\.(woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url-loader',
          options: {
            // Limit at 10k. Above that it emits separate files
            limit: 10000,

            // url-loader sets mimetype if it's passed.
            // Without this it derives it from the file extension
            mimetype: 'application/font-woff',

            // Output below fonts directory
            name: path => 'fonts/[name].[ext]',
            publicPath: '/',
          },
        },
      ],
    },

    plugins: removeEmpty([
      new WebpackBar(),
      new CleanWebpackPlugin([config.distPaths.css, config.distPaths.js], {
        root: BASE_PATH,
        verbose: true,
      }),
      ifDevelopment(new webpack.HotModuleReplacementPlugin()),
      new MiniCssExtractPlugin({
        filename: ifDevelopment('css/[name].css', 'css/[name].[chunkhash].css'),
        chunkFilename: ifDevelopment('css/[name].css', 'css/[name].[chunkhash].css'),
      }),
      new PurgeCssPlugin({
        content: [`${resolve('src/')}js/**/*.{js,vue,jsx}`, `${resolve('src/')}views/**/*.{js,vue,jsx,html,php}`],
        paths: [
          ...glob.sync(resolve('src/' + '/js/**/*.{js,vue,jsx}')),
          ...glob.sync(resolve('src/' + '/views/**/*.{html,php,js,vue,jsx}')),
        ],
        extractors: [
          {
            extractor: TailwindExtractor,
            extensions: ['html', 'js', 'vue', 'php']
          }
        ],
        whitelist,
        whitelistPatterns,
        whitelistPatternsChildren,
      }),
      new StylelintPlugin({
        context: resolve('src/'),
      }),
      <% if(projectUsage === 'vueapp' || projectFramework === 'vue') { %>
      new VueLoaderPlugin(),
      <% } %>
      new ManifestPlugin({
        options: {
          writeToFileEmit: true,
        },
      }),
      ...chunks,
      new HtmlWebpackPlugin({
        filename: path.resolve(`${config.distPaths.base}/boilerplate/typography.html`),
        template: `${config.srcPaths.base}boilerplates/typography.html`,
        inject: true,
        minify: false,
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      }),
      new WriteFilePlugin({
        log: false,
        test: /^(?!.+(?:hot-update.(js|json))).+$/,
      }),
      new Stylish(),
    ifProduction(new BundleAnalyzerPlugin({
      analyzerMode: 'disabled',
      generateStatsFile: true,
      statsFilename: `${BASE_PATH}/webpack/stats.json`,
      logLevel: 'silent',
    })),
    ])
  };
};

