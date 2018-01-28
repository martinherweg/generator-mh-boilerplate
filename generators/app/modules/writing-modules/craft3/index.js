/**
 * Write the Craft Project
 *
 * @package  generator-lilly
 * @author   Martin Herweg <info@martinherweg.de>
 */

/* eslint-disable */
const fs = require('fs-extra');
const path = require('path');
const ejs = require('ejs');
const dotenv = require('dotenv');
const deleteFiles = require('../../../helpers/_deleteFolderRecursive');
const writePaths = require('../../packageJson-modules/paths/_distPaths');
const commentLog = require('../../../helpers/_logComment');

const craftFolders = {
  DELETE: [
    'dist/craft/templates',
    'dist/craft/config/db.php',
    'dist/craft/config/general.php',
    'dist/public/'
  ],
  SRC: {
    files: [
      {
        src: 'templates/',
        dest: 'src/views/'
      },
      {
        src: 'scripts/downloadPlugin.js',
        dest: 'scripts/downloadPlugin.js'
      }
    ],
    nyStudio: {
      files: [
        {
          src: 'nystudio/config/db.php',
          dest: 'dist/craft/config/db.php'
        },
        {
          src: 'nystudio/config/general.php',
          dest: 'dist/craft/config/general.php'
        },
        {
          src: 'nystudio/environment/env.example.php',
          dest: 'dist/.env.example.php'
        },
        {
          src: 'nystudio/systemFiles/',
          dest: 'src/systemFiles/'
        }
      ]
    },
    defaultConfig: {
      files: [
        {
          src: 'default/systemFiles/',
          dest: 'src/systemFiles'
        }
      ]
    }
  }
};

const writingCraft = () => {
  return {
    download: context => {
      context.spawnCommandSync('composer', [
        'create-project',
        'craftcms/craft',
        'dist',
        '-s',
        'RC'
      ]);

      commentLog({
        message: 'Downloaded Craft now initial Setup.'
      });

      if (process.env.NODE_ENV === 'test') {
        context.spawnCommandSync(
          context.destinationPath() + '/dist/craft',
          ['setup/security-key']
        );

        context.spawnCommandSync(
          context.destinationPath() + '/dist/craft',
          ['setup/db-creds', '--interactive=0', '--database=testdb', '--user=tester', '--password=user']
        );

        return context.spawnCommandSync(
          context.destinationPath() + '/dist/craft',
          ['install', '--interactive=0', '--email=max@mustermann.co', '--username=max', '--password=mustermann', '--siteName=CraftTest', '--siteUrl=http://craft.test']
        );
      }

      return context.spawnCommandSync(
        context.destinationPath() + '/dist/craft',
        ['setup']
      );
    },
    writing: context => {
      return new Promise(resolve => {
        // load dotenv file
        const {parsed: DOTENV} = dotenv.config({
          path: context.destinationPath() + '/dist/.env'
        });

        // Copy our Folders
        craftFolders.SRC.files.forEach(file => {
          context.fs.copy(
            context.templatePath(`craft/${file.src}`),
            context.destinationPath(file.dest)
          );
        });

        // install nystudio environment and scripts via compposer
        const spawnCommandOptions = {
          cwd: context.destinationPath() + '/dist/'
        };
        context.spawnCommandSync(
          'composer',
          [
            'require',
            'nystudio107/craft3-multi-environment',
            '--prefer-stable'
          ],
          spawnCommandOptions
        );
        context.spawnCommandSync(
          'composer',
          ['require', 'nystudio107/craft-scripts'],
          spawnCommandOptions
        );

        fs.symlinkSync(
          context.destinationPath(
            'dist/vendor/nystudio107/craft-scripts/scripts'
          ),
          context.destinationPath('dist/scripts')
        );

        // nystudio multi nev

        const copyOptions = {
          overwrite: true
        };

        // overwrite everything in .env.php with data from craft setup
        let ENV_FILE = fs.readFileSync(
          context.destinationPath(
            'dist/vendor/nystudio107/craft3-multi-environment/example.env.php'
          ),
          {
            encoding: 'utf8'
          }
        );

        Object.keys(DOTENV).forEach(key => {
          let new_key;
          if (key === 'ENVIRONMENT') {
            new_key = 'CRAFT_' + key;
          } else {
            new_key = key;
          }
          const regex = new RegExp(`REPLACE_ME_${new_key}`, 'g');
          const subst = `${DOTENV[key]}`;
          ENV_FILE = ENV_FILE.replace(regex, subst);
        });

        fs.writeFileSync(context.destinationPath('dist/.env.php'), ENV_FILE, {
          encoding: 'utf8'
        });

        let ENV_SCRIPTS = fs.readFileSync(
          context.destinationPath(
            'dist/vendor/nystudio107/craft-scripts/scripts/craft3-example.env.sh'
          ),
          {
            encoding: 'utf8'
          }
        );

        DOTENV.ROOT_PATH = process.cwd() + '/';
        Object.keys(DOTENV).forEach(key => {
          let new_key;
          if (key === 'DB_DATABASE') {
            new_key = 'DB_NAME';
          } else if (key === 'DB_TABLE_PREFIX') {
            new_key = '​​​​​GLOBAL_' + key; /*?*/
          } else {
            new_key = 'LOCAL_' + key;
          }

          const regex = new RegExp(`${new_key}="REPLACE_ME"`, 'g');
          const subst = `${new_key}="${DOTENV[key]}"`;
          ENV_SCRIPTS = ENV_SCRIPTS.replace(regex, subst).replace(
            /GLOBAL_DB_TABLE_PREFIX=""/g,
            `GLOBAL_DB_TABLE_PREFIX="${DOTENV['DB_TABLE_PREFIX']}"`
          );
        });

        fs.writeFileSync(context.destinationPath('dist/.env.sh'), ENV_SCRIPTS, {
          encoding: 'utf8'
        });

        fs.symlinkSync(
          context.destinationPath('dist/.env.sh'),
          context.destinationPath('dist/scripts/.env.sh')
        );
        // END overwrite everything in .env.php with data from craft setup

        fs.copy(
          context.destinationPath(
            'dist/vendor/nystudio107/craft3-multi-environment/web/index.php'
          ),
          context.destinationPath('dist/web/index.php'),
          copyOptions
        );

        fs.copy(
          context.destinationPath(
            'dist/vendor/nystudio107/craft3-multi-environment/config/db.php'
          ),
          context.destinationPath('dist/config/db.php'),
          copyOptions
        );

        fs.copy(
          context.destinationPath(
            'dist/vendor/nystudio107/craft3-multi-environment/config/general.php'
          ),
          context.destinationPath('dist/config/general.php'),
          copyOptions
        );

        fs.copy(
          context.destinationPath(
            'dist/vendor/nystudio107/craft3-multi-environment/config/volumes.php'
          ),
          context.destinationPath('dist/config/volumes.php'),
          copyOptions
        );

        // END nystudio multi nev

        const craftIgnore = fs.readFileSync(
          context.templatePath('craft3/_gitignore'),
          {
            encoding: 'UTF-8'
          }
        );

        const _ignoreFile = ejs.render(craftIgnore, {
          projectUsage: context.props.projectUsage,
          craftEnv: context.props.craftEnv
        });

        // copy .env.example.php to .env.php
        if (
          context.fs.exists(context.destinationPath('dist/.env.example.php'))
        ) {
          context.fs.copy(
            context.destinationPath('dist/.env.example.php'),
            context.destinationPath('dist/.env.php')
          );
        }

        context.props.projectIgnore = _ignoreFile;

        resolve();
      });
    }
  };
};

module.exports = writingCraft;
