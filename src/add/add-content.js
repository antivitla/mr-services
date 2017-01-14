var fs = require("fs-extra");
var moment = require("moment");
var uuid = require("node-uuid");
var create = require("../create/create-item");
var stringify = require("../stringify/stringify");

var pickTitle = require("../parse-file/extract-title");
var pickExсerpt = require("../parse-file/pick-excerpt");

function addContent (params) {
  // 1. create item
  var item = create(params[0]);
  // add title and excerpt
  Object.assign(item, pickTitle(item));
  Object.assign(item, pickExсerpt(item));

  process.stdout.write(stringify(item));
  return stringify(item);
}

module.exports = addContent;