const os = require('os');

const eolRegexp = /\r?\n/g;
const titleRegexp = /^#+\s+/;

function parseTitle(contentObject) {
  const lines = contentObject.text.split(eolRegexp);
  const title = lines[0];
  if (title.match(titleRegexp)) {
    Object.assign(contentObject, {
      title: title.replace(titleRegexp, '').trim(),
      text: lines.slice(1).join(os.EOL).trim(),
    });
  }
  return contentObject;
}

module.exports = parseTitle;
