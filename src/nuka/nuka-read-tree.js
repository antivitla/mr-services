const fs = require('fs-extra-promise');
const Content = require('../content/content');
const options = require('../options/options');
const md = require('../md/md');
const readNode = require('./nuka-read-node');

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

function readTree(pattern, { noreplace, silent } = {}) {
  // Получаем список узлов
  return readNode(pattern, { noreplace, silent, keepPath: true })
    .then((index) => {
      // Сначала надо бы отсортировать все узлы
      // по признаку дерево это или нет. Чтобы
      // правильно перезаписывалось всё. Последние
      // перезапишут первых, если что.
      index.sort((a, b) => {
        if (isTreeNode(a) && !isTreeNode(b)) return -1;
        if (!isTreeNode(a) && isTreeNode(b)) return 1;
        return 0;
      });
      // А затем.. хммм, убить лишнее звено пути у узлов-деревьев.
      // Стремноватый ход, но чтобы простроилось дерево и перезаписалось,
      // теми узлами что сделать это нужно сделать.
      index.forEach((item) => {
        if (isTreeNode(item)) item.path.pop();
      });
      // Строим дерево
      let treeObject;
      // Возможно узел нашего главного корневого дерева уже лежит в списке
      // (уже был на диске). Его найти найти
      // и перезаписать его новыми узлами
      const foundTreeId = index.findIndex(item => isRootTreeNode(item));
      if (foundTreeId > -1) {
        // Если нашли, удаляем из списка узлов и запоминаем
        treeObject = index.splice(foundTreeId, 1)[0];
      } else {
        // Раз не нашли, создаём новый
        treeObject = new Content({ title: defaultTreeTitle(), type: 'tree' });
      }
      // Далее конструируем дерево. Если в папках были
      // заметки-деревья, они перезапишут нашу корневую заметку-дерево
      treeObject.addChildren(index);
      // Перезаписываем файл-дерево, но раздельно с его заметками
      const indexToWrite = [treeObject].concat(treeObject.getLeafChildren());
      if (!noreplace) {
        fs.outputFileAsync(`${treeObject.title}${options.ext}`, md.stringify(indexToWrite));
      }
      // Дерево готово
      return [treeObject];
    });
}

module.exports = readTree;
