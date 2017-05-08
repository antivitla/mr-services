const chalk = require('chalk');

const commentsRegexp = /(^|\r\n|\n)<!--(.|\s)*?-->/g;

function parseProperties(contentObject) {
  const match = contentObject.text.match(commentsRegexp);
  if (match) {
    try {
      const properties = JSON.parse(match[0].replace(/<!--|-->/g, '').trim());
      Object.assign(contentObject, properties);
      // Вынуть свойства из текста
      Object.assign(contentObject, {
        text: contentObject.text.replace(commentsRegexp, '').trim(),
      });
    } catch (error) {
      console.log(chalk.red(error));
    }
  }
  return contentObject;
}

module.exports = parseProperties;
