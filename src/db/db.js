const fs = require('fs-extra-promise');
const uuid = require('node-uuid');
const options = require('../options/options');

function url({ id } = {}, { home = options.home } = {}) {
  return `${home}/.mr/content/${id.slice(0, 2)}/${id.slice(2)}.md`;
}

function read({ id } = {}, { home = options.home } = {}) {
  return fs.readFileAsync(url({ id }, { home }), 'utf8');
}

function write({ id = uuid.v1(), text } = {}, { home = options.home } = {}) {
  return new Promise((resolve, reject) => {
    fs.outputFileAsync(url({ id }, { home }), text)
    .then(() => {
      resolve(id);
    })
    .catch((error) => {
      reject(error);
    });
  });
}

function remove({ id } = {}, { home = options.home } = {}) {
  return fs.removeAsync(url({ id }, { home }));
}

module.exports = {
  read,
  write,
  remove,
};
