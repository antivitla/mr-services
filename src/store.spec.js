var assert = require("assert");
var util = require("util");
var store = require("./store");

describe("Store", function () {
  it ("exists", function () {
    assert(store);
  });
  it ("saves notes near each other", function () {
    store.save({content: "Заметка 1"});
    store.save({content: "Заметка 2"});
    var notes = store.get();
    if (Array.isArray(notes)) {
      assert.equal(notes.length, 2);
      assert.equal(notes[0].content, "Заметка 1");
    } else {
      assert.equal(Object.keys(notes).length, 2);
    }
  });
  it ("orders notes by date", function () {
    var d1 = new Date();
    d1.setHours(d1.getHours() + 2);
    var d2 = new Date();
    d2.setHours(d2.getHours() + 1);

    store.save({content: "Заметка 1", date: d1});
    store.save({content: "Заметка 2", date: d2});
    var notes = store.get();
    console.log(util.inspect(notes));
    assert.equal(notes[0].content, "Заметка 2");
  });
});