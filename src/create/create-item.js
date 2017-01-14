var moment = require("moment");
var uuid = require("node-uuid");

function createItem (content) {
  return {
    id: uuid.v1(),
    date: moment().toISOString(),
    content: content.trim()
  };
}

module.exports = createItem;