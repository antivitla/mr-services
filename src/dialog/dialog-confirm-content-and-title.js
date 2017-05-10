const async = require('async');
const chalk = require('chalk');
const falseConfirm = require('./dialog-false-confirm');
const stringify = require('./dialog-stringify');
const trueConfirm = require('./dialog-true-confirm');

function confirmContentAndTitle(contentObject) {
  return new Promise((resolve, reject) => {
    console.log(stringify(contentObject));
    trueConfirm('Берём этот узел?', 'n')
      .then(() => {
        falseConfirm(`Изменить название '${contentObject.title}'?`, 'вписать')
        .then((title) => {
          resolve(Object.assign(contentObject, { title }));
        })
        .catch((error) => {
          if (error) console.log(chalk.red(error));
          resolve(contentObject);
        });
      })
      .catch((error) => {
        if (error) console.log(chalk.red(error));
        reject();
      });
  });
}

module.exports = confirmContentAndTitle;
