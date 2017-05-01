const glob = require('globby');
const moment = require('moment');
const fs = require('fs-extra-promise');
const async = require('async');
const md = require('../markdown/markdown');
const read = require('../read/read');

function asyncParseFiles({ pattern = '**/*.md', onFileIndexCallback } = {}) {
  return new Promise((resolve, reject) => {
    glob([pattern, '!**/node_modules/**', '!**/bower_components/**'])
      .then((files) => {
        async.eachSeries(files, (filename, callback) => {
          // Читаем и парсим файл
          read.file(filename)
            .then((text) => {
              const context = {};
              // Берём дату для контекста
              const stat = fs.statSync(filename);
              context.date = moment(stat.birthtime || stat.ctime).toISOString();
              // Парсим заметки с контекстом
              return md.parse(text, { contextObject: context });
            })
            .then((index) => {
              if (onFileIndexCallback) {
                onFileIndexCallback(filename, index, callback);
              } else {
                callback();
              }
            });
        }, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
  });
}

module.exports = asyncParseFiles;
