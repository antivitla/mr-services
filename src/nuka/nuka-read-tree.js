const chalk = require('chalk');
const Content = require('../content/content');
const fs = require('fs-extra-promise');
const dialog = require('../dialog/dialog');
const md = require('../md/md');
const readFiles = require('./nuka-read-files');

function readTree(pattern, { noreplace, silent }) {
  // Нам нужно составить плоский список узлов
  // с путями внутри дерева.
  // А затем собрать дерево, используя его
  // метод добавления узла по пути
  // Плоский список узлов
  const nodeList = [];
  // Получаем список файлов и по одному обрабатываем
  return readFiles(pattern, (filename, data, nextFile) => {
    // Парсим файл
    let pipe = md.parse(data.text, { date: data.date })
      .then((index) => {
        // Сохраняем путь, пригодится
        const path = filename.split('/');
        // Конструируем контент-узел
        const contentObject = new Content({ type: 'tree' });
        if (index[0].type === 'tree') {
          // Если первый объект это узел,
          // то считаем его содержанием дальнейших заметок,
          // и удаляем из списка
          Object.assign(contentObject, index.shift());
        } else {
          // если нет, берём в качестве заголовка имя файла
          contentObject.title = path.slice(-1)[0].replace(/\.md$/, '');
        }
        // Сохраняем содержание
        contentObject.index = index.slice(0);
        // Дата
        contentObject.date = contentObject.index ? contentObject.index[0].date : data.date;
        // Проставляем путь
        contentObject.path = path.map(part => part.trim()).slice(0, -1);
        // Проблема 2:
        // Возможно этот файл является картой дерева директории
        // Но при этом сам может обладать заметками... (быть узлом заметок)
        // Найти-то его просто (соападает имя файла и директории)
        if (contentObject.title === path.slice(-2)[0].trim()) {
          // а что с ним деламть дальше?
          // может вообще не сохраять промежуточные директории?
        }
        // Возвращаем
        return contentObject;
      });
    // Утверждаем у пользователя узел и его контент
    if (!silent) {
      pipe = pipe.then(contentObject => dialog.confirmContentAndTitle(contentObject));
    }
    // Перезаписываем исходный файл пользователя
    if (!noreplace) {
      pipe = pipe.then((contentObject) => {
        // Наш узел должен быть единственным в полученном индексе
        // Но мы должны записать не только его
        // но и его детей раздельно
        const flatContentList = [contentObject].concat(contentObject.index);
        fs.outputFileAsync(filename, md.stringify(flatContentList));
        return contentObject;
      });
    }
    // Добавляем узел в список для построения дерева
    pipe.then((contentObject) => {
      nodeList.push(contentObject);
      return true;
    })
    // Сигнализируем завершение и ошибки
    .then(() => nextFile())
    .catch((error) => {
      if (error) console.log(chalk.red(error));
      nextFile();
    });
  })
  .then(() => {
    // Список узлов собран, строим дерево
    let treeObject;
    // Название берём из родительского каталога
    const title = process.cwd().split(/\\|\//).pop();
    // А что если дерево уже есть и лежит рядышком?
    // Берём его как узел и заменяем его структуру полученной
    // (узел дерева должен иметь имя родительской директории и type == 'tree')
    const treeObjectId = nodeList
      .findIndex(nodeItem => nodeItem === title && nodeItem.type === 'tree');
    if (treeObjectId > -1) {
      // Если да, берём его как узел и удаляем из списка узлов
      treeObject = nodeList.split(treeObjectId, 1)[0];
    } else {
      // Раз нет, создаём новый узел
      treeObject = new Content({ title, type: 'tree' });
    }
    // Заменяем ему детей
    // А может надо вычислить разницу, забрать id?
    delete treeObject.index;
    treeObject.addChildren(nodeList);
    // Отдаём дерево
    return [treeObject];
  });
}

module.exports = readTree;
