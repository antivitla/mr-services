const prompt = require('prompt-promise');
const chalk = require('chalk');

function titleDialog(title, msg) {
  return new Promise((resolve, reject) => {
    prompt(msg + chalk.gray('Y/n/впиши название '))
      .then((answer) => {
        prompt.done();
        const a = answer.toLowerCase();
        if (!a || a === 'y' || a === 'yes') {
          resolve(title);
        } else if (a === 'n' || a === 'no') {
          reject();
        } else {
          resolve(answer.trim());
        }
      });
  });
}

module.exports = titleDialog;
