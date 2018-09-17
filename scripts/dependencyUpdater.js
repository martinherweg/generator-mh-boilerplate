#!/usr/bin/env node

const path = require('path');
const { forEachSeries, forEach } = require('p-iteration');
const fs = require('fs-extra');
const availablePackageVersion = require('available-versions');
const compareSemver = require('compare-versions');
const inquirer = require('inquirer');
const glob = require('glob');

const dependencyFiles = glob.sync('./generators/app/packageJson/**/*.json');

const readJson = async file => {
  const jsonContent = await fs.readJsonSync(file);

  return jsonContent;
};

const compareVersions = (old, newVersion) => {
  return compareSemver(old, newVersion);
};

updatePackage = async ({
  originalFile,
  packageName,
  packageOldVersion,
  packageNewVersion,
}) => {
  try {
    const answer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'update',
        message: `Do you want to update ${packageName} from ${packageOldVersion} to ${packageNewVersion}?`,
      },
    ]);
    console.log(answer);
    return answer;
  } catch (e) {
    return console.error(e);
  }
};

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

// Const run = async jsonFiles => {
//   for (let file of jsonFiles) {
//     const fileContent = require(path.resolve(file));
//     const fileContents = Object.entries(fileContent)
//       .filter(([key, value]) => {
//         if (typeof value === 'string') {
//           return true;
//         }
//         return false;
//       })
//       .map(([key, value]) => {
//         return {
//           originalFile: file,
//           packageName: key,
//           packageOldVersion: value,
//         };
//       });
//
//     for (let contents of fileContents) {
//       console.log(file);
//       await updatePackage(contents);
//     }
//   }
// };

// Const run2 = async jsonFiles => {
//   await forEach(jsonFiles, async file => {
//     const fileContent = require(path.resolve(file));
//     await forEach(Object.entries(fileContent), async ([key, value]) => {
//       if (typeof value === 'string') {
//         const checkObject = {
//           name: key,
//         };
//         const result = await available(checkObject, true);
//         const latestVersion = result.versions[result.versions.length - 1];
//         if (compareVersions(value.replace('^', ''), latestVersion) === -1) {
//           console.log('update question for ' + key);
//
//           await inquirer
//             .prompt([
//               {
//                 type: 'confirm',
//                 name: 'update',
//                 message: `Do you want to update ${
//                   result.name
//                 } from ${value} to ${latestVersion}?`,
//               },
//             ])
//             .then(answers => {
//               console.log(answers);
//             });
//           // FileContent[key] = '^' + latestVersion;
//           // fs.writeFileSync(file, JSON.stringify(fileContent, null, 2));
//         }
//       } else {
//         console.log('loop through nested object');
//       }
//     });
//   });
// };

// Const run = async jsonFiles => {
//   jsonFiles.forEach(async file => {
//     const fileContent = await readJson(file);
//
//     Object.entries(fileContent).forEach(async ([package, version]) => {
//       let answers;
//       if (undefined) return false;
//       const checkObject = {
//         name: package,
//       };
//       try {
//         let update;
//         const result = await available(checkObject, true);
//         const latestVersion = result.versions[result.versions.length - 1];
//
//         if (typeof version === 'string') {
//           update = compareVersions(version.replace('^', ''), latestVersion);
//         } else {
//
//         }
//
//         if (update === -1) {
//           inquirer.prompt([
//             {
//               type: 'confirm',
//               name: 'update',
//               'message': `Do you want to update ${result.name} from ${version} to ${latestVersion}?`
//             }
//           ]).then(answer => answers.push(answer)).catch(e => console.error(e));
//         }
//       } catch(e) {
//         console.error(e);
//         throw new Error('there was an error');
//       }
//       return answers;
//     });
//   });
// };

run(dependencyFiles);
