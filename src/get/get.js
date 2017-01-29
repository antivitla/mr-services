const fs = require('fs-extra-promise');
const md = require('../markdown/markdown');

function get(id, { showProgress = true } = {}) {
  return new Promise((resolve, reject) => {
    fs.readFileAsync(`.mr/content/${id.slice(0, 2)}/${id.slice(2)}.md`)
      .then((content) => {
        md.parse(content, { showProgress })
          .then((index) => {
            resolve(index);
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

module.exports = get;
