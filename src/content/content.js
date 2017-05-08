const uuid = require('node-uuid');

function Content(model) {
  const defaultModel = {
    id: uuid.v1(),
    date: new Date(),
  };
  Object.assign(this, defaultModel, model);
}

Content.prototype.addChild = function (contentObject, depth = 0) {
  // Для постройки дерева используется title и path,
  // Создаём контейнер детей
  this.index = this.index || [];
  // Пытаемся вставить в уже существующего ребёнка
  const existingChild = this.index
    .find(indexItem => indexItem.title === contentObject.path[depth]);
  if (existingChild) {
    existingChild.addChild(contentObject, depth + 1);
  } else if (contentObject.path.slice(depth).length > 1) {
    // В противном случае добавляем ребёнка
    // Если он должен залегать глубже чем на один уровень
    // поступаем хитро
    // мы должны создать промежуточный узел
    const proxyChild = new Content({
      type: 'tree',
      title: contentObject.path[depth],
      path: contentObject.path.slice(0, depth + 1),
      parent: this,
    });
    // и ему передать добавление
    proxyChild.addChild(contentObject, depth + 1);
    // И сохранить себе
    this.index.push(proxyChild);
  } else {
    // А если нет (один уровень), просто добавляем себе ребёнка
    this.index.push(Object.assign(contentObject, { parent: this }));
  }
};

Content.prototype.addChildren = function (children) {
  children.forEach((contentObject) => {
    this.addChild(contentObject);
  });
};

module.exports = Content;
