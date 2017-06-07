'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const filesystem = require('fs-extra'); // eslint-disable-line no-unused-vars
const commandExists = require('command-exists');
const ProgressBar = require('progress'); // eslint-disable-line no-unused-vars

// Import Helpers
const logComment = require('./helpers/_logComment');

// Importing modules
const promptsFunction = require('./modules/prompts');
const writePackageJson = require('./modules/writing-modules/_package.json');
const filesEnvironment = require('./config/_filesEnvironment');

// Craft CMS
const writingCraft = require('./modules/writing-modules/craft');

// Laravel
const writingLaravel = require('./modules/writing-modules/laravel');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.logComment = logComment.bind(this);
    this.promptsFunction = promptsFunction.bind(this);
    this.writePackageJson = writePackageJson.bind(this);
    this.filesEnviroment = filesEnvironment;

    // CRAFT CMS
    this.writingCraft = writingCraft.bind(this);

    // Laravel
    this.writingLaravel = writingLaravel.bind(this);

    this.commands = {
      composer: false,
      yarn: false,
      git: false
    };
  }

  async initializing() {
    this.logComment({message: 'Initializing the Generator'});
    try {
      await commandExists('composer');
      this.commands.composer = true;
      await commandExists('yarn');
      this.commands.yarn = true;
      await commandExists('git');
      this.commands.git = true;
    } catch (e) {
      if (e) {
        console.error(e);
      }
    }
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the marvelous ' + chalk.red('generator-mh-boilerplate') + ' generator!'
    ));
    this.logComment({message: 'Prompting'});
    // Execute function so we get its returned array;
    const prompts = promptsFunction();
    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  async configuring() {
    this.logComment({message: 'Configure Project'});
    // Install Craft or Laravel and configure their Folders for our needs.
    if (this.props.projectUsage === 'craft' && this.props.craftInstall) {
      try {
        await this.writingCraft().download(this);
      } catch (e) {
        console.error(e);
      }
    }

    if (this.props.projectUsage === 'laravel' && this.props.laravelInstall) {
      try {
        await this.writingLaravel().download(this);
      } catch (e) {
        console.error(e);
      }
    }
  }

  async writing() {
    this.logComment({message: 'Writing files'});
    /*
     |--------------------------------------------------------------------------
     | Writing Craft
     |--------------------------------------------------------------------------
     */
    if (this.props.projectUsage === 'craft') {
      this.logComment({message: 'Moving Craft Folders'});
      try {
        await this.writingCraft().writing(this);
      } catch (e) {
        console.error(e);
      }
    }

    /*
     |--------------------------------------------------------------------------
     | Writing Laravel
     |--------------------------------------------------------------------------
     */

    if (this.props.projectUsage === 'laravel') {
      this.logComment({
        message: 'Moving Laravel Folders'
      });
      try {
        await this.writingLaravel().writing(this);
      } catch (e) {
        console.error(e);
      }
    }
    /*
     |--------------------------------------------------------------------------
     | Moving Basic Boilerplate Files
     |--------------------------------------------------------------------------
     */
    this.logComment({message: 'Moving Basic Folder', short: true});

    const filesEnvironmentProgress = new ProgressBar('[:bar] :percent :etas', {
      complete: '=',
      incomplete: ' ',
      width: 20,
      total: 0
    });

    filesEnvironmentProgress.total = this.filesEnviroment.files.length;

    this.filesEnviroment.files.forEach(file => {
      this.fs.copyTpl(
        this.templatePath(file.src),
        this.destinationPath(file.dest),
        this.props
      );
      filesEnvironmentProgress.tick(1);
    });

    // Getting the template files
    const pkg = this.fs.readJSON(this.templatePath('_package.json'), {});
    // Write Basic package.json
    this.writePackageJson({
      context: this,
      files: {
        pkg
      }
    });

    await this.fs.writeJSON(this.destinationPath('package.json'), pkg);
  }

  install() {
    if (this.commands.yarn) {
      this.yarnInstall();
    } else {
      this.npmInstall();
    }

    this.logComment({
      message: '> Initializing git and make first commit',
      short: true,
      color: 'green'
    });

    if (this.commands.git) {
      this.spawnCommandSync('git', ['init']);
      if (process.env.NODE_ENV === 'test') {
        return;
      }
      this.spawnCommandSync('git', ['add', '-A']);
      this.spawnCommandSync('git', ['commit', '-m "initial commit"']);
    }
  }
};
