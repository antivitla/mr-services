const chalk = require('chalk');
const Content = require('../content/content');
const dialog = require('../dialog/dialog');
const md = require('../md/md');
const readFiles = require('./nuka-read-files');

function readNode(pattern) {
  // Собираем список узлов
  const nodeList = [];
  // Проходим по каждому файлу из списка
  return readFiles(pattern, (filename, data, nextFile) => {
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
    .then(contentObject => dialog.confirmContentAndTitle(contentObject))
    // // Сохраняем узел и его контент в базу
    // .then((contentObject) => {
    //   const index = [contentObject].concat(contentObject.index);
    //   index.forEach((item) => {
    //     db.write({ id: item.id, text: md.stringify([item]) }, { home });
    //   });
    //   return contentObject;
    // })
    // // Перезаписываем исходный файл пользователя
    // .then((contentObject) => {
    //   const index = contentObject.index;
    //   const text = md.stringify([contentObject].concat(index));
    //   return fs.outputFileAsync(filename, text);
    // })
    // Добавляем узел в список
    .then((contentObject) => {
      nodeList.push(contentObject);
      return true;
    })
    // Сигнализируем завершение
    .then(() => nextFile())
    .catch((error) => {
      if (error) {
        console.log(chalk.red(error));
      }
      nextFile();
    });
  })
  // Отдаём список узлов
  .then(() => nodeList);
}

module.exports = readNode;
