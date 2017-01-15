function dropLastWord(str) {
  const words = str.split(/\s+/g);
  words.pop();
  return words.join(' ');
}

function pickExcerpt(contentObject, options) {
  const defaults = Object.assign({
    maxlength: 45,
  }, options);
  let excerpt = contentObject.content.replace(/\r?\n|\s+/g, ' ');
  if (excerpt.length > defaults.maxlength) {
    excerpt = dropLastWord(excerpt.slice(0, defaults.maxlength)).concat('...');
  }
  return {
    excerpt,
  };
}

module.exports = pickExcerpt;
