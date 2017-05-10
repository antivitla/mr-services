#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const moment = require('moment');
const os = require('os');
// const fs = require('fs-extra-promise');
// const glob = require('globby');
// const prompt = require('prompt-promise');
// const util = require('util');
// const marked = require('marked');
// const TerminalRenderer = require('marked-terminal');

// const read = require('./read/read');
// const options = require('./options/options');
// const refs = require('./refs/refs');
// const get = require('./get/get');
// const TreeNode = require('./tree/tree').node;

const Content = require('./content/content');
const dialog = require('./dialog/dialog');
const nuka = require('./nuka/nuka');
const options = require('./options/options')('mr.json');

// Init
moment.locale('ru');
// marked.setOptions({
//   // Define custom renderer
//   renderer: new TerminalRenderer(),
// });

// // Index by Date
// function byDate(notes, dir) {
//   const index = notes.slice(0);
//   index.sort((a, b) => {
//     let diff = (dir === 'dsc' ? (moment(b.date) - moment(a.date)) : (moment(a.date) - moment(b.date)));
//     if (!diff) {
//       diff = (dir === 'dsc' && a.id < b.id) || (dir === 'asc' && a.id > b.id) ? 1 : -1;
//     }
//     return diff;
//   });
//   return index;
// }

// // Index by session
// function bySession(notes, days, dir) {
//   const indexByDate = byDate(notes, dir);
//   const index = [];
//   index.push([]);
//   index[index.length - 1].push(indexByDate.shift());
//   while (indexByDate.length) {
//     const dateA = indexByDate[0].date;
//     const dateB = index[index.length - 1][index[index.length - 1].length - 1].date;
//     const diff = moment(dateA) - moment(dateB);
//     if (Math.abs(diff) > days * 24 * 60 * 60 * 1000) {
//       index.push([]);
//     }
//     index[index.length - 1].push(indexByDate.shift());
//   }
//   return index;
// }


// Usage
program
  .version('0.0.1')
  .usage('<command> [options]');

// // Get
// program
//   .command('get <what>')
//   .option('-c, --clean', 'Clean texts without JSON properties')
//   .option('-a, --all', 'Get everything, unordered')
//   .option('-q, --query [str]', 'Search everything by query string')
//   .option('-i, --id [id]', 'Get by id')
//   .option('-r, --ref [title]', 'Set reference title')
//   .action((what, { clean = false, all = false, query, id, ref } = {}) => {
//     if (!what) {
//       console.log(chalk.grey(`${os.EOL}А что именно get?${os.EOL}`));
//     } else if (what === 'content') {
//       if (id) {
//         // Ищем по айди
//         get({ home: NukaOptions.home, id }).then((index) => {
//           process.stdout.write(md.stringify(index, { clean }));
//         });
//       } else if (ref && ref !== true) {
//         // Ищем по ссылке
//         refs.list(NukaOptions.home).then((list) => {
//           const foundRef = list.find(item => item.title === ref);
//           if (foundRef) {
//             get({ home: NukaOptions.home, id: foundRef.id })
//               .then((index) => {
//                 process.stdout.write(md.stringify(index, { clean }));
//               });
//           } else {
//             console.log(chalk.grey(`${os.EOL}Не найдена ссылка ${ref} в ${NukaOptions.home}${os.EOL}`));
//           }
//         });
//       } else {
//         get({ home: NukaOptions.home }).then((contentIndex) => {
//           if (contentIndex.length) {
//             let filteredContentIndex = [];
//             if (all) {
//               // Все заметки
//               filteredContentIndex = contentIndex;
//             } else if (query) {
//               // Поиск заметки по строке
//               const queries = query.toLowerCase().split(',').map(q => q.trim());
//               filteredContentIndex = contentIndex.filter(item => queries.find((q) => {
//                 const titleFound = item.title ? item.title.toLowerCase().match(q) : false;
//                 const contentFound = item.content ? item.content.toLowerCase().match(q) : false;
//                 return titleFound || contentFound;
//               }));
//             } else {
//               console.log(chalk.grey(`${os.EOL}Не заданы параметры поиска в ${NukaOptions.home}${os.EOL}`));
//             }
//             // Вывод заметок
//             if (filteredContentIndex.length) {
//               filteredContentIndex.sort((a, b) => moment(a.date) - moment(b.date));
//               process.stdout.write(md.stringify(filteredContentIndex, { clean }));
//             }
//           } else {
//             console.log(chalk.grey(`${os.EOL}Пустая база данных в ${NukaOptions.home}${os.EOL}`));
//           }
//         });
//       }
//     } else if (what === 'refs') {
//       refs.list(NukaOptions.home).then((list) => {
//         const result = list
//           .map(refItem => chalk.yellow(`${refItem.title}: `) + chalk.gray(refItem.id))
//           .join(os.EOL);
//         console.log(os.EOL + result + os.EOL);
//       });
//     }
//   });

// // Index
// program
//   .command('index [how]')
//   .action((how) => {
//     const query = how.split(', ');
//     get().then((notes) => {
//       const dir = query[0].match(/dsc/) ? 'dsc' : 'asc';
//       let index;
//       // by date
//       if (query[0].match(/by date/)) {
//         index = byDate(notes, dir);
//         process.stdout.write(md.stringify(index));
//       }
//       // by session
//       if (query[0].match(/by session/)) {
//         let days = 5;
//         if (query[0].match(/\d+/)) {
//           days = parseInt(query[0].match(/\d+/)[0], 10);
//         }
//         index = bySession(notes, days, dir);
//         for (let i = 0; i < index.length; i += 1) {
//           process.stdout.write(md.stringify(index[i]));
//           process.stdout.write('\n\n\n\n\n\n\n\n\n\n----------------------------------\n\n\n\n\n\n\n\n\n\n');
//         }
//       }
//     });
//   });

