function dropLastWord (str) {
  var words = str.split(/\s+/g);
  words.pop();
  return words.join(" ");
}

function pickExcerpt (contentObject, options) {
  options = Object.assign({
    maxlength: 45
  }, options);
  var excerpt = contentObject.content.replace(/\r?\n|\s+/g, " ");
  if (excerpt.length > options.maxlength) {
    excerpt = dropLastWord(excerpt.slice(0, options.maxlength))
      .concat("...");
  }
  return {
    excerpt: excerpt
  };
}

module.exports = pickExcerpt;
