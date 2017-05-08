const Content = require('../content/content');
const dialog = require('../dialog/dialog');
const md = require('../md/md');
const readFiles = require('./nuka-read-files');

function saveTree(pattern) {
  // Получаем список файлов и по одному обрабатываем
  readFiles(pattern, (filename, data, callback) => {
    // Имеем н
    // Нам нужно составить плоский список узлов
    // с путями внутри дерева.
    // А затем собрать дерево, используя его
    // метод добавления узла по пути
    // Плоский список узлов
    const nodeList = [];
    // Парсим файл
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
      // Проставляем путь
      contentObject.path = filename.split('/');
      // Возвращаем
      return contentObject;
    })
    // Утверждаем у пользователя узел и его контент
    .then(contentObject => new Promise((resolve, reject) => {
      console.log(dialog.stringify(contentObject));
      dialog.trueConfirm('Берём этот узел?', 'n')
      .then(() => {
        dialog.falseConfirm(`Изменить название '${contentObject.title}'?`, 'вписать')
        .then((title) => {
          resolve(Object.assign(contentObject, { title }));
        })
        .catch(() => {
          resolve(contentObject);
        });
      })
      .catch(() => {
        reject();
      });
    }));
  });
}

module.exports = saveTree;
