const chalk = require('chalk');
const Content = require('../content/content');
const fs = require('fs-extra-promise');
const dialog = require('../dialog/dialog');
const md = require('../md/md');
const readFiles = require('./nuka-read-files');

function defaultTreeTitle() {
  return process.cwd().split(/\\|\//).pop();
}

function isRootTreeNode(contentObject) {
  const isTreeFile = contentObject.title === defaultTreeTitle();
  const isTreeType = contentObject.type === 'tree';
  const isRoot = !contentObject.path || !contentObject.path.length;
  return isTreeFile && isTreeType && isRoot;
}

function readNode(pattern, { noreplace, silent }) {
  // Собираем список узлов
  const nodeList = [];
  // Проходим по каждому файлу из списка
  return readFiles(pattern, (filename, data, nextFile) => {
    // Парсим текст в контент-объекты
    let pipe = md.parse(data.text, { date: data.date })
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
        // Перезаписываем содержание узла теми заметками что реально есть в файле
        // Но если это единственная заметка, скорей всего это
        // файл дерева и не надо заменять ему детей
        if (index.length) contentObject.index = index.slice(0);
        // Дата
        contentObject.date = contentObject.index && contentObject.index.length ? contentObject.index[0].date : data.date;
        // Возвращаем узел
        return contentObject;
      });
    // Утверждаем у пользователя узел
    if (!silent) {
      pipe = pipe.then(contentObject => dialog.confirmContentAndTitle(contentObject));
    }
    // Перезаписываем исходный файл пользователя
    if (!noreplace) {
      pipe = pipe.then((contentObject) => {
        // Наш узел должен быть единственным в полученном индексе
        // Но мы должны записать не только его
        // но и его детей раздельно
        // Но только если он не узел-дерево
        let list = [contentObject];
        if (!isRootTreeNode(contentObject)) list = list.concat(contentObject.index);
        fs.outputFileAsync(filename, md.stringify(list));
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
