/*

Копируем данные на сервер (хранилище):

```
scheme = {
  where: {},
  what: {}
}

push(scheme);
```

*/

const assert = require('assert');

const push = require('./push');
const scheme = require('./push.scheme');
const What = require('./what');
const Where = require('./where');

describe('Push', function () {
  it('should push note to store', function () {
    let myNote = new What();
    let myStore = new Where();
    assert.ok(push({
      what: myNote,
      where: myStore
    }));
  });

  it('arguments should follow scheme', function () {
    assert.throws(function () { push(); });
    assert.throws(function () { push({}); });
    assert.throws(function () { push({ notes: [], stores: [] }); });
    assert.doesNotThrow(function () {
      push({
        where: new Where(),
        what: new What()
      });
    });
  });
});
