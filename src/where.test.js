const assert = require('assert');

const Where = require('./where');
const What = require('./what');

let where = new Where();

describe('Where', function () {
  beforeEach(function () {
    where = new Where();
  });

  it('exists', function () {
    assert.ok(where);
  });

  //
  // Push
  //

  describe('Push', function () {
    it('can be pushed something in', function () {
      assert.doesNotThrow(function () {
        const what = new What();
        where.push(what);
      });
    });

    it('really saves something we push there', function (done) {
      where.push(new What({
        content: 'Another note',
        context: ['test567']
      }));
      where.push(new What({
        content: 'Even this note goes there',
        context: ['test123']
      }));
      where.list().then(list => {
        assert.strictEqual(list.length, 2);
        assert.strictEqual(list[0], 'test567');
        assert.strictEqual(list[1], 'test123');
        done();
      }).catch(error => done(error));
    });
  });

  //
  // List
  //

  describe('List', function () {
    it('can provide lists of what is there', function (done) {
      assert.doesNotThrow(function () {
        where.list();
      });
      where.list().then(list => {
        if (!list || !(list instanceof Array)) {
          done(new Error('invalid list: ' + list))
        } else {
          done();
        }
      }).catch(error => done(error));
    });

    it('can search contexts by simple query', function (done) {
      where.push(new What({
        content: 'Note #1',
        context: ['test1']
      }));
      where.push(new What({
        content: 'Note #2',
        context: ['test1', 'test2']
      }));
      where.push(new What({
        content: 'Note #3',
        context: ['test1']
      }));
      where.push(new What({
        content: 'Article #1',
        context: ['articles', 'running']
      }));
      where.push(new What({
        content: 'Idea #1',
        context: ['ideas', 'tests']
      }));
      where.list('test').then(list => {
        assert.strictEqual(list.length, 3);
        assert.strictEqual(list[0], 'test1');
        assert.strictEqual(list[1], 'test1 / test2');
        assert.strictEqual(list[2], 'ideas / tests');
        done();
      }).catch(error => done(error));
    });
  });
});
