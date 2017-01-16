const fs = require('fs-extra');
const md = require('../markdown/markdown');

function saveSingle(item, callback) {
  const filename = `.mr/content/${item.id.slice(0, 2)}/${item.id.slice(2)}.md`;
  fs.mkdirs(`.mr/content/${item.id.slice(0, 2)}`, (error) => {
    if (!error) {
      fs.writeFile(filename, md.stringify(item), (err) => {
        if (callback) callback(err);
      });
    } else if (callback) {
      callback(error);
    }
  });
}

function saveMultiple(items, callback) {
  const total = items.length;
  let progress = 0;
  items.forEach((item) => {
    saveSingle(item, (error) => {
      if (error) console.log(error);
      progress += 1;
      if (progress >= total && callback) {
        callback();
      }
    });
  });
}

function save(data, callback) {
  if (Array.isArray(data)) {
    return saveMultiple(data, callback);
  }
  return saveSingle(data, callback);
}

module.exports = save;
