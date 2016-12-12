var SortedArray = require("sorted-array");
var notes = new SortedArray();
var Store = {
  save: function (note) {
    notes.push(note);
  },
  get: function () {
    return notes.slice(0);
  }
};
module.exports = Store;