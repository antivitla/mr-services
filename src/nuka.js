#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const moment = require('moment');
const os = require('os');
const fs = require('fs-extra-promise');
const glob = require('globby');
const prompt = require('prompt-promise');
const util = require('util');
const marked = require('marked');
const TerminalRenderer = require('marked-terminal');

const read = require('./read/read');
const options = require('./options/options');
const refs = require('./refs/refs');
const get = require('./get/get');
const TreeNode = require('./tree/tree').node;
const dialog = require('./dialog/dialog');

const nuka = require('./nuka/nuka');
const md = require('./md/md');
const Content = require('./content/content');
const db = require('./db/db');

// Init
moment.locale('ru');
marked.setOptions({
  // Define custom renderer
  renderer: new TerminalRenderer()
});

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
    const result = JSON.stringify(NukaOptions, null, '  ');
    process.stdout.write(chalk.gray(`${os.EOL}${result}${os.EOL}`));
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
      md.parse(note)
      .then(index => dialog.save(index, NukaOptions.home));
    } else if (file && file !== true) {
      // Добавляем файл(ы)
      nuka.addFile(file, NukaOptions);
    } else if (tree && tree !== true) {
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
  .option('-f, --file [pattern]')
  .action(({ session = false, file }) => {
    let path = '.archive';
    const pattern = (file && file !== true) ? file : '**/*.*';
    if (session) {
      const date = moment().format('YYYY-MM-DD');
      path += `/Session ${date}/`;
    }
    glob([pattern, '!**/node_modules/**', '!**/bower_components/**'])
      .then((filelist) => {
        filelist.forEach((fileitem) => {
          fs.move(fileitem, path + fileitem, { overwrite: true });
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

// Start
program
  .command('start')
  .option('-n, --node [node]', 'Start node')
  .action(({ node } = {}) => {
    // Создать новый узел (файл)
    if (node && node !== true) {
      const filename = `${node}.md`;
      fs.outputFileAsync(filename, '')
      .then(() => {
        console.log(chalk.gray(`${os.EOL}Создан файл '${filename}'`));
      })
      .catch((error) => {
        console.log(chalk.red(error));
      });
    }
  });

// Save
program
.command('save')
.option('-t, --tree [pattern]', 'Сохранить дерево файлов по маске')
.option('-n, --node [pattern]', 'Сохранить узлы заметок-файлов по маске')
.option('-c, --content [pattern]', 'Сохранить сами заметки в файлах по маске')
.option('-e, --editor [text]', 'Сохранить заметки через редактор')
.option('-s, --nosave', 'Не сохранять в базу')
.option('-r, --noreplace', 'Не перезаписывать исходные файлы')
.option('-i, --silent', 'Без подтверждений')
.option('-x, --expand', 'Экспорт деревьев и узлов красиво и без скрытых комментов')
.option('-o, --stdout', 'Вывод результата на экран или в файл (с помощью символа перенаправления вывода ОС)')
.option('-b, --build', 'Строим дерево файлов по карте')
.action(({ tree, node, content, editor, nosave, noreplace, silent, expand, stdout } = {}) => {
  // Сохраняем заметки
  if (content) {
    // Добавляем заметки из файлов по маске
    nuka.readContent(content, { home: '.' })
    .then((contentList) => {
      console.log(contentList.length);
      // 1. сохраняем эти заметки в базу
      // 2. перезаписываем ли мы исходные файлы?
    })
    .catch((error) => {
      if (error === '404') {
        // Если файлов с таким названием не найдено,
        // просто сохраняем этот текст как новую заметку
      } else {
        console.red(error);
      }
    });
  }
  // Через редактор
  if (editor) {
    nuka.readEditor(editor !== true ? editor : '', { home: '.' })
    .then((contentList) => {
      console.log(contentList);
      // 1. сохраняем эту заметку в базу
    })
    .catch((error) => {
      if (error) {
        console.red(error);
      }
    });
  }
  // Сохраняем дерево файлов
  if (tree) {
    nuka.readTree(tree, { home: '.' })
    .then((treeObject) => {
      console.log(treeObject);
      // 1. сохраняем эти заметки в базу
      // 2. перезаписываем ли мы исходные файлы?
    })
    .catch((error) => {
      if (error === '404') {
        console.log(chalk.gray(`${os.EOL}Не найдено узлов по маске '${nuka.safePattern(tree)}'${os.EOL}`));
      } else {
        console.red(error);
      }
    });
  }
  // Сохраняем узлы
  if (node) {
    nuka.readNode(node, { home: '.' })
    .then((nodeList) => {
      console.log(nodeList);
      // 1. сохраняем эти заметки в базу
      // 2. перезаписываем ли мы исходные файлы?
    })
    .catch((error) => {
      if (error === '404') {
        console.log(chalk.gray(`${os.EOL}Не найдено узлов по маске '${nuka.safePattern(node)}'${os.EOL}`));
      } else {
        console.red(error);
      }
    });
  }
});

// Parse command line arguments
program.parse(process.argv);

// Show help if no command supplied
if (!process.argv.slice(2).length) {
  program.help(text => chalk.gray(text));
}
