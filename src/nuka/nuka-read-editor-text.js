const os = require('os');
const fs = require('fs-extra-promise');
const spawn = require('child_process').spawn;
const tempfile = require('tempfile');
const detect = require('jschardet').detect;
const iconv = require('iconv-lite');

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

function readEditorText(initial) {
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

        let dataEncoding = detect(data).encoding;
        if (!dataEncoding || !encoding[dataEncoding]) {
          dataEncoding = process.platform.match(/win/) ? 'win1251' : 'utf8';
        }
        const decoded = iconv.decode(data, dataEncoding);
        resolve(decoded);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

module.exports = readEditorText;
