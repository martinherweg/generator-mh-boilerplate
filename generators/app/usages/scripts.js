/**
 * Write Scripts Folder with useful Node scripts
 *
 * @package  generator-lilly
 * @author   Martin Herweg <info@martinherweg.de>
 */

/* eslint-disable */
const fs         = require('fs-extra');
const ejs        = require('ejs');
const writePaths = require('../packageJson/paths/_distPaths');

const writingScripts = () => {
  return {
    writing: context => {
      return new Promise((resolve) => {
        const files = [
          'createDirs.js',
        ];
        files.forEach((file) => {
          context.fs.copyTpl(
            context.templatePath(`scripts/${file}`),
            context.destinationPath(`scripts/${file}`),
            {
              projectUsage: context.props.projectUsage,
            }
          );
        });
        resolve();
      });
    }
  };
};

module.exports = writingScripts;
