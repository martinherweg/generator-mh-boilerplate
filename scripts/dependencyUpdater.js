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

const updatePackage = async ({
  packageName,
  packageVersion,
  filename,
  fileContent,
  nestedObject = false,
  nestedKey = '',
}) => {
  const result = await availablePackageVersion(packageName, true);
  const latestVersion = result.versions[result.versions.length - 1];

  if (compareVersions(packageVersion.replace('^', ''), latestVersion) === -1) {
    await inquirer
      .prompt([
        {
          type: 'confirm',
          name: 'update',
          message: `Do you want to update ${
            result.name
          } from ${packageVersion} to ${latestVersion} in ${path.basename(filename)}?`,
        },
      ])
      .then(async ({ update }) => {
        if (update) {
          if (nestedObject) {
            fileContent[nestedKey][packageName] = '^' + latestVersion;
          } else {
            fileContent[packageName] = '^' + latestVersion;
          }

          fs.writeFileSync(filename, JSON.stringify(fileContent, null, 2));
        }
      });
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
