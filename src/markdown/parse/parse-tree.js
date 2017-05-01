function parseTree(contentObject) {
  const lines = contentObject.content
    .split(/(\r\n|\n)/g)
    .map(line => line.trim())
    .filter(line => !line.match(/(\r\n|\n)/g) && line);
  // Сложный парсинг
  // Сначала нужно понять текущую линию:
  // относится ли он к текущему узлу или к новому ребёнку или новому родителю
  const list = [];
  const path = [contentObject.title];
  let index = [];
  lines.forEach((line) => {
    const isNode = line.match(/^#+([^\S]|$)/g);
    const isIndex = line.match(/^\[(.*)\]\((.*)\)/);
    let title;
    let depth;
    if (isNode) {
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
      index.push({ title: isIndex[1], id: isIndex[2] });
    }
  });
  // Добавляем последний узел
  list.push({ path: path.join('/'), index: index.slice(0) });
  // Строим дерево
  const TreeNode = require('../../tree/tree').node;
  const tree = new TreeNode();
  list.forEach((item) => {
    tree.addChild(item.path.split('/'), item.index);
  });
  delete tree.children[0].parent;
  return tree.children[0];
}

module.exports = parseTree;
