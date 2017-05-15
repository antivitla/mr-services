const options = require('../options/options');

function safePattern(userPattern) {
  let pattern = (userPattern === true || !userPattern) ? `**/*${options.ext}` : userPattern;
  if (pattern.match(/\.\*$/)) {
    pattern = pattern.replace(/\.\*$/, '.md');
  } else if (!pattern.match(options.extRegexp)) {
    pattern = `${pattern}*${options.ext}`;
  }
  return pattern;
}

module.exports = safePattern;
