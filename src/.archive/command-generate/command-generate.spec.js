var assert = require("assert");
var util = require("util");
var commandGenerate = require("./command-generate");

describe("Command Generate", function () {
  it ("exists", function () {
    assert(true);
  });
  it ("generates command", function () {
    var command = commandGenerate();
    assert(command.length > 0);
  });
  it ("generates different commands", function () {
    var c1 = commandGenerate();
    var c2 = commandGenerate();
    console.log(c1, c2);
    assert(c1 != c2);
  });
  it ("generates different length", function () {
    var c1 = commandGenerate(4);
    var c2 = commandGenerate(2);
    console.log(c1, c2);
    assert(c1.length == 4);
    assert(c2.length == 2);
  });
  it ("mix vowels and consonants", function () {
    var c1 = commandGenerate(5);
    if (c1[0].match(/[eyuioa]/g)) {
      assert(c1[1].match(/[qwrtpsdfghjklzxcvbnm]/g));
      assert(c1[2].match(/[eyuioa]/g));
      assert(c1[3].match(/[qwrtpsdfghjklzxcvbnm]/g));
    } else if (c1[0].match(/[qwrtpsdfghjklzxcvbnm]/g)) {
      assert(c1[1].match(/[eyuioa]/g));
      assert(c1[2].match(/[qwrtpsdfghjklzxcvbnm]/g));
      assert(c1[3].match(/[eyuioa]/g));
    }
    console.log(c1);
  });
});
