module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['last 2 versions', 'ie >= 10'],
        },
        modules: false,
        useBuiltIns: 'usage',
        debug: false,
      },
    ],
  ],
  plugins: ['@babel/syntax-dynamic-import', '@babel/plugin-proposal-object-rest-spread'],
};
