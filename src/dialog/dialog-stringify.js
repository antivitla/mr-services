const chalk = require('chalk');
const os = require('os');

function stringify(contentObject) {
  const lines = [];
  // Заголовок
  if (contentObject.title) {
    lines.push(chalk.yellow(`# ${contentObject.title}`));
  }
  // Текст
  if (contentObject.text) {
    lines.push('');
    lines.push(`${chalk.gray(contentObject.text.slice(0, 300))}...`);
  }
  // Индекс
  if (contentObject.index) {
    lines.push('');
    contentObject.index.forEach((item) => {
      let line = chalk.cyan('* ');
      if (item.title) {
        line += chalk.cyan(`${item.title}${item.excerpt ? ': ' : ''}`);
      }
      if (item.excerpt) {
        line += chalk.gray(`${item.excerpt}...`);
      }
      lines.push(line);
    });
  }
  return `${os.EOL}${lines.join(os.EOL)}${os.EOL}`;
}

module.exports = stringify;
