const os = require('os');

const lineDivider = os.EOL.repeat(2);
const itemDivider = `${lineDivider}* * *${lineDivider}`;

function stringify(contentObjectList, { depth = 1 } = {}) {
  return contentObjectList.map((contentObject) => {
    const clone = Object.assign({}, contentObject);
    let lines = [];
    if (contentObject.title) {
      lines.push(`${'#'.repeat(depth)} ${contentObject.title}`);
      delete clone.title;
    }
    if (contentObject.text && depth === 1) {
      lines.push(contentObject.text);
    }
    if (contentObject.index) {
      lines.push(contentObject.index
        .map(item => `* [${item.title || item.excerpt}](${item.id})`)
        .join(os.EOL));
      delete clone.index;
    }
    if (contentObject.children) {
      lines = lines.concat(contentObject.children
        .map(item => stringify([item], { depth: depth + 1 })));
      delete clone.children;
    }
    delete clone.path;
    delete clone.excerpt;
    delete clone.parent;
    delete clone.text;
    if (depth === 1) {
      lines.push(`<!-- ${JSON.stringify(clone)} -->`);
    }
    return lines.join(lineDivider);
  }).join(itemDivider);
}

// function stringifyTree(treeObject, { clean = false } = {}) {
//   const TreeNode = require('../../tree/tree').node;
//   const tree = new TreeNode(treeObject);
//   let text = tree.stringify({ clean });
//   const properties = {
//     id: tree.id,
//     date: moment(tree.date),
//     type: 'tree',
//   };
//   text += `${os.EOL}<!-- ${JSON.stringify(properties)} -->${os.EOL}`;
//   return text;
// }

// function stringifyItem(contentObject, { clean = false } = {}) {
//   let result;
//   if (contentObject.type === 'tree') {
//     result = stringifyTree(contentObject, { clean });
//   } else {
//     const title = print.title(contentObject);
//     const content = print.safe(contentObject.content);
//     const clone = Object.assign({}, contentObject);
//     delete clone.content;
//     delete clone.title;
//     const properties = (JSON.stringify(clone) !== '{}' ? (`${lineDivider}<!-- ${JSON.stringify(clone)} -->`) : '');
//     result = title + (content && title ? lineDivider : '') + content + (!clean ? properties : '');
//   }
//   return result;
// }

// function stringify(obj, options) {
//   if (!Array.isArray(obj)) {
//     return stringifyItem(obj, options);
//   }
//   return obj.map(item => stringifyItem(item, options)).join(itemDivider);
// }

module.exports = stringify;
