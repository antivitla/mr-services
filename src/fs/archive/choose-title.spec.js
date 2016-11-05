var assert = require("assert");
var chooseTitle = require("./choose-title");

describe("Title", function () {
  it("can be formed from title", function () {
    var note = "# Файловая версия (CLI или FileSystem)\r\nМы должны мочь";
    var title = chooseTitle(note);
    assert.equal(title, "Файловая версия (CLI или FileSystem)")
  });
  it("can be formed from text", function () {
    var note = "\r\n\r\nСодержание содержанием, но нам все равно придется хранить куски информации как-то раздельно чтоб можно было пересобирать их в разные представления.";
    var title = chooseTitle(note);
    assert.equal(title, "Содержание содержанием");
  });
  it("is not long", function () {
    var note = "\r\nВ качестве формата доп. данных (переводимых в json) в заметке\r\nYAML Front Matter";
    var title = chooseTitle(note);
    assert.ok(title.length < 40);
  });
  it("is smart", function () {
    var note = "\r\n.В качестве формата - для доп. данных (переводимых в json) в заметке\r\nYAML Front Matter";
    var title = chooseTitle(note);
    assert.equal(title, "В качестве формата - для доп");
  });
});
