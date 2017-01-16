const os = require('os');
const print = require('./print');

const lineDivider = os.EOL.repeat(2);
const itemDivider = `${lineDivider}* * *${lineDivider}`;

function stringifyItem(contentObject) {
  const title = print.title(contentObject);
  const content = print.safe(contentObject.content);
  const clone = Object.assign({}, contentObject);
  delete clone.content;
  return title + (content && title ? lineDivider : '') + content + (JSON.stringify(clone) !== '{}' ? (`${lineDivider}<!-- ${JSON.stringify(clone)} -->`) : '');
}

function stringify(obj) {
  if (!Array.isArray(obj)) {
    return stringifyItem(obj);
  }
  return obj.map(stringifyItem).join(itemDivider);
}

module.exports = stringify;
