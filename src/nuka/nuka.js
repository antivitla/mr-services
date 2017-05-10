const chalk = require('chalk');
const os = require('os');
const fileDate = require('./nuka-file-date');
const safePattern = require('./nuka-safe-pattern');
const readFiles = require('./nuka-read-files');
const readEditor = require('./nuka-read-editor');
const readContent = require('./nuka-read-content');
const readNode = require('./nuka-read-node');
const readTree = require('./nuka-read-tree');
const stdout = require('./nuka-stdout');
const db = require('../db/db');
const md = require('../md/md');

function pipeSave({ skip, home } = {}) {
  return function (index) {
    if (!skip) {
      let list = [];
      index.forEach((item) => {
        list = list.concat(item.flatten())
      });
      list.forEach(item => db.write({
        id: item.id,
        text: md.stringify(item),
      }, { home }));
    }
    return index;
  };
}

function pipeStdout({ skip, nojson, expand } = {}) {
  return function (index) {
    if (!skip) stdout(index, { nojson, expand });
    return index;
  };
}

function pipeError(vocabulary) {
  return function (error) {
    let msg = chalk.red(error);
    if (vocabulary) {
      const codes = vocabulary.map(item => String(item.code).toLowerCase());
      const messages = vocabulary.map(item => item.message);
      const found = messages[codes.indexOf(String(error).toLowerCase())];
      if (found) {
        msg = os.EOL + chalk.gray(found) + os.EOL;
      }
    }
    console.log(msg);
  };
}

module.exports = {
  fileDate,
  safePattern,
  readFiles,
  readEditor,
  readContent,
  readNode,
  readTree,
  stdout,
  pipeSave,
  pipeStdout,
  pipeError,
};
