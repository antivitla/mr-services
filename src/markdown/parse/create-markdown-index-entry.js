const moment = require('moment');

function createMarkdownIndexEntry(contentObject) {
  const indexTitle = contentObject.title ? contentObject.title : contentObject.id;
  const indexObject = {
    id: contentObject.id,
    date: moment(contentObject.date).toISOString(),
  };

  const entry = (`[${indexTitle}]`)
    .concat(`(${contentObject.id}.md)`)
    .concat(`<!-- ${JSON.stringify(indexObject)} -->`);

  return {
    markdownIndexEntry: entry,
  };
}

module.exports = createMarkdownIndexEntry;
