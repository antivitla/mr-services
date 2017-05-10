const fs = require('fs-extra-promise');
const md = require('../md/md');

function saveSingle(item, home = '.') {
  const filename = `${home}/.mr/content/${item.id.slice(0, 2)}/${item.id.slice(2)}.md`;
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

function saveMultiple(items, home) {
  const total = items.length;
  let progress = 0;
  return new Promise((resolve, reject) => {
    items.forEach((item) => {
      saveSingle(item, home)
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

module.exports = saveMultiple;
