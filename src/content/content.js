const uuid = require('node-uuid');

function Content(model) {
  const defaultModel = {
    id: uuid.v1(),
    date: new Date(),
  };
  Object.assign(this, defaultModel, model);
}

Content.prototype.addChildSmart = function (contentObject, depth = 0) {
  // Для постройки используется title и path.
  // Создаем контейнер детей
  this.index = this.index || [];
  //
};

Content.prototype.addChild = function (contentObject, depth = 0) {
  // Для постройки дерева используется title и path
  // Создаём контейнер детей
  this.index = this.index || [];
  // Пытаемся вставить в уже существующего ребёнка
  const existingChild = this.index.find((indexItem) => {
    // Надо быть аккуратней - мы можем хотеть добавить
    // не узел, а финальную заметку, причем
    // и итерируемый контент может не иметь названия
    // и совпадать если сравнивать по имени и несуществующему узлу
    if (indexItem.type === 'tree' && indexItem.title) {
      return indexItem.title === contentObject.path[depth];
    }
  });
  if (existingChild) {
    existingChild.addChild(contentObject, depth + 1);
  } else if (contentObject.path.length > depth) {
    // В противном случае добавляем ребёнка
    // Если он должен залегать глубже чем на один уровень
    // поступаем хитро мы должны создать промежуточный узел
    // Правда повторном апдейте дерева
    // этот прокси-узел заново создаётся, если ранее не были
    // добавлены нужные дети.
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
    proxyChild.refreshPath();
  } else {
    // Можно вставлять, но вдруг у нас уже есть подобный ребёнок?
    // Это отличается от проверки по пути как в начале функции
    const equalChild = this.index.find(item => item.equal(contentObject));
    if (equalChild) {
      // Заменяем им то что есть
      Object.assign(equalChild, contentObject, { parent: this });
      equalChild.refreshPath();
    } else {
      // А если все эти сложности не про нас, просто добавляем себе ребёнка,
      // не забывая освежить ему путь, а то мало ли что (вложенные ранее деревья)
      this.index.push(Object.assign(contentObject, { parent: this }));
      contentObject.refreshPath();
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
  let index = [this];
  if (this.index) {
    this.index.forEach((child) => {
      index = index.concat(child.flatten());
    });
  }
  return index;
};

Content.prototype.equal = function (contentObject, depth) {
  const equalTitle = this.title === contentObject.title;
  const equalPath = JSON.stringify(this.path) === JSON.stringify(contentObject.path);
  return equalPath && equalTitle;
};

Content.prototype.excerpt = function (length = 40) {
  let excerpt = '';
  if (this.text) {
    excerpt = this.text.replace(/\r\n|\n/g, ' ').slice(0, length);
  } else if (this.index) {
    this.index.find((item) => {
      excerpt += item.excerpt(length)
        .replace(/^\.\.\./g, '')
        .concat(' ');
      if (excerpt.length >= length) return true;
      return false;
    });
  } else if (this.title) {
    excerpt = this.title;
  } else {
    excerpt = 'Пустой узел?';
  }
  return `...${excerpt}`;
};

Content.prototype.deleteParent = function () {
  const clone = new Content(this);
  delete clone.parent;
  if (clone.index) {
    clone.index = clone.index.map(item => item.deleteParent());
  }
  return clone;
};

Content.prototype.refreshPath = function () {
  const path = [];
  let parent = this.parent;
  if (parent) {
    while (parent.parent) {
      path.unshift(parent.title);
      parent = parent.parent;
    }
    this.path = path;
  }
  if (this.index) {
    this.index.forEach((item) => {
      if (item.type === 'tree' || item.index) {
        Object.assign(item, { parent: this });
        item.refreshPath();
      }
    });
  }
};

Content.prototype.sortLeafByDate = function () {
  if (this.index && this.index.length) {
    this.index.sort((a, b) => {
      if (a.type !== 'tree' && b.type === 'tree') return -1;
      if (a.type === 'tree' && b.type !== 'tree') return 1;
      if (a.type !== 'tree' && b.type !== 'tree') {
        if (a.date - b.date < 0) return -1;
        if (a.date - b.date > 0) return 1;
      }
      return 0;
    });
  }
};

Content.prototype.getLeafChildren = function () {
  return this.index.filter(item => item.type !== 'tree');
};

// Content.prototype.

module.exports = Content;
