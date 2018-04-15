const assert = require('assert');

const check = require('./check');

describe('Check', function () {
  it('should follow the scheme', function () {
    assert.throws(function () {
      check();
    });
  });

  it('should throw because some property not present', function () {
    assert.throws(function () {
      check({
        options: {a: 1, b: 2},
        scheme: {a: 3, c: 10},
        label: 'throw'
      });
    });
  });

  it('should throw because class/type not match', function () {
    assert.throws(function () {
      check({
        options: {a: 1, b: 2},
        scheme: {a: 3, b: 'zak'},
        label: 'throw'
      });
    });
    class Abba { constructor () {} }
    class Baab { constructor () {} }
    class Maak { constructor () {} }
    assert.throws(function () {
      check({
        options: {a: new Abba(), b: new Maak()},
        scheme: {a: Abba, b: Baab},
        label: 'throw'
      });
    });
  });

  it('should not throw if class/type match', function () {
    assert.doesNotThrow(function () {
      check({
        options: {a: 1, b: 2},
        scheme: {a: 4, b: 10},
        label: 'notThrow'
      });
    });

    assert.doesNotThrow(function () {
      check({
        options: {a: 'zok', b: 2},
        scheme: {a: 'zak', b: 10},
        label: 'notThrow'
      });
    });

    assert.doesNotThrow(function () {
      class Abba { constructor () {} }
      class Baab { constructor () {} }
      check({
        options: {a: new Abba(), b: new Baab()},
        scheme: {a: Abba, b: Baab},
        label: 'notThrow'
      });
    });
  });
});
