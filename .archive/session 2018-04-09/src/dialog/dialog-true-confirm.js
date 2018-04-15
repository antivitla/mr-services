const prompt = require('prompt-promise');
const chalk = require('chalk');

function trueConfirm(question, choice) {
  const q = chalk.white(question);
  const c = chalk.gray(`[Y/${choice}]`);
  const message = `${q} ${c} `;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
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
    }, 10);
  });
}

module.exports = trueConfirm;
