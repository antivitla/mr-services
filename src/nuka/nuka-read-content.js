const dialog = require('../dialog/dialog');
const md = require('../md/md');
const readFiles = require('./nuka-read-files');

function readContent(pattern) {
  // Список контент-объектов
  let contentList = [];
  // По каждому файлу из списка
  return readFiles(pattern, (filename, data, nextFile) => {
    // Парсим текст в контент-объекты
    md.parse(data.text, { date: data.date })
    // Утверждаем у пользователя список контент-объектов
    .then(index => dialog.confirmContentList(index))
    // Сохраним список и переходим к следующему файлу
    .then((confirmedIndex) => {
      contentList = contentList.concat(confirmedIndex);
      nextFile();
    });
  })
  // Отдаём список контент-объектов
  .then(() => contentList);
}

module.exports = readContent;
