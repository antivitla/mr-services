const uuid = require('node-uuid');

function Content(model) {
  const defaultModel = {
    id: uuid.v1(),
    date: new Date(),
  };
  Object.assign(this, defaultModel, model);
}

Content.prototype.addChild = function (contentObject, depth = 0) {
  // Для постройки дерева используется title и path
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
    // поступаем хитро мы должны создать промежуточный узел
    // Есть проблема - при повторном апдейте дерева
    // этот прокси-узел заново создаётся, плодя дубликаты
    // Его или надо не создавать, или билдить потом во
    // всех папках содержание а потом перезаписываться им
    // (перезапись в след. условии)
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
    // Можно вставлять, но вдруг у нас уже есть подобный ребёнок?
    // Это отличается от проверки по пути как в начале функции
    const equalChild = this.index.find(item => item.equal(contentObject));
    if (equalChild) {
      // Заменяем им то что есть
      Object.assign(equalChild, contentObject, { parent: this });
    } else {
      // А если все эти сложности не про нас, просто добавляем себе ребёнка
      this.index.push(Object.assign(contentObject, { parent: this }));
    }
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

Content.prototype.equal = function (contentObject, depth) {
  const equalTitle = this.title === contentObject.title;
  const equalPath = JSON.stringify(this.path) === JSON.stringify(contentObject.path);
  return equalPath && equalTitle;
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

Content.prototype.deleteParent = function () {
  const clone = new Content(this);
  delete clone.parent;
  if (clone.index) {
    clone.index = clone.index.map(item => item.deleteParent());
  }
  return clone;
};

module.exports = Content;
