const prompt = require('prompt-promise');
const chalk = require('chalk');

function trueConfirm(question, choice) {
  const message = chalk.white(question) + chalk.gray(` [Y/${choice}] `);
  return new Promise((resolve, reject) => {
    prompt(message)
    .then((answer) => {
      prompt.done();
      const a = answer.toLowerCase();
      if (!a || a === 'y' || a === 'yes') {
        resolve();
      } else {
        reject(answer.trim());
      }
    });
  });
}

module.exports = trueConfirm;
