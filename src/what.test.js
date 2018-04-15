const assert = require('assert');

const check = require('./check');
const What = require('./what');

describe('What', function () {
  it('can be created', function () {
    assert.ok(new What());
  });

  it('complies to scheme', function () {
    check({
      options: new What({
        content: 'My content',
        context: ['tests']
      }),
      scheme: {
        content: '',
        context: []
      },
      label: 'test What'
    });
    assert.doesNotThrow(function () {
      check({
        options: new What({
          content: 'My content',
          context: ['tests']
        }),
        scheme: {
          content: '',
          context: []
        },
        label: 'test What'
      });
    });
  });
});
