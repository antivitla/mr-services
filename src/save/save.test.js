var assert = require("assert");
var save = require("./save");
var saveSingle = require("./save-single");
var saveMultiple = require("./save-multiple")
var fs = require("fs-extra");
var formatter = require("../formatter/formatter");
var createItem = require("../create/create-item");

describe("Save items", function () {
  it("один итем за раз, правильный путь имеет", function (done) {
    var input = createItem("Заметочка моя");
    var filepath = ".mr/content/" + input.id.slice(0, 2) + "/" + input.id.slice(2) + ".md";
    // сохраняем
    save(input, function (error) {
      if (!error) {
        // читаем
        fs.access(filepath, fs.constants.R_OK, function (error) {
          assert.ok(!error);
          done();
        });
      } else {
        assert.ok(false);
        done();
      }
    });
  });

  it("один итем за раз, содержимое файла (проверяем длина строки)", function (done) {
    var input = createItem("Ещё заметочка");
    var filepath = ".mr/content/" + input.id.slice(0, 2) + "/" + input.id.slice(2) + ".md";
    var contentLength = formatter(input).length;
    // сохраняем
    save(input, function (error) {
      if (!error) {
        // читаем
        fs.readFile(filepath, function (error, data) {
          assert.equal(data.toString("utf8").length, contentLength);
          done();
        });
      } else {
        assert.ok(false);
        done();
      }
    });
  });

  it("сохраняем несколько итемов за раз", function (done) {
    var items = [
      createItem("Заметочка номер один"),
      createItem("Ещё какая-то идейка на раз"),
      createItem("Какой-то уже список образовывается.")
    ];
    var filepaths = [
      ".mr/content/" + items[0].id.slice(0, 2) + "/" + items[0].id.slice(2) + ".md",
      ".mr/content/" + items[1].id.slice(0, 2) + "/" + items[1].id.slice(2) + ".md",
      ".mr/content/" + items[2].id.slice(0, 2) + "/" + items[2].id.slice(2) + ".md"
    ];
    var contentLengths = [
      formatter(items[0]).length,
      formatter(items[1]).length,
      formatter(items[2]).length
    ];
    save(items, function (error) {
      if (!error) {
        var i = parseInt(Math.random()*3);
        fs.readFile(filepaths[i], function (error, data) {
          assert.equal(data.toString("utf8").length, contentLengths[i]);
          done()
        });
      }
    });
  });

  after(function (done) {
    fs.remove(".mr", function () {
      done();
    });
  });
});

