function parseExcerpt(contentObject, length = 45) {
  const line = contentObject.text.replace(/\r?\n|\s+/g, ' ').replace('  ', ' ');
  if (line.length > length) {
    Object.assign(contentObject, { excerpt: line.slice(0, length).trim() });
  } else if (line) {
    Object.assign(contentObject, { excerpt: line });
  }
  return contentObject;
}

module.exports = parseExcerpt;
