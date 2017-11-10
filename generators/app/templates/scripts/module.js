/**
 * Create a new Module
 *
 * @package  generator-lilly
 * @author   Martin Herweg <info@martinherweg.de>
 */

const memFs = require('mem-fs');
const argv = require('yargs').argv;
const editor = require('mem-fs-editor');
const inquirer = require('inquirer');
const path = require('path');
const pkg = require('../package.json');

function createModule({ moduleName, components = {} }) {
  const store = memFs.create();
  const fs = editor.create(store);
  const srcPath = path.resolve(`${pkg.srcPaths.views}modules`);
  const vuePath = `${path.resolve(pkg.srcPaths.js)}`;

  const basePath = path.resolve(__dirname, '../');

  const moduleArray = moduleName.split('/');
  const dist = {};
  dist.name = moduleArray[moduleArray.length - 1].toLowerCase();
  dist.path = moduleArray.length > 1 ? moduleArray.slice(0, -1).join('/') : `${dist.name}`;
  const fileName = path.resolve(srcPath, `${dist.path}/${dist.name}`);

  let fileExtension;

  switch (pkg.projectType) {
    case 'craft':
      fileExtension = '.html';
      break;
    case 'laravel':
      fileExtension = '.blade.php';

    default:
      fileExtension = '.html';
      break;
  }

  try {
    const moduleData = {
      moduleName: dist.name,
      authors: pkg.authors,
      projectName: pkg.name,
      file: `${dist.path}/${dist.name}`,
    };

    if (components.js) {
      fs.copyTpl(path.resolve(__dirname, './moduleTemplates/_script.js'), `${fileName}.scripts.js`, moduleData);
      console.log(`${fileName}.scripts.js`);
    }

    if (components.css) {
      fs.copyTpl(path.resolve(__dirname, './moduleTemplates/_style.scss'), `${fileName}.styles.scss`, moduleData);
      console.log(`${fileName}.styles.scss`);
    }

    if (components.template) {
      fs.copyTpl(path.resolve(__dirname, './moduleTemplates/_template.html'), `${fileName}${fileExtension}`, moduleData);
      console.log(`${fileName}${fileExtension}`);
    }

    if (components.vue) {
      fs.copyTpl(path.resolve(__dirname, './moduleTemplates/_template.vue'), path.resolve(`${vuePath}/${moduleName}.vue`), moduleData);
      console.log(`${vuePath}/${moduleName}.vue`);
    }

    console.log('Everything created');
    fs.commit((done) => {
      console.log('done');
    });
  } catch (e) {
    console.error(e);
  }
}

if (argv._.length) {
  return createModule({
    moduleName: argv._[0],
    components: {
      js: argv.js || argv.javascript,
      css: argv.css || argv.scss || argv.style,
      template: argv.html || argv.template,
      vue: argv.vue,
    },
  });
}

inquirer
  .prompt([
    {
      type: 'input',
      name: 'moduleName',
      message: 'Please input module name',
      default: 'module',
    },
    {
      type: 'checkbox',
      name: 'components',
      message: 'Module Components',
      choices: [
        {
          name: 'Style',
          value: 'css',
        },
        {
          name: 'JavaScript',
          value: 'js',
        },
        {
          name: 'Template',
          value: 'template',
        },
      ],
    },
  ])
  .then(async (answers) => {
    createModule({
      moduleName: answers.moduleName,
      components: {
        js: !!answers.components.includes('js'),
        css: !!answers.components.includes('css'),
        template: !!answers.components.includes('template'),
      },
    });
  });
