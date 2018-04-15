const chalk = require('chalk');
const moment = require('moment');
const os = require('os');

function shortExcerpt(contentObject) {
  const e = contentObject.excerpt.length < contentObject.text.length ? '...' : '';
  return `${contentObject.excerpt}${e}`;
}

function longExcerpt(contentObject, limit) {
  const e = contentObject.text.length > limit ? '...' : '';
  return `${contentObject.text.slice(0, limit)}${e}`;
}

function stringify(contentObject) {
  const lines = [];

  // Заголовок
  if (contentObject.title) {
    lines.push('');
    lines.push(chalk.yellow(`# ${contentObject.title}`));
  }
  // Текст
  if (contentObject.text) {
    lines.push('');
    lines.push(chalk.gray(longExcerpt(contentObject, 300)));
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
        line += chalk.gray(shortExcerpt(item));
      }
      lines.push(line);
    });
  }
  // Дата
  lines.push('');
  lines.push(chalk.magenta(moment(contentObject.date).format('LLL')));
  return `${os.EOL}${lines.join(os.EOL)}${os.EOL}`;
}

module.exports = stringify;
