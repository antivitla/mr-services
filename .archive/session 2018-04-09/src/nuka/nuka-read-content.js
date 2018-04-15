const chalk = require('chalk');
const fs = require('fs-extra-promise');
const dialog = require('../dialog/dialog');
const md = require('../md/md');
const readFiles = require('./nuka-read-files');

function readContent(pattern, { noreplace, silent }) {
  // Список контент-объектов
  let contentList = [];
  // По каждому файлу из списка
  return readFiles(pattern, (filename, data, nextFile) => {
    // Парсим текст в контент-объекты
    let pipe = md.parse(data.text, { date: data.date });
    // Утверждаем у пользователя список контент-объектов
    if (!silent) {
      pipe = pipe.then(index => dialog.confirmContentList(index));
    }
    // Перезаписываем исходные файлы
    if (!noreplace) {
      pipe = pipe.then((confirmedIndex) => {
        fs.outputFileAsync(filename, md.stringify(confirmedIndex));
        return confirmedIndex;
      });
    }
    // Сохраним список и переходим к следующему файлу
    pipe.then((confirmedIndex) => {
      contentList = contentList.concat(confirmedIndex);
      nextFile();
    })
    .catch((error) => {
      if (error) console.log(chalk.red(error));
      nextFile();
    });
  })
  // Отдаём список контент-объектов
  .then(() => contentList);
}

module.exports = readContent;
