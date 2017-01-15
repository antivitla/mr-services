const print = require('./print');
const os = require('os');

function stringify(contentObject) {
  const title = print.title(contentObject);
  const content = print.safe(contentObject.content);
  const divider = os.EOL.repeat(2);
  const clone = Object.assign({}, contentObject);
  delete clone.content;
  return title + (content && title ? divider : '') + content + (JSON.stringify(clone) !== '{}' ? (`${divider}<!-- ${JSON.stringify(clone)} -->`) : '');
}

module.exports = stringify;
