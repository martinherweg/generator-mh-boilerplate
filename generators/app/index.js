'use strict';
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  prompting() {
    return this.prompt(['PROMPTS ARRAY']).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    // Copy files
  }

  install() {
    this.installDependencies();
  }
};