// // Archive
// program
//   .command('archive')
//   .option('-s, --session', 'Arhive to session dated today')
//   .option('-f, --file [pattern]')
//   .action(({ session = false, file }) => {
//     let path = '.archive';
//     const pattern = (file && file !== true) ? file : '**/*.*';
//     if (session) {
//       const date = moment().format('YYYY-MM-DD');
//       path += `/Session ${date}/`;
//     }
//     glob([pattern, '!**/node_modules/**', '!**/bower_components/**'])
//       .then((filelist) => {
//         filelist.forEach((fileitem) => {
//           fs.move(fileitem, path + fileitem, { overwrite: true });
//         });
//       });
//   });

// // Delete
// program
//   .command('delete [id]')
//   .action((id) => {
//     fs.readFileAsync(`.mr/content/${id.slice(0, 2)}/${id.slice(2)}.md`)
//       .then((content) => {
//         console.log(chalk.grey(`${os.EOL}${content}${os.EOL}`));
//         return prompt('Delete this? (y/N)');
//       })
//       .then((answer) => {
//         prompt.done();
//         if (answer && answer.toLowerCase() === 'y') {
//           fs.removeAsync(`.mr/content/${id.slice(0, 2)}/${id.slice(2)}.md`)
//             .then(() => {
//               console.log(chalk.gray(`${os.EOL}Deleted ${id}${os.EOL}`));
//             });
//         }
//       });
//   });

// // Start
// program
//   .command('start')
//   .option('-n, --node [node]', 'Start node')
//   .action(({ node } = {}) => {
//     // Создать новый узел (файл)
//     if (node && node !== true) {
//       const filename = `${node}.md`;
//       fs.outputFileAsync(filename, '')
//       .then(() => {
//         console.log(chalk.gray(`${os.EOL}Создан файл '${filename}'`));
//       })
//       .catch((error) => {
//         console.log(chalk.red(error));
//       });
//     }
//   });

// Проверить опции
program
  .command('options')
  .action(() => {
    const result = JSON.stringify(options, null, '  ');
    console.log(chalk.gray(`${os.EOL}${result}${os.EOL}`));
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
.option('-j, --nojson', 'Не выводить комментарии с JSON-объектом')
.option('-l, --silent', 'Без подтверждений')
.option('-x, --expand', 'Экспорт деревьев и узлов красиво')
.option('-o, --stdout', 'Вывод результата на экран или в файл (с помощью символа перенаправления вывода ОС)')
.option('-b, --build', 'Строим дерево файлов по карте')
.option('-f, --format [format]', 'Формат вывода пользователю')
.option('-d, --stdin', 'Передаём управление стандартным потокам')
.action(({ tree, node, content, editor, nosave, noreplace, nojson, silent, expand, stdout, format } = {}) => {
  // Готовим словарь ошибок
  function errorVocabulary(pattern) {
    return [{
      code: '404',
      message: `Не найдено узлов по маске '${pattern}'`,
    }];
  }
  // Сохраняем заметки через редактор
  if (editor) {
    nuka.readEditor(editor !== true ? editor : '', { silent })
      .then(nuka.pipeSave({ skip: nosave, home: '.' }))
      .then(nuka.pipeStdout({ skip: !stdout, nojson, expand, format }))
      .catch(nuka.pipeError());
  }
  // Сохраняем заметки из файлов
  if (content) {
    // Добавляем заметки из файлов по маске,
    // опционально опуская подтверждения
    // и перезаписывая исходные файлы
    nuka.readContent(content, { noreplace, silent: silent || stdout })
      .then(nuka.pipeSave({ skip: nosave, home: '.' }))
      .then(nuka.pipeStdout({ skip: !stdout, nojson, expand, format }))
      .catch((error) => {
        if (error === '404') {
          // Если файлов с таким названием не найдено
          // (Выдаём ошибку)
          nuka.pipeError(errorVocabulary(nuka.safePattern(content)))('404');
          // и сохраняем этот текст как новую заметку
          dialog.confirmContentList([new Content({ text: content })])
            .then(nuka.pipeSave({ skip: nosave, home: '.' }))
            .then(nuka.pipeStdout({ skip: !stdout, nojson, expand, format }))
            .catch(nuka.pipeError());
        } else {
          nuka.pipeError()(error);
        }
      });
  }
  // Сохраняем узлы-файлы
  if (node) {
    // Считаываем узлы-файлы с заметками,
    // опционально опуская подтверждения
    // и перезаписывая исходные файлы
    nuka.readNode(node, { noreplace, silent: silent || stdout })
      .then(nuka.pipeSave({ skip: nosave, home: '.' }))
      .then(nuka.pipeStdout({ skip: !stdout, nojson, expand, format }))
      // Ловим ошибки
      .catch(nuka.pipeError(errorVocabulary(nuka.safePattern(node))));
  }
  // Сохраняем дерево файлов
  if (tree) {
    // Считаываем дерево файлов с заметками,
    // опционально опуская подтверждения
    // и перезаписывая исходные файлы
    nuka.readTree(tree, { noreplace, silent: silent || stdout })
      // Сохраняем если надо
      .then(nuka.pipeSave({ skip: nosave, home: '.' }))
      // Выводим пользователю что получилось, если надо
      .then(nuka.pipeStdout({ skip: !stdout, nojson, expand, format }))
      // Ловим ошибки
      .catch(nuka.pipeError(errorVocabulary(nuka.safePattern(node))));
  }
});

// Parse command line arguments
program.parse(process.argv);

// Show help if no command supplied
if (!process.argv.slice(2).length) {
  program.help(text => chalk.gray(text));
}
