#!/usr/bin/env node

const path = require('path');
const { forEachSeries } = require('p-iteration');
const fs = require('fs-extra');
const availablePackageVersion = require('available-versions');
const compareSemver = require('compare-versions');
const inquirer = require('inquirer');
const glob = require('glob');

const dependencyFiles = glob.sync('./generators/app/packageJson/**/*.json');

const compareVersions = (old, newVersion) => {
  return compareSemver(old, newVersion);
};

// Const updatePackage = async ({
//   originalFile,
//   packageName,
//   packageOldVersion,
//   packageNewVersion,
// }) => {
//   try {
//     const answer = await inquirer.prompt([
//       {
//         type: 'confirm',
//         name: 'update',
//         message: `Do you want to update ${packageName} from ${packageOldVersion} to ${packageNewVersion}?`,
//       },
//     ]);
//     console.log(answer);
//     return answer;
//   } catch (e) {
//     return console.error(e);
//   }
// };

const run = async jsonFiles => {
  await forEachSeries(jsonFiles, async file => {
    const contents = require(path.resolve(file));
    await forEachSeries(Object.entries(contents), async ([key, value]) => {
      if (typeof value === 'string') {
        const result = await availablePackageVersion(key, true);
        const latestVersion = result.versions[result.versions.length - 1];

        if (compareVersions(value.replace('^', ''), latestVersion) === -1) {
          await inquirer
            .prompt([
              {
                type: 'confirm',
                name: 'update',
                message: `Do you want to update ${
                  result.name
                } from ${value} to ${latestVersion} in ${path.basename(file)}?`,
              },
            ])
            .then(async ({ update }) => {
              if (update) {
                contents[key] = '^' + latestVersion;
                fs.writeFileSync(file, JSON.stringify(contents, null, 2));
              }
            });
        }
      }
    });
  });
};

run(dependencyFiles);
