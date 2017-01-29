const fs = require('fs-extra-promise');
const chalk = require('chalk');
const md = require('../markdown/markdown');

function saveSingle(item) {
  const filename = `.mr/content/${item.id.slice(0, 2)}/${item.id.slice(2)}.md`;
  return new Promise((resolve, reject) => {
    fs.outputFileAsync(filename, md.stringify(item))
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function saveMultiple(items) {
  const total = items.length;
  let progress = 0;
  return new Promise((resolve, reject) => {
    items.forEach((item) => {
      saveSingle(item)
        .then(() => {
          progress += 1;
          if (progress >= total) {
            resolve();
          }
        })
        .catch((error) => {
          progress += 1;
          reject(error);
        });
    });
  });
}

function save(data) {
  return saveMultiple((Array.isArray(data) ? data : [data]));
}

module.exports = save;
