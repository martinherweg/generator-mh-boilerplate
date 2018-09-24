const tailwindcss = require('tailwindcss');
const config = require('./package.json');

module.exports = {
  plugins: [
    tailwindcss('./tailwind.js'),
    require('autoprefixer')({
      cascade: false
    }),
    require('postcss-flexbugs-fixes'),
    require('postcss-assets')({
      basePath: config.distPaths.base,
      loadPaths: ['assets/images/**/*'],
    }),
    require('postcss-aspect-ratio'),
  ],
};
