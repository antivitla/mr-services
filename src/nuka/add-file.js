const os = require('os');
const chalk = require('chalk');
const uuid = require('node-uuid');
const dialog = require('../dialog/dialog');
const TreeNode = require('../tree/tree').node;
const refs = require('../refs/refs');
const asyncParseFiles = require('./async-parse-files');

function nukaAddFile(pattern, options) {
  return asyncParseFiles({
    pattern,
    onFileIndexCallback(filename, index, callback) {
      // Сохраняем заметки
      dialog.save(index, options.home)
        .then(() => {
          // Если надо, создаём соотв. структуру
          const suggestTitle = filename.replace('.md', '').split('/').pop();
          const msg = chalk.yellow(`${os.EOL}Для заметок файла '${filename}' создаём структуру c именем '${suggestTitle}'`) + os.EOL;
          dialog.title(suggestTitle, msg)
            .then((title) => {
              const contentTree = new TreeNode({
                title,
                index,
                date: new Date(),
                id: uuid.v1(),
              });
              dialog.save([contentTree], options.home)
                .then(() => {
                  // Сохраняем ссылку
                  refs.update([{
                    title: contentTree.title,
                    id: contentTree.id,
                  }], options.home);
                  callback();
                });
            })
            .catch((error) => {
              if (error) {
                console.log(chalk.red(error));
              }
              callback();
            });
        });
    },
  });
}

module.exports = nukaAddFile;

