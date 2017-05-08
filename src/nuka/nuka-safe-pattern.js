function safePattern(userPattern) {
  let pattern = (userPattern === true || !userPattern) ? '**/*.md' : userPattern;
  if (pattern.match(/\.\*$/)) {
    pattern = pattern.replace(/\.\*$/, '.md');
  } else if (pattern) {
    pattern = `${pattern}*.md`;
  }
  return pattern;
}

module.exports = safePattern;
