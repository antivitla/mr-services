var moment = require("moment");

function createMarkdownIndexEntry (contentObject) {
  var indexTitle = contentObject.title ? contentObject.title : contentObject.id;
  var indexObject = {
    id: contentObject.id,
    date: moment(contentObject.date).toISOString()
  };
  var entry = ("[" + indexTitle + "]")
    .concat("(" + contentObject.id + ".md)")
    .concat("<!-- " + JSON.stringify(indexObject) + " -->")
  return {
    markdownIndexEntry: entry
  };
}

module.exports = createMarkdownIndexEntry;
