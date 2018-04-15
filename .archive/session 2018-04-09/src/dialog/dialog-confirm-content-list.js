const async = require('async');
const chalk = require('chalk');
const stringify = require('./dialog-stringify');
const trueConfirm = require('./dialog-true-confirm');

function confirmContentList(index) {
  return new Promise((resolve, reject) => {
    const confirmedIndex = [];
    async.eachSeries(index, (contentObject, nextContent) => {
      console.log(stringify(contentObject));
      trueConfirm('Берём эту заметку?', 'n')
      .then(() => {
        confirmedIndex.push(contentObject);
        nextContent();
      })
      .catch((error) => {
        if (error) console.log(chalk.red(error));
        nextContent();
      });
    }, (error) => {
      // Когда всё пропарсили отдаём список
      if (error) reject(error);
      else resolve(confirmedIndex);
    });
  });
}

module.exports = confirmContentList;
