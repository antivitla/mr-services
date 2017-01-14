var print = require("./print");

function formatter (contentObject, options) {
  var title = print.title(contentObject);
  var content = print.safe(contentObject.content);
  var divider = print.eol().repeat(2);
  var clone = Object.assign ({}, contentObject);
  delete clone.content;
  return title + (content && title ? divider : "") + content + (JSON.stringify(clone) != "{}" ? (divider + "<!-- " + JSON.stringify(clone) + " -->") : "");
}

module.exports = formatter;