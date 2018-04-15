const chalk = require('chalk');
const os = require('os');
const uuid = require('node-uuid');
const asyncParseFiles = require('./async-parse-files');
const dialog = require('../dialog/dialog');
const TreeNode = require('../tree/tree').node;
const refs = require('../refs/refs');

function nukaAddTree(pattern, options) {
  // Исходный список узлов дерева
  const list = [];
  // Собираем файлы с заметками
  return asyncParseFiles({
    pattern,
    onFileIndexCallback(filename, index, callback) {
      // Собираем данные для построения узлов дерева
      const suggestTitle = filename.replace('.md', '').split('/').pop();
      const msg = chalk.yellow(`${os.EOL}Для файла '${filename}'${os.EOL}создаём узел c именем '${suggestTitle}'`) + os.EOL;
      dialog.title(suggestTitle, msg)
        .then((title) => {
          // Формируем элемент списка узла
          const path = filename.replace('.md', '').split('/');
          path[path.length - 1] = title;
          list.push({
            path: path.join('/'),
            index: index.map(item => ({
              id: item.id,
              title: (item.title ? item.title : item.excerpt),
            })),
          });
          // Сохраняем заметки в базу
          dialog.save(index, options.home)
            .then(() => callback())
            .catch((error) => {
              if (error) {
                console.log(chalk.red(error));
              }
              callback();
            });
        })
        .catch((error) => {
          if (error) {
            console.log(chalk.red(error));
          }
          callback();
        });
    },
  })
  .then(() => {
    // Название общей структуры спрашиваем
    const suggestTitle = options.title || 'Новая структура';
    const msg = chalk.bgCyan.white(`${os.EOL}Название всей этой структуры '${suggestTitle}'`) + os.EOL;
    dialog.title(suggestTitle, msg)
      .then((title) => {
        // Делаем дерево структуры
        const contentTree = new TreeNode({ title, date: new Date(), id: uuid.v1() });
        list.forEach((item) => {
          contentTree.addChild(item.path.split('/'), item.index);
        });
        // Сохраняем структуру в базу
        return dialog.save([contentTree], options.home)
          .then(() => {
            // Сохраняем ссылку на структуру
            refs.update([{
              id: contentTree.id,
              title: contentTree.title,
            }], options.home);
          })
          .catch((error) => {
            if (error) {
              console.log(chalk.red(error));
            }
          });
      })
      .catch((error) => {
        if (error) {
          console.log(chalk.red(error));
        }
      });
  });
}

module.exports = nukaAddTree;
