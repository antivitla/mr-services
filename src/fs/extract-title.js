// Picks title and return new contentInfoObject
// (possible to merge with old contentInfoObject)
function extractTitle (contentInfoObject) {
  var EOLString = contentInfoObject.content.match(/\r/) ? "\r\n" : "\n";
  var safeEOLRegexp = /\r?\n/g;
  var lines = contentInfoObject.content.split(safeEOLRegexp);
  // we are guaranteed to have some non-whitespace content right from the start,
  // so we take first line
  var title = lines[0];
  // if it is regular title, extract it from content without '#' sign
  var titleMarkdownRegexp = /^#\s+/g;
  if (title.match(titleMarkdownRegexp)) {
    // remove title from content and clean content from trailing \s
    var content = lines.slice(1, lines.length).join(EOLString).replace(/^\s*/g,"");
    return {
      title: title.replace(titleMarkdownRegexp, "").trim(),
      content: content
    }
  } else {
    return {
      title: "",
      content: contentInfoObject.content
    }
  }
}

module.exports = extractTitle;
