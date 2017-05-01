#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const save = require('./save/save');
const prompt = require('prompt-promise');
const moment = require('moment');
const os = require('os');
const read = require('./read/read');
const fs = require('fs-extra-promise');
// const util = require('util');
const options = require('./options/options');
const glob = require('globby');
const async = require('async');
const uuid = require('node-uuid');
const refs = require('./refs/refs');

const get = require('./get/get');
const md = require('./markdown/markdown');
const TreeNode = require('./tree/tree').node;

// Init
moment.locale('ru');

// Load options
const NukaOptions = options('mr.json');


// Save notes dialog
function saveDialog(index, home = NukaOptions.home) {
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

// Choose title dialog
function chooseTitleDialog(title, msg) {
  return new Promise((resolve, reject) => {
    prompt(msg + chalk.gray('Y/n/впиши название '))
      .then((answer) => {
        prompt.done();
        const a = answer.toLowerCase();
        if (!a || a === 'y' || a === 'yes') {
          resolve(title);
        } else if (a === 'n' || a === 'no') {
          reject();
        } else {
          resolve(answer.trim());
        }
      });
  });
}

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

function asyncParseFiles({ pattern = '**/*.md', onFileIndexCallback } = {}) {
  return new Promise((resolve, reject) => {
    glob([pattern, '!**/node_modules/**', '!**/bower_components/**'])
      .then((files) => {
        async.eachSeries(files, (filename, callback) => {
          // Читаем и парсим файл
          read.file(filename)
            .then((text) => {
              const context = {};
              // Берём дату для контекста
              const stat = fs.statSync(filename);
              context.date = moment(stat.birthtime || stat.ctime).toISOString();
              // Парсим заметки с контекстом
              return md.parse(text, { contextObject: context });
            })
            .then((index) => {
              if (onFileIndexCallback) {
                onFileIndexCallback(filename, index, callback);
              } else {
                callback();
              }
            });
        }, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
  });
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
      md.parse(note).then(index => saveDialog(index, NukaOptions.home));
    } else if (file) {
      // Хотим добавить файл(ы) с заметками
      asyncParseFiles({
        pattern: file,
        onFileIndexCallback(filename, index, callback) {
          // Сохраняем заметки
          saveDialog(index, NukaOptions.home)
            .then(() => {
              // Если надо, создаём соотв. структуру
              const suggestTitle = filename.replace('.md', '').split('/').pop();
              const msg = chalk.yellow(`${os.EOL}Для заметок файла '${filename}' создаём структуру c именем '${suggestTitle}'`) + os.EOL;
              chooseTitleDialog(suggestTitle, msg)
                .then((title) => {
                  const contentTree = new TreeNode({
                    title,
                    index,
                    date: new Date(),
                    id: uuid.v1(),
                  });
                  saveDialog([contentTree], NukaOptions.home)
                    .then(() => {
                      // Сохраняем ссылку
                      refs.update([{
                        title: contentTree.title,
                        id: contentTree.id,
                      }], NukaOptions.home);
                      callback();
                    });
                })
                .catch((error) => {
                  if (error) {
                    console.log(chalk.red(error));
                  }
                  callback();
                });
            });
        },
      });
    } else if (tree) {
      // Исходный список узлов дерева
      const list = [];
      // Собираем файлы с заметками
      asyncParseFiles({
        pattern: tree,
        onFileIndexCallback(filename, index, callback) {
          // Собираем данные для построения узлов дерева
          const suggestTitle = filename.replace('.md', '').split('/').pop();
          const msg = chalk.yellow(`${os.EOL}Для файла '${filename}'${os.EOL}создаём узел c именем '${suggestTitle}'`) + os.EOL;
          chooseTitleDialog(suggestTitle, msg)
            .then((title) => {
              // Формируем элемент списка узла
              const path = filename.replace('.md', '').split('/');
              path[path.length - 1] = title;
              list.push({
                path: path.join('/'),
                index: index.map(item => ({
                  id: item.id,
                  title: (item.title ? item.title : item.excerpt),
                })),
              });
              // Сохраняем заметки в базу
              saveDialog(index, NukaOptions.home)
                .then(() => callback())
                .catch((error) => {
                  console.log(chalk.red(error));
                  callback();
                });
            })
            .catch((error) => {
              if (error) {
                console.log(chalk.red(error));
              }
              callback();
            });
        },
      })
      .then(() => {
        // Название общей структуры спрашиваем
        const suggestTitle = NukaOptions.title || 'Новая структура';
        const msg = chalk.bgCyan.white(`${os.EOL}Название всей этой структуры '${suggestTitle}'`) + os.EOL;
        chooseTitleDialog(suggestTitle, msg)
          .then((title) => {
            // Делаем дерево структуры
            const contentTree = new TreeNode({ title, date: new Date(), id: uuid.v1() });
            list.forEach((item) => {
              contentTree.addChild(item.path.split('/'), item.index);
            });
            // Сохраняем структуру в базу
            return saveDialog([contentTree], NukaOptions.home)
              .then(() => {
                // Сохраняем ссылку на структуру
                refs.update([{
                  id: contentTree.id,
                  title: contentTree.title,
                }], NukaOptions.home);
              })
              .catch((error) => {
                if (error) {
                  console.log(chalk.red(error));
                }
              });
          })
          .catch(() => {
            if (error) {
              console.log(chalk.red(error));
            }
          });
      });
    } else {
      // Или из редактора
      read.editor('')
        .then(text => md.parse(text))
        .then(index => saveDialog(index, NukaOptions.home));
    }
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
