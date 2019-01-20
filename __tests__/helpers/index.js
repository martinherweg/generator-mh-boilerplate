const fs = require('fs');

exports.getFileContent = file => {
  return fs.readFileSync(file, 'utf8');
};
