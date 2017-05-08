const md = require('../md/md');
const dialog = require('../dialog/dialog');
const readEditorText = require('./nuka-read-editor-text');

function readEditor(initial) {
  return readEditorText(initial)
  .then(text => md.parse(text, { date: new Date() }))
  .then(index => dialog.confirmContentList(index));
}

module.exports = readEditor;
