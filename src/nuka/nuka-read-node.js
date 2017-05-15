const chalk = require('chalk');
const Content = require('../content/content');
const fs = require('fs-extra-promise');
const dialog = require('../dialog/dialog');
const md = require('../md/md');
const options = require('../options/options');
const readFiles = require('./nuka-read-files');

function readNode(pattern, { noreplace, silent, keepPath } = {}) {
  // Список узлов
  const nodeList = [];
  // По каждому файлу из списка по маске
  return readFiles(pattern, (filename, data, nextFile) => {
    // Трубопровод промисов
    let pipe;
    // Парсим текст файла в контент-объекты
    pipe = md.parse(data.text, { date: data.date })
      .then((index) => {
        // Сохраняем путь файла, пригодится
        const path = filename.split('/');
        // Либо в файле уже определён узел (ранее),
        // либо это новый узел заметок, для которого
        // его (контент-узел) ещё надо создать.
        // В любом случае конструируем узел сначала
        const contentObject = new Content({ type: 'tree', index: [] });
        // Теперь проверяем есть ли уже в файле описание узла,
        // он (узел-заметка) должен идти первым в списке.
        if (index[0].type === 'tree') {
          // И перезаписываем наш свежесозданный узел
          // его свойствами, плюс удаляем из индекс-списка
          // этот контент-объект (мы в итоге один объект
          // должны возвратить)
          Object.assign(contentObject, index.shift());
          // Из пути выкидываем последний элемент (имя файла)
          // оно нам не нужно больше
          path.pop();
        } else {
          // Значит новый узел, берём имя файла в качестве его имени
          // и удаляем из пути это имя
          contentObject.title = path.pop().replace(options.extRegexp, '');
          // Дата узла это дата создания самого файла заметок.
          contentObject.date = data.date;
        }
        // Дальше надо решить проставлять ли нам путь к данному узлу.
        // Вдруг этот вызов будет использоваться позже для
        // создания дерева
        if (keepPath) contentObject.path = path;
        // Если найдены ещё заметки, добавляем их к узлу
        if (index.length > 0) {
          const leafContent = [];
          index.forEach((indexContentObject) => {
            // Есть ли уже такой объект в исходном узле?
            const found = contentObject.index.find(item => item.id === indexContentObject.id);
            if (found) {
              // Перезаписываем его новыми свойствами
              Object.assign(found, indexContentObject);
            } else if (indexContentObject.type !== 'tree') {
              // Если это простая заметка (не узел и не дерево) сохраняем пока
              leafContent.push(indexContentObject);
            } else {
              // Добавляем в конец, раз это узел
              contentObject.index.push(indexContentObject);
            }
          });
          // TODO: Здесь надо diff делать
          // Добавить их в начало а потом просортировать
          if (leafContent.length) {
            contentObject.index = leafContent.concat(contentObject.index);
          }
          // Сортируем на всякий случай leaf-заметки по дате
          contentObject.sortLeafByDate();
        }
        // Узел готов
        return contentObject;
      });
    // Утверждаем у пользователя узел
    if (!silent) {
      pipe = pipe.then(contentObject => dialog.confirmContentAndTitle(contentObject));
    }
    // Перезаписываем исходный файл пользователя
    if (!noreplace) {
      pipe = pipe.then((contentObject) => {
        // Но мы должны записать не только его
        // но и его leaf-контент раздельно
        const index = [contentObject].concat(contentObject.getLeafChildren());
        fs.outputFileAsync(filename, md.stringify(index));
        return contentObject;
      });
    }
    // Добавляем узел в список
    pipe.then((contentObject) => {
      nodeList.push(contentObject);
      return true;
    })
    // Сигнализируем завершение
    .then(() => nextFile())
    .catch((error) => {
      if (error) console.log(chalk.red(error));
      nextFile();
    });
  })
  // Отдаём список узлов
  .then(() => nodeList);
}

module.exports = readNode;
