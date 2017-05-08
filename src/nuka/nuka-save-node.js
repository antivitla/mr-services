const fs = require('fs');
const chalk = require('chalk');
const os = require('os');
const Content = require('../content/content');
const db = require('../db/db');
const dialog = require('../dialog/dialog');
const md = require('../md/md');
const readFiles = require('./nuka-read-files');

function saveNode(pattern) {
  readFiles(pattern, (filename, data, callback) => {
    // Парсим текст в контент-объекты
    md.parse(data.text, { date: data.date })
    .then((index) => {
      // Конструируем контент-узел
      const contentObject = new Content({ type: 'tree' });
      if (index[0].type === 'tree') {
        // Если первый объект это узел,
        // то считаем его содержанием дальнейших заметок,
        // и удаляем из списка
        Object.assign(contentObject, index.shift());
      } else {
        // если нет, берём в качестве заголовка имя файла
        contentObject.title = filename.split('/').slice(-1)[0].replace(/\.md$/, '');
      }
      // Сохраняем содержание
      contentObject.index = index.slice(0);
      // Дата
      contentObject.date = contentObject.index ? contentObject.index[0].date : data.date;
      // Возвращаем
      return contentObject;
    })
    // Утверждаем у пользователя имя узла и его контент
    .then(contentObject => new Promise((resolve) => {
      console.log(dialog.stringify(contentObject));
      dialog.falseConfirm(`Изменить название '${contentObject.title}'?`, 'вписать')
      .then((title) => {
        resolve(Object.assign(contentObject, { title }));
      })
      .catch(() => {
        resolve(contentObject);
      });
    }))
    // Сохраняем узел в базу
    .then((contentObject) => {
      const index = [contentObject].concat(contentObject.index);
      index.forEach((item) => {
        db.write({ id: item.id, text: md.stringify([item]) }, { home: '.' });
      });
      return contentObject;
    })
    // Перезаписываем исходный файл пользователя
    .then((contentObject) => {
      const index = contentObject.index;
      const text = md.stringify([contentObject].concat(index));
      return fs.outputFileAsync(filename, text);
    })
    // Сигнализируем завершение
    .then(() => callback());
  })
  .catch((error) => {
    if (error === '404') {
      console.log(chalk.gray(`${os.EOL}Не найдено файлов ${pattern}${os.EOL}`));
    }
  });
}

module.exports = saveNode;
