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
  } else if (contentObject.path.length > depth) {
    // В противном случае добавляем ребёнка
    // Если он должен залегать глубже чем на один уровень
    // поступаем хитро
    // мы должны создать промежуточный узел
    // Есть проблема - при повторном апдейте дерева
    // этот прокси-узел заново создаётся, плодя дубликаты
    // Его или надо не создавать, или билдить потом во
    // всех папках содержание
    const proxyChild = new Content({
      type: 'tree',
      title: contentObject.path[depth],
      path: contentObject.path.slice(0, depth),
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
  // Если мы реально дерево, принудительно подтверждаем что это так
  if (this.index.length) this.type = 'tree';
};

Content.prototype.addChildren = function (children, depth = 0) {
  children.forEach((contentObject) => {
    this.addChild(contentObject, depth);
  });
};

Content.prototype.flatten = function () {
  let list = [this];
  if (this.index) {
    this.index.forEach((item) => {
      list = list.concat(item.flatten());
    });
  }
  return list;
};

Content.prototype.excerpt = function (length = 40) {
  let excerpt = '';
  if (this.text) {
    excerpt = this.text.replace(/(\r?\n){1,}/, ' ').slice(0, length);
    excerpt += (excerpt.length <= length ? '...' : '');
  } else if (this.index) {
    this.index.find((item) => {
      excerpt += item.excerpt(length);
      if (excerpt.length >= length) return true;
      return false;
    });
  } else {
    excerpt = 'Пустой узел?';
  }
  return excerpt;
};

module.exports = Content;
