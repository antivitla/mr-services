const glob = require('globby');
const fs = require('fs-extra-promise');
const async = require('async');
const chalk = require('chalk');
const safePattern = require('./nuka-safe-pattern');

const excludePatterns = [
  '!**/node_modules/**',
  '!**/bower_components/**',
];

function fileDate(filename) {
  return new Promise((resolve, reject) => {
    fs.stat(filename, (error, stat) => {
      if (error) {
        reject(error);
      } else {
        const date = stat.birthtime < stat.time ? stat.birthtime : stat.ctime;
        resolve(date);
      }
    });
  });
}

function readFiles(userPattern, forEachCallback) {
  return new Promise((resolve, reject) => {
    glob([safePattern(userPattern)].concat(excludePatterns))
    .then((filepaths) => {
      if (!filepaths.length) {
        reject('404');
      } else {
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
