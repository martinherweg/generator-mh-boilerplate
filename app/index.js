'use strict';
const path = require('path');
const util = require('util');
const yeoman = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const mkdirp = require('mkdirp');
const ora = require('ora');
const commandExists = require('command-exists');
let yarn = false;

module.exports = class extends yeoman {

  initializing() {
    this.pkg = require('../package.json');
    this.props = {};
  }

  prompting() {

    var done = this.async();
    var wp_cli = false;
    var craft_cli = false;
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the impressive ' + chalk.red('mh-boilerplate') + ' generator!'
    ));

    var warning =
    '\n This generator is customized for my own needs!'
    + '\n So it may not be the right thing for you!'
    + '\n Keep this in mind when you go further and please read the Readme'
    + '\n'
    + '\n Also this is very early version and maybe there are some bugs :)'
    + '\n';

    this.log(chalk.bold.red(warning));

    // check if cli tools exist
    commandExists('wp')
      .then(function(command){
        wp_cli = true
      }).catch(function(){
      wp_cli = false;
    });

    commandExists('craft')
      .then(function(command){
        craft_cli = true
      }).catch(function(){
      craft_cli = false;
    });

    commandExists('yarn')
      .then(function(command){
        yarn = true
      }).catch(function(){
      yarn = false;
    });

    return this.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Name the project (name of the theme folder in Wordpress)',
        default: 'mh-boilerplate'
      },{
        type: 'input',
        name: 'projectDescription',
        message: 'Short description of the Project`',
        default: 'undefined'
      },{
        type: 'input',
        name: 'projectProxy',
        message: 'Enter the vhost for your Project'
      },{
        type: 'list',
        name: 'projectUsage',
        message: 'Which purpose does this Project have? Choose the appropriate option',
        choices: [
          "Craft",
          "laravel",
          "HTML Protoypes",
          "Wordpress"
        ]
      },{
        when: function(answers) {
          if(answers.projectUsage === 'Craft') {
            return true
          }
          return false
        },
        type: 'confirm',
        name: 'craftHearty',
        message: 'Do you want to use Hearty Config?',
        default: true
      },{
        when: function(answers) {
          if(answers.projectUsage === 'Craft' && craft_cli) {
            return true
          }
          return false
        },
        type: 'confirm',
        name: 'craftInstall',
        message: 'Do you want to install Craft?',
        default: false
      },{
        when: function(answers) {
          if(answers.projectUsage === 'Wordpress' && wp_cli) {
            return true
          }
          return false
        },
        type: 'confirm',
        name: 'projectInstallWordpress',
        message: 'Do yo want to install Wordpress?',
        default: false
      },{
        when: function(answers) {
          return answers.projectUsage === 'laravel';
        },
        type: 'confirm',
        name: 'projectInstallLaravel',
        message: 'Do you want to install Laravel?',
        default: false
      },{
        type: 'confirm',
        name: 'projectUseVue',
        message: 'Do you want to use Vue on your project?',
        default: false
      },{
        when: function(answers) {
          return answers.projectUseVue;
        },
        type: 'list',
        name: 'projectVueVersion',
        message: 'Which version of Vue do you want to use',
        choices: [
          'Runtime only (You have to use .vue Files or Render Functions!',
          'Standalone'
        ]
      },{
        type: 'input',
        name: 'projectVersion',
        message: 'Project Version Number',
        default: '0.0.1'
      },{
        type: 'input',
        name: 'projectAuthor',
        message: 'Project Author or company',
        default: 'undefined',
        store: true
      },{
        type: 'input',
        name: 'projectMail',
        message: 'Mailadress of the author',
        default: 'undefined',
        store: true
      },{
        type: 'input',
        name: 'projectUrl',
        message: 'Author URl',
        default: 'http://...',
        store: true
      },{
        type: 'input',
        name: 'projectRepo',
        message: 'Git Repo URL',
        default: 'http://...'
      }
    ]).then(function(answers) {
      function checkAnswer(answer) {
        if(answer) {
          return answer
        } else {
          return false
        }
      }
      this.projectName = answers.projectName;
        this.projectDescription = answers.projectDescription;
        this.projectProxy = answers.projectProxy;
        this.projectUsage = answers.projectUsage;
        this.projectInstallWordpress = checkAnswer(answers.projectInstallWordpress);
        this.projectInstallLaravel = checkAnswer(answers.projectInstallLaravel);
        this.craftInstall = checkAnswer(answers.craftInstall);
        this.craftHearty = checkAnswer(answers.craftHearty);
        this.projectUseVue = checkAnswer(answers.projectUseVue);
        this.projectVueVersion = answers.projectVueVersion;
        this.projectVersion = answers.projectVersion;
        this.projectAuthor = answers.projectAuthor;
        this.projectMail = answers.projectMail;
        this.projectUrl = answers.projectUrl;
        this.projectRepo = answers.projectRepo;
        done();
    }.bind(this))
  }

  projectfiles() {

    var params = {
      projectName: this.projectName,
      projectDescription: this.projectDescription,
      projectProxy: this.projectProxy,
      projectUsage: this.projectUsage,
      projectInstallWordpress: this.projectInstallWordpress,
      projectInstallLaravel: this.projectInstallLaravel,
      craftInstall: this.craftInstall,
      craftHearty: this.craftHearty,
      projectUseVue: this.projectUseVue,
      projectVersion: this.projectVersion,
      projectVueVersion: this.projectVueVersion,
      projectAuthor: this.projectAuthor,
      projectMail: this.projectMail,
      projectUrl: this.projectUrl,
      projectRepo: this.projectRepo
    }

    // move src folder
    this.fs.copyTpl(
      this.templatePath('src/boilerplates'),
      this.destinationPath('src/boilerplates'),
      params
    );
    this.fs.copyTpl(
      this.templatePath('src/js'),
      this.destinationPath('src/js'),
      params
    );
    this.fs.copyTpl(
      this.templatePath('src/scss'),
      this.destinationPath('src/scss'),
      params
    );
    this.fs.copyTpl(
      this.templatePath('src/gulpfile'),
      this.destinationPath('./gulpfile'),
      params
    );
    this.fs.copyTpl(
      this.templatePath('src/webpack'),
      this.destinationPath('./webpack'),
      params
    );
    if(this.projectUsage === 'Craft') {
      this.fs.copyTpl(
        this.templatePath('src/craft'),
        this.destinationPath('src/views/'),
        params
      );3
    } else {
      this.fs.copyTpl(
        this.templatePath('src/php'),
        this.destinationPath('src/views'),
        params
      );
    }
    if(this.craftHearty) {
      this.fs.copyTpl(
        this.templatePath('craft/hearty/config'),
        this.destinationPath('dist/config'),
        params
      );
      this.fs.copyTpl(
        this.templatePath('craft/hearty/systemFiles'),
        this.destinationPath('src/systemFiles'),
        params
      );
      mkdirp('dist/plugins');
    } else {
      mkdirp('src/systemFiles');
    }
    mkdirp('src/images/cssimages');
    mkdirp('src/images/htmlimages');
    mkdirp('src/images/svg/single');
    mkdirp('src/images/svg/sprite');
    mkdirp('src/fonts');
    mkdirp('src/js/json');
    mkdirp('src/js/my-source');
    mkdirp('src/js/single');
    mkdirp('src/favicons');

    this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        params
    );
    this.fs.copyTpl(
        this.templatePath('_gulpfile.babel.js'),
        this.destinationPath('gulpfile.babel.js'),
        params
    );
    this.fs.copyTpl(
        this.templatePath('_config.json'),
        this.destinationPath('config.json'),
        params
    );
    this.fs.copyTpl(
        this.templatePath('_gitignore'),
        this.destinationPath('.gitignore'),
        params
    );
    this.fs.copyTpl(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig'),
        params
    );
    this.fs.copyTpl(
        this.templatePath('eslintrc'),
        this.destinationPath('.eslintrc.js'),
        params
    );
    this.fs.copyTpl(
        this.templatePath('stylelintrc'),
        this.destinationPath('.stylelintrc'),
        params
    );
    this.fs.copyTpl(
        this.templatePath('babelrc'),
        this.destinationPath('.babelrc'),
        params
    );
    this.fs.copyTpl(
        this.templatePath('_readme.md'),
        this.destinationPath('README.md'),
        params
    );
  }



  install() {
    var that = this;
    const spinner = ora('Install dependencies').start();
    console.log(yarn);
    // check if yarn is available and use it instead of npm
      if(yarn) {
        that.yarnInstall('', {},
          function cb() {
          const git_spinner = ora('Init git repo').start();
          that.spawnCommandSync('git', ['init']);
          const init_spinner = ora('Running Init').start();
          that.spawnCommandSync('npm', ['run', 'init']);
        }, {})
      } else {
        that.npmInstall('', {},
          function cb() {
            const git_spinner = ora('Init git repo').start();
            that.spawnCommandSync('git', ['init']);
            const init_spinner = ora('Running Init').start();
            that.spawnCommandSync('npm', ['run', 'init']);
          }, {})
      }

    if (this.projectInstallLaravel) {
      this.spawnCommand('laravel', ['new', 'dist']);
    } else if (this.projectInstallWordpress) {
      this.spawnCommand('wp', ['core', 'download', '--path=dist/', '--locale=de_DE', '--skip-themes=["twentythirteen", "twentyfourteen"]', '--skip-plugins' ]);
    } else if(this.craftInstall) {
      var done = this.async();
      this.spawnCommand('craft', ['install', 'dist']).on('close', done);
    }
  }
}