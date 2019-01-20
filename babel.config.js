module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '7.6.0',
        },
      },
    ],
  ],
  env: {
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: '7.6.0',
            },
            debug: true,
          },
        ],
      ],
      plugins: ['dynamic-import-node'],
    },
  },
};
