const os = require('os');
const fs = require('fs-extra-promise');
const spawn = require('child_process').spawn;
const tempfile = require('tempfile');
const detect = require('jschardet').detect;
const iconv = require('iconv-lite');
const chalk = require('chalk');

function renderReadProgress(text) {
  console.log(chalk.gray('Read:'),
    chalk.green(text.length),
    chalk.gray('bytes'));
}

function editorPromise(command, filename) {
  return new Promise((resolve, reject) => {
    spawn(command, [filename], { stdio: 'inherit' })
      .on('close', (error) => {
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      });
  });
}

function input(initial, { showProgress = false } = {}) {
  const editorCommand = os.platform().match(/win/g) ? 'notepad' : 'nano';
  const editFile = tempfile('.md');
  return new Promise((resolve, reject) => {
    // create file
    fs.outputFileAsync(editFile, initial || '', { encoding: 'utf8' })
      .then(() => editorPromise(editorCommand, editFile))
      .then(() => fs.readFileAsync(editFile))
      .then((data) => {
        const encoding = {
          'ascii': 'cp866',
          'UTF-8': 'utf8',
          'windows-1251': 'win1251',
        };
        const decoded = iconv.decode(data, encoding[detect(data).encoding]);
        if (showProgress) {
          renderReadProgress(decoded);
        }
        resolve(decoded);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function file(filename, { showProgress = false } = {}) {
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

module.exports = { input, file };
