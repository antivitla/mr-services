const md = require('../md/md');
const dialog = require('../dialog/dialog');
const readEditorText = require('./nuka-read-editor-text');

function readEditor(initial, { silent }) {
  let pipe = readEditorText(initial)
  .then(text => md.parse(text, { date: new Date() }));
  if (!silent) {
    pipe = pipe.then(index => dialog.confirmContentList(index));
  }
  return pipe;
}

module.exports = readEditor;
