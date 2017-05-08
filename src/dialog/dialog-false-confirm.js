const prompt = require('prompt-promise');
const chalk = require('chalk');

function falseConfirm(question, choice) {
  const message = chalk.white(question) + chalk.gray(` [${choice}/N] `);
  return new Promise((resolve, reject) => {
    prompt(message)
    .then((answer) => {
      prompt.done();
      const a = answer.toLowerCase();
      if (!a || a === 'n' || a === 'no') {
        reject();
      } else {
        resolve(answer.trim());
      }
    });
  });
}

module.exports = falseConfirm;
