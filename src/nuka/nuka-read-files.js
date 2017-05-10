const glob = require('globby');
const fs = require('fs-extra-promise');
const async = require('async');
const chalk = require('chalk');
const safePattern = require('./nuka-safe-pattern');
const fileDate = require('./nuka-file-date');

const excludePatterns = [
  '!**/node_modules/**',
  '!**/bower_components/**',
];

function defaultTreeTitle() {
  return process.cwd().split(/\\|\//).pop();
}

function isTreeFile(filename) {
  const path = filename.split('/');
  const isTreeNode = path.slice(-1)[0].replace(/\.md$/, '') === path.slice(-2)[0];
  const isRootNode = defaultTreeTitle() === path[0].replace(/\.md$/,'');
  return isTreeNode || isRootNode;
}

function readFiles(userPattern, forEachCallback) {
  return new Promise((resolve, reject) => {
    glob([safePattern(userPattern)].concat(excludePatterns))
    .then((filepaths) => {
      if (!filepaths.length) {
        reject('404');
      } else {
        // А не отсортировать ли нам массив по файлам-деревьям,
        // вынеся их вперед, чтоб гарантировано создать первыми?
        filepaths.sort((a, b) => {
          if (isTreeFile(a) && !isTreeFile(b)) return -1;
          else if (isTreeFile(b) && !isTreeFile(a)) return 1;
          return 0;
        });
        async.eachSeries(filepaths, (filepath, callback) => {
          fileDate(filepath)
          .then((date) => {
            fs.readFileAsync(filepath, 'utf8')
            .then((text) => {
              if (forEachCallback) {
                forEachCallback(filepath, { date, text }, callback);
              } else {
                callback();
              }
            })
            .catch((error) => {
              console.log(chalk.red(error));
              callback();
            });
          });
        }, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      }
    });
  });
}

module.exports = readFiles;
