#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const moment = require('moment');
const os = require('os');
const fs = require('fs-extra-promise');
const glob = require('globby');
// const uuid = require('node-uuid');
// const prompt = require('prompt-promise');
// const util = require('util');
// const async = require('async');
// const asyncParseFiles = require('./async-parse-files');
const read = require('./read/read');
const options = require('./options/options');
const refs = require('./refs/refs');
const get = require('./get/get');
const md = require('./markdown/markdown');
const TreeNode = require('./tree/tree').node;
const dialog = require('./dialog/dialog');
const nuka = require('./nuka-commands/nuka-commands');

// Init
moment.locale('ru');

// Load options
const NukaOptions = options('mr.json');

// Index by Date
function byDate(notes, dir) {
  const index = notes.slice(0);
  index.sort((a, b) => {
    let diff = (dir === 'dsc' ? (moment(b.date) - moment(a.date)) : (moment(a.date) - moment(b.date)));
    if (!diff) {
      diff = (dir === 'dsc' && a.id < b.id) || (dir === 'asc' && a.id > b.id) ? 1 : -1;
    }
    return diff;
  });
  return index;
}

// Index by session
function bySession(notes, days, dir) {
  const indexByDate = byDate(notes, dir);
  const index = [];
  index.push([]);
  index[index.length - 1].push(indexByDate.shift());
  while (indexByDate.length) {
    const dateA = indexByDate[0].date;
    const dateB = index[index.length - 1][index[index.length - 1].length - 1].date;
    const diff = moment(dateA) - moment(dateB);
    if (Math.abs(diff) > days * 24 * 60 * 60 * 1000) {
      index.push([]);
    }
    index[index.length - 1].push(indexByDate.shift());
  }
  return index;
}

// Usage
program
  .version('0.0.1')
  .usage('<command> [options]');

// Check options
program
  .command('options')
  .action(() => {
    process.stdout.write(chalk.gray(`${os.EOL}${JSON.stringify(NukaOptions, null, '  ')}${os.EOL}`));
  });

// Add
program
  .command('add')
  .option('-n, --note [text]', 'Short note')
  .option('-f, --file [pattern]', 'Notes from files')
  .option('-t, --tree [pattern]', 'Create index tree structure from files')
  .action(({ note = '', file = '', tree = '' } = {}) => {
    if (note && note.length) {
      // Мы хотим добавить что-то прямо из командной строки
      md.parse(note).then(index => dialog.save(index, NukaOptions.home));
    } else if (file) {
      // Добавляем файл(ы)
      nuka.addFiles(file, NukaOptions);
    } else if (tree) {
      // Строим структуру
      nuka.addTree(tree, NukaOptions);
    } else {
      // Или из редактора
      read.editor('')
        .then(text => md.parse(text))
        .then(index => dialog.save(index, NukaOptions.home));
    }
  });

// Get
program
  .command('get <what>')
  .option('-c, --clean', 'Clean texts without JSON properties')
  .option('-a, --all', 'Get everything, unordered')
  .option('-q, --query [str]', 'Search everything by query string')
  .option('-i, --id [id]', 'Get by id')
  .option('-r, --ref [title]', 'Set reference title')
  .action((what, { clean = false, all = false, query, id, ref } = {}) => {
    if (!what) {
      console.log(chalk.grey(`${os.EOL}А что именно get?${os.EOL}`));
    } else if (what === 'content') {
      if (id) {
        // Ищем по айди
        get({ home: NukaOptions.home, id }).then((index) => {
          process.stdout.write(md.stringify(index, { clean }));
        });
      } else if (ref && ref !== true) {
        // Ищем по ссылке
        refs.list(NukaOptions.home).then((list) => {
          const foundRef = list.find(item => item.title === ref);
          if (foundRef) {
            get({ home: NukaOptions.home, id: foundRef.id })
              .then((index) => {
                process.stdout.write(md.stringify(index, { clean }));
              });
          } else {
            console.log(chalk.grey(`${os.EOL}Не найдена ссылка ${ref} в ${NukaOptions.home}${os.EOL}`));
          }
        });
      } else {
        get({ home: NukaOptions.home }).then((contentIndex) => {
          if (contentIndex.length) {
            let filteredContentIndex = [];
            if (all) {
              // Все заметки
              filteredContentIndex = contentIndex;
            } else if (query) {
              // Поиск заметки по строке
              const queries = query.toLowerCase().split(',').map(q => q.trim());
              filteredContentIndex = contentIndex.filter(item => queries.find((q) => {
                const titleFound = item.title ? item.title.toLowerCase().match(q) : false;
                const contentFound = item.content ? item.content.toLowerCase().match(q) : false;
                return titleFound || contentFound;
              }));
            } else {
              console.log(chalk.grey(`${os.EOL}Не заданы параметры поиска в ${NukaOptions.home}${os.EOL}`));
            }
            // Вывод заметок
            if (filteredContentIndex.length) {
              filteredContentIndex.sort((a, b) => moment(a.date) - moment(b.date));
              process.stdout.write(md.stringify(filteredContentIndex, { clean }));
            }
          } else {
            console.log(chalk.grey(`${os.EOL}Пустая база данных в ${NukaOptions.home}${os.EOL}`));
          }
        });
      }
    } else if (what === 'refs') {
      refs.list(NukaOptions.home).then((list) => {
        const result = list
          .map(refItem => chalk.yellow(`${refItem.title}: `) + chalk.gray(refItem.id))
          .join(os.EOL);
        console.log(os.EOL + result + os.EOL);
      });
    }
  });

