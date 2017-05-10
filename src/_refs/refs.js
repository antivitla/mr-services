/* eslint no-param-reassign: 0 */

const fs = require('fs-extra-promise');
const os = require('os');

const matchRef = /^\[(.*)\]\((.*)\)/;

function parseLine(line) {
  const matches = line.match(matchRef);
  return {
    title: matches[1],
    id: matches[2],
  };
}

function stringifyRef(ref) {
  return `[${ref.title}](${ref.id})`;
}

function refsUpdate(index, home = '.', { replaceTitle = false, replaceId = false } = {}) {
  const newRefs = index.slice(0);
  return new Promise((resolve, reject) => {
    fs.readFileAsync(`${home}/.mr/refs.md`, 'utf-8')
      .then((text) => {
        // Читаем ссылки
        let refs = text.split(/(\r\n|\n)/g)
          .map(line => line.trim())
          .filter(line => line)
          .map(parseLine);
        // Заменяем если надо
        const somethingFound = [];
        refs.forEach((ref) => {
          for (let i = 0; i < newRefs.length; i += 1) {
            if (replaceId && ref.title === newRefs[i].title) {
              ref.id = newRefs[i].id;
              somethingFound.push(i);
            } else if (replaceTitle && ref.id === newRefs[i].id) {
              ref.title = newRefs[i].title;
              somethingFound.push(i);
            }
          }
        });
        for (let i = 0; i < somethingFound.length; i += 1) {
          newRefs.splice(somethingFound[i], 1);
        }
        refs = refs.concat(newRefs);
        fs.outputFileAsync(`${home}/.mr/refs.md`, refs.map(item => `[${item.title}](${item.id})`).join(os.EOL), { encoding: 'utf8'})
          .then(() => {
            resolve();
          });
      })
      .catch(() => {
        fs.outputFileAsync(`${home}/.mr/refs.md`, index.map(item => `[${item.title}](${item.id})`).join(os.EOL), { encoding: 'utf8'})
          .then(() => {
            resolve();
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
  });
}

function refsList(home = '.') {
  return new Promise((resolve) => {
    fs.readFileAsync(`${home}/.mr/refs.md`, 'utf-8')
      .then((text) => {
        const list = text
          .split(/(\r\n|\n)/g)
          .map(line => line.trim())
          .filter(line => line)
          .map(parseLine);
        resolve(list);
      })
      .catch(() => {
        resolve([]);
      });
  });
}

function refsStringify(home = '.') {
  return refsList(home).then(list => list.map(stringifyRef).join(os.EOL));
}

function refsGet(home = '.') {
  //
  console.log(home)
}

module.exports = {
  update: refsUpdate,
  list: refsList,
  stringify: refsStringify,
  get: refsGet,
};
