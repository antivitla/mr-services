const os = require('os');
const get = require('../get/get');
const md = require('../markdown/markdown');
const async = require('async');
const fs = require('fs-extra-promise');
const chalk = require('chalk');

const lineDivider = os.EOL.repeat(2);
const itemDivider = `${lineDivider}* * *${lineDivider}`;

function TreeNode({ title, children, parent, id, type = 'tree', date, index } = {}) {
  if (title) {
    this.title = title;
  }
  if (children) {
    this.children = children;
  }
  if (parent) {
    this.parent = parent;
  }
  if (id) {
    this.id = id;
  }
  if (type) {
    this.type = type;
  }
  if (date) {
    this.date = date;
  }
  if (index) {
    this.index = index;
  }
  // Set path
  if (parent && title) {
    let p = this.parent;
    const path = [title];
    while (p) {
      path.unshift(p.title);
      p = p.parent;
    }
    if (!path[0]) {
      path.shift();
    }
    this.path = path.join('/');
  }
}

TreeNode.prototype.addChild = function (path, index) {
  const child = this.children ? this.children.find(item => item.title === path[0]) : undefined;
  if (child) {
    if (path.length > 1) {
      child.addChild(path.slice(1), index);
    } else {
      child.index = child.index ? child.index.concat(index) : index.slice(0);
    }
  } else {
    this.children = this.children || [];
    this.children.push(new TreeNode({
      title: path[0],
      parent: this,
      type: 'tree',
    }));
    const addedChild = this.children[this.children.length - 1];
    if (path.length > 1) {
      addedChild.addChild(path.slice(1), index);
    } else if (index) {
      addedChild.index = addedChild.index ? addedChild.index.concat(index) : index.slice(0);
    }
  }
};

TreeNode.prototype.stringify = function ({ lines = '', clean = false, depth = 1 } = {}) {
  let result = lines;
  if (depth > 1) {
    result += os.EOL;
  }
  result += `${'#'.repeat(depth)} ${this.title || ''}${os.EOL}`;
  if (this.index) {
    // result += os.EOL;
    for (let i = 0; i < this.index.length; i += 1) {
      result += `[${this.index[i].title || this.index[i].excerpt}](${this.index[i].id})${os.EOL}`;
    }
  }
  if (this.children) {
    for (let i = 0; i < this.children.length; i += 1) {
      result += this.children[i].stringify({ result, clean, depth: depth + 1 });
    }
  }
  return result;
};

TreeNode.prototype.findByPath = function (path) {
  let result;
  if (this.title === path[0]) {
    if (path.length === 1) {
      result = this;
    } else if (path.length > 1 && this.children) {
      this.children.every((child) => {
        const found = child.findByPath(path.slice(1));
        if (found) {
          result = found;
          return false;
        }
        return true;
      });
    }
  }
  return result;
};

TreeNode.prototype.findByTitle = function (title) {
  let result = [];
  if (this.title === title) {
    result.push(this);
  }
  if (this.children) {
    this.children.forEach((child) => {
      const r = child.findByTitle(title);
      result = result.concat(r);
    });
  }
  return result;
};

TreeNode.prototype.checkout = function ({ clean = false, home = '.' } = {}) {
  // Имеем ли мы собственные заметки - создаём файл
  if (this.index) {

    const content = [];
    async.eachSeries(this.index, (item, callback) => {
      get({ home, id: item.id })
        .then((index) => {
          content.push(md.stringify(index));
          callback();
        });
    }, (error) => {
      if (error) {
        console.log(error);
      } else {
        // Теперь имеем все персональные заметки данного узла
        const text = content.join(itemDivider);
        // Выбор имени файла - если мы верхний узел, то {title} пойдет
        if (!this.title) {
          console.log(chalk.red('Как так вышло что узел без {title}?'));
        } else if (!this.parent && this.title) {
          fs.outputFileAsync(`./${this.title}.md`, text)
            .then(() => {
              console.log(chalk.yellow(`${os.EOL}Создан '${this.title}.md'${os.EOL}`));
            });
        } else if (this.parent && this.path) {
          const path = this.path.split('/').slice(1).join('/');
          fs.outputFileAsync(`./${path}.md`, text)
            .then(() => {
              console.log(chalk.yellow(`Создан '${this.title}.md'`));
            });
        }
      }
    });
  }
  // Если есть дети - передаём им управление
  if (this.children) {
    this.children.forEach((child) => {
      child.checkout({ clean, home });
    });
  }
};

module.exports = { node: TreeNode };
