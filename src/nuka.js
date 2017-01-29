#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const md = require('./markdown/markdown');
const save = require('./save/save');
const prompt = require('prompt-promise');
const moment = require('moment');
const os = require('os');
const read = require('./read/read');
// const util = require('util');
// const glob = require('glob');
// const fs = require('fs-extra-promise');
// const get = require('./get/get');
// const glob = require('./glob/glob-promise');

// Init
moment.locale('ru');

// Save notes dialog
function saveDialog(index) {
  index.forEach((item) => {
    console.log(`${os.EOL}${chalk.gray('Текст заметки:')} ${chalk.white(item.content)}`);
    console.log(`${chalk.gray('Дата заметки:')} ${chalk.cyan(moment(item.date).format('LL'))}${os.EOL}`);
  });
  prompt('Сохранить (Y/n) ')
    .then((answer) => {
      prompt.done();
      return new Promise((resolve, reject) => {
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
          resolve();
        } else {
          reject();
        }
      });
    })
    .then(() => save(index))
    .then(() => {
      console.log(chalk.yellow('\r\nSaved!\r\n'));
    })
    .catch(() => {
      console.log(chalk.gray('\r\nNot saved!\r\n'));
    });
}

// Usage
program
  .version('0.0.1')
  .usage('<command> [options]');

// Add note(s) from command line or editor
program
  .command('add')
  .option('-n, --note [text]', 'Short note')
  .action(({ note = '' } = {}) => {
    if (note && note.length) {
      // Мы хотим добавить что-то прямо из командной строки
      md.parse(note).then(index => saveDialog(index));
    } else {
      // Или из редактора
      read.editor('')
        .then(text => md.parse(text))
        .then(index => saveDialog(index));
    }
  });

// Parse command line arguments
program.parse(process.argv);

// Show help if no command supplied
if (!process.argv.slice(2).length) {
  program.help(text => chalk.gray(text));
}