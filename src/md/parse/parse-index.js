const os = require('os');
const util = require('util');
const Content = require('../../content/content');

function parseIndex(contentObject) {
  // Режем на строки
  const lines = contentObject.text
    .split(/\r?\n/g);
  // Сложный парсинг. У нас есть несколько видов строк.
  // При этом есть вложенность, которую надо хранить.
  // Мы сначала строим промежуточный плоский список узлов
  // с указанными путями, а потом скормим его методу
  // построения дерева, который есть у любого контент-объекта
  const flatNodeList = [];
  let currentContentNode = new Content(contentObject);
  // Удаляем текст (его проще заново собрать позже)
  currentContentNode.text = '';
  // Читаем построчно
  lines.forEach((line) => {
    const isIndex = line.match(/^\*\s+\[(.*)\]\((.*)\)/);
    const isNode = line.match(/^(#+)\s+\[(.*)\]\((.*)\)/);
    if (isIndex) {
      // Добавляем leaf-контент-объект к текущему узлу
      currentContentNode.index = currentContentNode.index || [];
      currentContentNode.index.push(new Content({
        id: isIndex[2],
        title: isIndex[1],
      }));
    } else if (isNode) {
      // Добавляем дочерний узел
      const id = isNode[3];
      const title = isNode[2];
      const depth = isNode[1].trim().length;
      // Сохраняем предыдущий узел
      if (currentContentNode) {
        // Лишние отбивки убираем
        currentContentNode.text = currentContentNode.text.replace(/(\r?\n){3,}/, os.EOL.repeat(2));
        // Кладём в список
        flatNodeList.push(currentContentNode);
      }
      // Создаём новый узел, путь добавим чуть позднее
      currentContentNode = new Content({ id, title, type: 'tree', path: [] });
      // Заморочка с путём данного объекта
      // берём данные из предыдущего объекта
      const lastNode = flatNodeList.slice(-1);
      const lastPath = lastNode && lastNode.path ? lastNode.path.slice(0) : [];
      // Если глубина вложенности больше предыдущего
      if (depth > lastPath.length + 2) {
        // Добавляем в путь предыдущий узел
        currentContentNode.path = lastPath.concat([lastNode.title]);
      } else {
        // Если меньше, удаляем лишнее из пути
        while (depth < lastPath.length + 2) lastPath.pop();
        // И запоминаем его
        currentContentNode.path = lastPath.splice(0);
      }
    } else {
      // Добавляем как текст
      currentContentNode.text += currentContentNode.text ? os.EOL + line : line;
    }
  });
  // Добавляем последний узел
  // Лишние отбивки убираем
  currentContentNode.text = currentContentNode.text.replace(/(\r?\n){3,}/, os.EOL.repeat(2));
  // Кладём в список
  flatNodeList.push(currentContentNode);
  // Далее интересно, если наш список из одного элемента,
  // значит это просто узел и собирать его не надо
  // (нет детей-узлов, только максимум дети-контент)
  // Все остальные кроме первого узла - его дети, на разном уровне
  const treeNode = flatNodeList.shift();
  treeNode.addChildren(flatNodeList);
  // Миг победы
  return treeNode;
}

module.exports = parseIndex;
