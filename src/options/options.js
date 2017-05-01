const fs = require('fs-extra-promise');

// Load options
function loadOptions(filename = 'mr.json') {
  const defaultOptions = {
    home: '.',
    context: {},
  };
  let options;
  let pathFound;
  const path = process.cwd().split('\\');
  while (path.length > 0) {
    try {
      options = fs.readFileSync(`${path.join('/')}/${filename}`, 'utf-8');
      pathFound = path.join('/');
    } catch (error) {
      // not found
      path.pop();
    }
    if (options) {
      const optionsObject = JSON.parse(options);
      optionsObject.home = optionsObject.home === '.' ? pathFound : optionsObject.home;
      return optionsObject;
    }
  }
  return defaultOptions;
}

module.exports = loadOptions;
