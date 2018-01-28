require('@babel/register')({
  presets: [
    ["@babel/preset-env", {
      "targets": {
        "node": "7.6.0"
      },
    }]
  ]
});

const requireDir = require('require-dir');

requireDir('./gulpfile/tasks', { recurse: true });
