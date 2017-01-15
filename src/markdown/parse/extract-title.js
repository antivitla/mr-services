// Picks title and return new contentInfoObject
// (possible to merge with old contentInfoObject)
function extractTitle(contentInfoObject) {
  const EOLString = contentInfoObject.content.match(/\r/) ? '\r\n' : '\n';
  const safeEOLRegexp = /\r?\n/g;
  const lines = contentInfoObject.content.split(safeEOLRegexp);
  // we are guaranteed to have some non-whitespace content right from the start,
  // so we take first line
  const title = lines[0];
  // if it is regular title, extract it from content without '#' sign
  const titleMarkdownRegexp = /^#\s+/g;
  if (title.match(titleMarkdownRegexp)) {
    // remove title from content and clean content from trailing \s
    const content = lines.slice(1, lines.length).join(EOLString).replace(/^\s*/g, '');
    return {
      title: title.replace(titleMarkdownRegexp, '').trim(),
      content,
    };
  }
  return {
    title: '',
    content: contentInfoObject.content,
  };
}

module.exports = extractTitle;
