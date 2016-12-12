var assert = require("assert");
var moment = require("moment");
var chooseDate = require("./choose-date");

describe("Choose date", function () {
  it("should marge with context year", function () {
    var contextDate = new Date();
    var content = "# 27 мая, Универсальный инструмент\r\n\r\nВсё что я вижу и хочу (выделить) убрать (но сохранив чтоб можно было вернуться) с глаз долой."
    var chosenDate = moment(chooseDate(content, contextDate))
    assert.equal(chosenDate.year(), (new Date()).getFullYear());
    assert.equal(chosenDate.month(), 4);
    assert.equal(chosenDate.date(), 27);
  });
  it("should replace date, month, year", function () {
    var contextDate = new Date();
    var content = "# 17 февраля 2011, Универсальный инструмент\r\n\r\nВсё что я вижу и хочу (выделить) убрать (но сохранив чтоб можно было вернуться) с глаз долой."
    var chosenDate = moment(chooseDate(content, contextDate))
    assert.equal(chosenDate.year(), 2011);
    assert.equal(chosenDate.month(), 1);
    assert.equal(chosenDate.date(), 17);
  });
  it("should catch month", function () {
    var contextDate = new Date();
    var content = "# август, Универсальный инструмент\r\n\r\nВсё что я вижу и хочу (выделить) убрать (но сохранив чтоб можно было вернуться) с глаз долой."
    var chosenDate = moment(chooseDate(content, contextDate))
    assert.equal(chosenDate.year(), (new Date()).getFullYear());
    assert.equal(chosenDate.month(), 7);
  });
});