// Index
program
  .command('index [how]')
  .action((how) => {
    const query = how.split(', ');
    get().then((notes) => {
      const dir = query[0].match(/dsc/) ? 'dsc' : 'asc';
      let index;
      // by date
      if (query[0].match(/by date/)) {
        index = byDate(notes, dir);
        process.stdout.write(md.stringify(index));
      }
      // by session
      if (query[0].match(/by session/)) {
        let days = 5;
        if (query[0].match(/\d+/)) {
          days = parseInt(query[0].match(/\d+/)[0], 10);
        }
        index = bySession(notes, days, dir);
        for (let i = 0; i < index.length; i += 1) {
          process.stdout.write(md.stringify(index[i]));
          process.stdout.write('\n\n\n\n\n\n\n\n\n\n----------------------------------\n\n\n\n\n\n\n\n\n\n');
        }
      }
    });
  });

// Checkout
program
  .command('checkout')
  .option('-r, --ref [title]', 'Checkout tree by reference title')
  .option('-i, --id [value]', 'Checkout tree by id')
  .option('-c, --clean', 'Clean texts without JSON properties')
  .action(({ ref = '', id = '', clean = false } = {}) => {
    if (ref) {
      refs.list(NukaOptions.home).then((list) => {
        const refItem = list.find(item => item.title === ref.trim());
        const treeid = refItem ? refItem.id : '';
        if (treeid) {
          get({ home: NukaOptions.home, id: treeid })
            .then((index) => {
              const tree = new TreeNode(index[0]);
              tree.checkout({ home: NukaOptions.home, clean });
            });
        }
      });
    } else if (id) {
      get({ home: NukaOptions.home, id })
        .then((index) => {
          const tree = new TreeNode(index[0]);
          tree.checkout({ home: NukaOptions.home, clean });
        });
    }
  });

// Archive
program
  .command('archive')
  .option('-s, --session', 'Arhive to session dated today')
  .option('-f, --files [files]')
  .action(({ session = false, files }) => {
    let path = '.archive';
    const pattern = (files && files !== true) ? files : '**/*.*';
    if (session) {
      const date = moment().format('YYYY-MM-DD');
      path += `/Session ${date}/`;
    }
    glob([pattern, '!**/node_modules/**', '!**/bower_components/**'])
      .then((files) => {
        files.forEach((file) => {
          fs.move(file, path + file, { overwrite: true });
        });
      });
  });

// Delete
program
  .command('delete [id]')
  .action((id) => {
    fs.readFileAsync(`.mr/content/${id.slice(0, 2)}/${id.slice(2)}.md`)
      .then((content) => {
        console.log(chalk.grey(`${os.EOL}${content}${os.EOL}`));
        return prompt('Delete this? (y/N)');
      })
      .then((answer) => {
        prompt.done();
        if (answer && answer.toLowerCase() === 'y') {
          fs.removeAsync(`.mr/content/${id.slice(0, 2)}/${id.slice(2)}.md`)
            .then(() => {
              console.log(chalk.gray(`${os.EOL}Deleted ${id}${os.EOL}`));
            });
        }
      });
  });

// Parse command line arguments
program.parse(process.argv);

// Show help if no command supplied
if (!process.argv.slice(2).length) {
  program.help(text => chalk.gray(text));
}
