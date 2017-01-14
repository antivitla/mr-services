var SortedArray = require("mr-sorted-array");

var notes = new SortedArray([], {
  getKey: function (item) { return item.date; }
});

var Store = {
  save: function (note) {
    notes.insert(note);
  },
  get: function () {
    return notes.data.slice(0);
  },
  clear: function () {
    notes.data.splice(0, notes.data.length);
  }
};

module.exports = Store;