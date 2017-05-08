const prompt = require('prompt-promise');
const chalk = require('chalk');

function falseConfirm(question, choice) {
  const q = chalk.white(question);
  const c = chalk.gray(`[${choice}/N]`);
  const message = `${q} ${c} `;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
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
    }, 10);
  });
}

module.exports = falseConfirm;
