const chalk = require('chalk');
const moment = require('moment');
const prompt = require('prompt-promise');
const os = require('os');
const md = require('../md/md');
const save = require('../save/save');

function saveDialog(index, home = '.') {
  return new Promise((resolveMain) => {
    index.forEach((item) => {
      const text = item.type === 'tree' ? md.stringify(item) : item.content;
      console.log(`${os.EOL}${chalk.gray('Текст:')} ${chalk.white(text)}`);
      console.log(`${chalk.gray('Дата:')} ${chalk.cyan(moment(item.date).format('LL'))}${os.EOL}`);
    });
    prompt(`Сохранить в ${home}? (Y/n) `)
      .then((answer) => {
        prompt.done();
        return new Promise((resolve, reject) => {
          if (answer.toLowerCase() === 'n' || answer.toLowerCase() === 'no') {
            reject();
          } else {
            resolve();
          }
        });
      })
      .then(() => save(index, home))
      .then(() => {
        console.log(chalk.yellow(`${os.EOL}Сохранено в ${home}${os.EOL}`));
        resolveMain();
      })
      .catch((error) => {
        if (!error) {
          console.log(chalk.gray(`${os.EOL}Не сохранено${os.EOL}`));
        } else {
          console.log(chalk.red(error));
        }
        resolveMain();
      });
  });
}

module.exports = saveDialog;
