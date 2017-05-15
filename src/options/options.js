const chalk = require('chalk');
const os = require('os');
const fs = require('fs-extra-promise');

function loadOptions(filename = 'mr.json') {
  const defaultOptions = {
    home: '.',
    context: {},
    contentDivider: `${os.EOL.repeat(2)}* * *${os.EOL.repeat(2)}`,
    contentDividerRegexp: /\r?\n\*\s+\*\s+\*\s*\r?\n/,
    ext: '.md',
    extRegexp: /\.md$/,
    path: {
      archive: './.archive',
    },
  };
  let options;
  let pathFound;
  const path = process.cwd().split('\\');
  while (path.length > 0) {
    try {
      options = fs.readFileSync(`${path.join('/')}/${filename}`, 'utf-8');
      pathFound = path.join('/');
    } catch (error) {
      // Не найден, идем в след. цикл,
      // с родительской директорией
      path.pop();
    }
    if (options) {
      let optionsObject;
      try {
        optionsObject = JSON.parse(options);
      } catch (error) {
        console.log(chalk.red(`Ошибка в ${filename}, ${error}`));
      }
      // Смешиваем пользовательские и дефолтные настройки
      optionsObject = Object.assign({}, defaultOptions, optionsObject);
      // Проставляем полный путь к базе, на всякий
      optionsObject.home = optionsObject.home === '.' ? pathFound : optionsObject.home;
      return optionsObject;
    }
  }
  return defaultOptions;
}

module.exports = loadOptions('mr.json');
