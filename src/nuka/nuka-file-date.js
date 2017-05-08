const fs = require('fs-extra-promise');

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

module.exports = fileDate;
