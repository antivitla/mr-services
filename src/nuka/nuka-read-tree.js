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

function isTreeNode(contentObject) {
  return contentObject.title === contentObject.path.slice(-1)[0];
}

function readTree(pattern, { noreplace, silent }) {
  // Нам нужно составить плоский список узлов
  // с путями внутри дерева.
  // А затем собрать дерево, используя его
  // метод добавления узла по пути
  // Плоский список узлов
  const nodeList = [];
  // А ещё список узлов-деревьев
  const treeNodeList = [];
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
          // И из пути убираем его
          contentObject.title = path.pop().replace(/\.md$/, '');
        }
        // Если дальше есть несколько заметок,
        // Сохраняем содержание, перезаписывая возможное дерево в этом файле
        if (index.length) contentObject.index = index.slice(0);
        // Дата
        try {
          contentObject.date = contentObject.index ? contentObject.index[0].date : data.date;
        } catch (error) {
          console.log('Облом с датой в nuka/nuka-read-tree.js', chalk.red(error));
        }
        // Проставляем путь
        contentObject.path = path.slice(0, -1);
        // Проблема 2:
        // Возможно этот файл является картой дерева директории
        // Но при этом сам может обладать заметками... (быть узлом заметок)
        // Проблема 3: мы этот файл можем получить позже чем
        // остальные файлы (а для них создастся айди новый)
        // Найти-то его просто (совпадает имя файла и директории)
        if (isTreeNode(contentObject)) {
          // А что с ним деламть дальше?
          // Может вообще не сохранять промежуточные директории?
          // Иметь раздельно узлы (сохранять) - вроде бы хорошая идея,
          // но и экономия на узлах (всегда имеем только одно дерево)
          // тоже хороша... В конце концов отбилдить можно заново
          // любую изменённую новую директорию
          // Сохраним пока отдельно, но делать с ним ничего не будем...
          // Или нет, используем этот список чтоб игнорировать при
          // построении дерева позже
          treeNodeList.push(contentObject);
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
        // Но только если он не узел-дерево
        let list = [contentObject];
        if (!isRootTreeNode(contentObject)) list = list.concat(contentObject.index);
        fs.outputFileAsync(filename, md.stringify(list));
        // console.log(flatContentList);
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
    // А что если дерево уже есть и лежит рядышком?
    // Берём его как узел и заменяем его структуру полученной
    // (узел дерева должен иметь имя родительской директории и type == 'tree')
    const treeObjectId = nodeList
      .findIndex(nodeItem => isRootTreeNode(nodeItem));
    if (treeObjectId > -1) {
      // Если да, берём его как узел и удаляем из списка узлов
      treeObject = nodeList.splice(treeObjectId, 1)[0];
    } else {
      // Раз нет, создаём новый узел
      treeObject = new Content({ title: defaultTreeTitle(), type: 'tree' });
    }
    // Выкидываем из детей узлы-деревья, сохранённые ранее
    const treeChildren = nodeList.filter(item => treeNodeList.indexOf(item) < 0);
    // И обновляем ему детей
    // Возможно тут diff какой-то надо делать
    // чтобы если структура поменялась, тоже изменить её
    // а не тупо расширить когда мы имели в виду переименовать
    treeObject.addChildren(treeChildren);
    // Перезаписываем файл-дерево
    if (!noreplace) {
      fs.outputFileAsync(`${treeObject.title}.md`, md.stringify([treeObject]));
    }
    // Отдаём дерево
    return [treeObject];
  });
}

module.exports = readTree;
