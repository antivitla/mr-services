const os = require('os');
const util = require('util');

function parseTree(contentObject) {
  // Режем на строки
  const lines = contentObject.text
    .split(/(\r\n|\n)/g)
    .map(line => line.trim())
    .filter(line => !line.match(/(\r\n|\n)/g) && line);
  // Сложный парсинг
  // Сначала нужно понять текущую строку:
  // относится ли он к текущему узлу или к новому ребёнку или новому родителю
  const list = [];
  const path = [contentObject.title];
  let index = [];
  const text = lines.filter((line) => {
    const isNode = line.match(/^#+([^\S]|$)/g);
    const isIndex = line.match(/^\* \[(.*)\]\((.*)\)/);
    let title;
    let depth;
    let keepLine = true;
    if (isNode) {
      keepLine = false;
      // Сохраняем предыдущий узел
      if (index.length) {
        const listItem = {};
        listItem.index = index;
        index = [];
        listItem.path = path.join('/');
        list.push(listItem);
      }
      title = line.split(isNode[0])[1].trim();
      // Выясняем глубину залегания узла
      depth = isNode[0].trim().length;
      if (depth === path.length) {
        path.pop();
      }
      if (depth < path.length) {
        while (depth <= path.length) {
          path.pop();
        }
      }
      path.push(title);
    }
    if (isIndex) {
      keepLine = false;
      index.push({ title: isIndex[1], id: isIndex[2] });
    }
    return keepLine;
  }).join(os.EOL);
  // Добавляем последний узел
  list.push({ path: path.join('/'), index: index.slice(0) });
  // Строим дерево
  const TreeNode = require('../../tree/tree').node;
  const tree = new TreeNode();
  list.forEach((item) => {
    tree.addChild(item.path.split('/'), item.index);
  });
  delete tree.children[0].parent;
  Object.assign(contentObject, tree.children[0], { text });
  // console.log(util.inspect(contentObject, { depth: 10 }));
  return contentObject;
}

module.exports = parseTree;
