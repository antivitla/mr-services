var moment = require("moment");

// Extracts date from title and return new mergeable contentObject
function extractDate (contentObject) {
  if (contentObject.title) {
    var titleParts = contentObject.title.split(",");
    var datePartString = titleParts[0].trim();
    var momentFrom = {
      content: moment(contentObject.title, ["D MMMM", "D MMMM YYYY", "MMMM"], "ru"),
      context: moment(contentObject.date ? contentObject.date : new Date())
    }
    if (momentFrom.content.isValid()) {
      // remove date part from title
      titleParts.shift();
      var title = titleParts.join(",").trim();
      // create date
      var result = momentFrom.context;
      var format = momentFrom.content.creationData().format;
      if (format.match(/D/g)) result.date(momentFrom.content.date());
      if (format.match(/MM/g)) result.month(momentFrom.content.month());
      if (format.match(/YY/g)) result.year(momentFrom.content.year());
      return {
        date: result.toISOString(),
        title: title
      };
    }
  }
}

module.exports = extractDate;
