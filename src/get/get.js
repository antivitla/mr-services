const fs = require('fs-extra-promise');
const glob = require('globby');
const md = require('../markdown/markdown');

function getById(id, home = '.') {
  return new Promise((resolve, reject) => {
    fs.readFileAsync(`${home}/.mr/content/${id.slice(0, 2)}/${id.slice(2)}.md`)
      .then((content) => {
        // console.log(require('../markdown/markdown'));
        // console.log(md);
        md.parse(content)
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

function getAll(home = '.') {
  return new Promise((resolve, reject) => {
    const items = [];
    // file list
    glob([`${home}/.mr/content/**/*.md`]).then((files) => {
      if (files.length) {
        files.forEach((file) => {
          fs.readFileAsync(file).then((content) => {
            md.parse(content).then((index) => {
              items.push(index[0]);
              if (items.length >= files.length) {
                resolve(items);
              }
            });
          });
        });
      } else {
        resolve(items);
      }
    });
  });
}

function get({ id, home = '.' } = {}) {
  return id ? getById(id, home) : getAll(home);
}

module.exports = get;
