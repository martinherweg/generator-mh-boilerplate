'use strict';
const Generator = require('yeoman-generator');
const filesystem = require('fs-extra'); // eslint-disable-line no-unused-vars
const commandExists = require('command-exists');
const ProgressBar = require('progress'); // eslint-disable-line no-unused-vars

// require some usage files
// Craft CMS
const craft2 = require('./usages/craft');
const craft3 = require('./usages/craft3');

// Laravel
const laravel = require('./usages/laravel');

// Vue
const vue = require('./usages/vue');

// Import Helpers
const logComment = require('./helpers/logComment');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.logComment = logComment.bind(this);

    // Beta option
    this.option('beta');

    // Bind usages
    this.craft = craft2.bind(this);
    this.craft3 = craft3.bind(this);
    this.laravel = laravel.bind(this);

    // Check for cli commands
    this.commands = {
      composer: false,
      yarn: false,
      git: false,
    };
  }

  async initializing() {
    this.logComment({ message: 'Initializing the Generator' });
    await Promise.all(
      Object.keys(this.commands).map(command => {
        return commandExists(command)
          .then(commandResult => {
            this.commands[commandResult] = true;
          })
          .catch(error => console.warn(error));
      }),
    );
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(require('./helpers/intro'));

    const prompts = require('./prompts');
    return this.prompt(prompts(this)).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  async configuring() {
    this.logComment({ message: 'Install Stuff' });
    // Install Craft or Laravel and configure their Folders for our needs.
    if (this.props.projectUsage === 'craft' && this.props.craftInstall) {
      try {
        await this.craft.download(this);
      } catch (e) {
        console.error(e);
      }
    }

    if (this.props.projectUsage === 'craft3') {
      try {
        await this.craft3().download(this);
      } catch (e) {
        console.error(e);
      }
    }

    // Download fresh copy of craft-scripts by ny-studio
    if (this.props.projectUsage === 'craft') {
      try {
        await this.craft().downloadCraftScripts(this);
      } catch (e) {
        console.error(e);
      }
    }

    if (this.props.projectUsage === 'laravel' && this.props.laravelInstall) {
      try {
        await this.laravel().download(this);
      } catch (e) {
        console.error(e);
      }
    }
  }

  async writing() {
    const packageScripts = require('./usages/scripts');
    this.logComment({ message: 'Writing files' });
    // This is a bit hacky
    if (this.props.projectUsage === 'vueapp') {
      this.props.projectFramework = false;
    }

    // Write first parts of package.json
    const pkg = this.fs.readJSON(this.templatePath('_package.json'), {});
    await packageScripts().writing(this);

    // Copying the different usages stuff
    /*
     |--------------------------------------------------------------------------
     | Writing Craft
     |--------------------------------------------------------------------------
     */
    if (this.props.projectUsage === 'craft') {
      this.logComment({ message: 'Moving Craft Folders' });
      try {
        await this.craft2().writing(this);
      } catch (e) {
        console.error(e);
      }
    }

    if (this.props.projectUsage === 'craft3') {
      this.logComment({ message: 'Moving Craft Folders' });
      try {
        await this.craft3().writing(this);
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
        message: 'Moving Laravel Folders',
      });
      try {
        await this.laravel().writing(this);
      } catch (e) {
        console.error(e);
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Writing Vue
    |--------------------------------------------------------------------------
    */

    if (this.props.projectFramework === 'vue' || this.props.projectUsage === 'vueapp') {
      this.logComment({
        message: 'Adding Vue to the Project',
      });

      try {
        await vue.writingVue().writing({
          files: {
            pkg,
          },
          context: this,
        });
      } catch (e) {
        console.error(e);
      }
    }

    /*
     |--------------------------------------------------------------------------
     | Moving Basic Boilerplate Files
     |--------------------------------------------------------------------------
     */
    this.logComment({ message: 'Moving Basic Folder', short: true });

    const filesEnvironmentProgress = new ProgressBar('[:bar] :percent :etas', {
      complete: '=',
      incomplete: ' ',
      width: 20,
      total: 0,
    });

    const environmentFiles = require('./writeFiles/environment-files');

    filesEnvironmentProgress.total = environmentFiles.files.length;

    this.filesEnviroment.files.forEach(file => {
      this.fs.copyTpl(
        this.templatePath(file.src),
        this.destinationPath(file.dest),
        this.props,
      );
      filesEnvironmentProgress.tick(1);
    });
    // Write Basic package.json
    this.writePackageJson({
      context: this,
      files: {
        pkg,
      },
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
      color: 'green',
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
