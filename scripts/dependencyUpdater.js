#!/usr/bin/env node

/**
 * Update dependencies in this generator when new available
 *
 * @package  lilly
 * @author   Martin Herweg <info@martinherweg.de>
 */

/*
|---------------------------------------------------
| dependencyUpdater.js
|---------------------------------------------------
*/

const ora = require('ora');

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

const updatePackage = async ({
  packageName,
  packageVersion,
  filename,
  fileContent,
  nestedObject = false,
  nestedKey = '',
}) => {
  const versions = ora(`Loading versions for ${packageName}`).start();
  if (!packageName) return;
  try {
    const result = await availablePackageVersion({ name: packageName }, true);
    versions.stop();
    if (result.versions.length === 0) return;
    const betaVersions = result.versions
      .filter(version => version.match(/(beta|alpha)/g))
      .filter((version, index, orgArray) => {
        return orgArray.indexOf(version) > orgArray.length - 4;
      })
      .filter(version => {
        return compareVersions(packageVersion.replace('^', ''), version) === -1;
      });
    const stableVersions = result.versions
      .filter(version => !version.match(/(beta|alpha)/g))
      .filter((version, index, orgArray) => {
        return orgArray.indexOf(version) > orgArray.length - 4;
      })
      .filter(version => {
        return compareVersions(packageVersion.replace('^', ''), version) === -1;
      });

    if (stableVersions.length > 0 || betaVersions.length > 0) {
      await inquirer
        .prompt([
          {
            type: 'list',
            name: 'update',
            choices: [
              ...stableVersions,
              stableVersions.length > 0 && betaVersions.length > 0
                ? new inquirer.Separator()
                : '',
              ...(betaVersions.length > 0 ? betaVersions : []),
              new inquirer.Separator(),
              'No',
            ].filter(choice => choice.length !== 0),
            message: `Do you want to update ${
              result.name
            } from ${packageVersion} to one of the listed versions? in ${path.basename(
              filename,
            )}?`,
          },
        ])
        .then(async ({ update }) => {
          if (update !== 'No') {
            if (nestedObject) {
              fileContent[nestedKey][packageName] = '^' + update;
            } else {
              fileContent[packageName] = '^' + update;
            }

            fs.writeFileSync(filename, JSON.stringify(fileContent, null, 2));
          }
        })
        .catch(e => console.error(e));
    }
  } catch (e) {
    console.error(e);
  }
};

const run = async jsonFiles => {
  await forEachSeries(jsonFiles, async file => {
    const contents = require(path.resolve(file));
    await forEachSeries(Object.entries(contents), async ([key, value]) => {
      if (typeof value === 'string') {
        await updatePackage({
          packageName: key,
          packageVersion: value,
          filename: file,
          fileContent: contents,
        });
      } else {
        await forEachSeries(Object.entries(value), async ([nestedKey, nestedValue]) => {
          await updatePackage({
            packageName: nestedKey,
            packageVersion: nestedValue,
            filename: file,
            fileContent: contents,
            nestedObject: true,
            nestedKey: key,
          });
        });
      }
    });
  });
};

run(dependencyFiles);
