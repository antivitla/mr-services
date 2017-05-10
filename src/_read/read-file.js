const fs = require('fs-extra-promise');
const chalk = require('chalk');

function renderReadProgress(text) {
  console.log(chalk.gray('Read:'),
    chalk.green(text.length),
    chalk.gray('bytes'));
}

function readFile(filename, { showProgress = false, sync = false } = {}) {
  if (sync) {
    return fs.readFileSync(filename, { encoding: 'utf8' });
  }
  return new Promise((resolve, reject) => {
    fs.readFileAsync(filename)
      .then((text) => {
        if (showProgress) {
          renderReadProgress(text);
        }
        resolve(text);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

module.exports = readFile;
