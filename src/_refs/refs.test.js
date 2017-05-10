/* eslint-env mocha */
/* eslint prefer-arrow-callback: 0, func-names: 0 */

const assert = require('assert');
// const save = require('./save');
const fs = require('fs-extra-promise');
// const md = require('../md/md');
const refs = require('./refs');

describe('safe ref', function () {
  it('save ref', function (done) {
    const rfc = [{
      title: 'Reference',
      id: '98989a98-98989',
    }, {
      title: 'New reference',
      id: '990-890-9899-abc8',
    }];
    refs.update(rfc)
      .then(() => {
        refs.list().then((list) => {
          assert.ok(list);
          assert.equal(list.length, 2);
          assert.equal(list[0].title, 'Reference');
          assert.equal(list[0].id, '98989a98-98989');
          fs.remove('.mr', function () {
            done();
          });
        });
      });
  });

  it('replace ref', function (done) {
    const rfc = [{
      title: 'Reference',
      id: '98989a98-98989',
    }, {
      title: 'New reference',
      id: '990-890-9899-abc8',
    }];
    refs.update(rfc)
      .then(() => refs.update([{ title: 'Reference', id: '123' }], '.', { replaceId: true }))
      .then(() => {
        refs.list().then((list) => {
          assert.ok(list.find(item => item.id === '123'));
          fs.remove('.mr', function () {
            done();
          });
        });
      });
  });

  after(function (done) {
    fs.remove('.mr', function () {
      done();
    });
  });
});

