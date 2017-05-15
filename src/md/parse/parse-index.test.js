/* eslint-env mocha */
/* eslint prefer-arrow-callback: 0, func-names: 0 */

const assert = require('assert');
const parseTree = require('./parse-index');
// const os = require('os');
// const util = require('util');

describe('Parse Tree', function () {
  it('1 depth', function () {
    const text = `
# Some Title
[](zok)
[bcd](zak)
[efg](zik)
`;
    const tree = parseTree({ content: text });
    // console.log(tree);
    assert.ok(tree);
    assert.equal(tree.type, 'tree');
    // assert.ok(tree.date);
    assert.equal(tree.index.length, 3);
    assert.ok(!tree.children);
  });

  it('3 depth', function () {
    const text = `
# Some Title
[](zok)
[bcd](zak)

## second
[efg](zik)
[ij](9d9fkfsd)

## second two
[kik](d7878)

### Third
[kl](878)
[mn](878)
[no](dfdfdf99)

#### Forth
[qp](fdjkd9)

## second two
[op](6734)
`;
    const tree = parseTree({ content: text });
    // console.log(tree);
    assert.ok(tree);
    assert.equal(tree.type, 'tree');
    assert.equal(tree.index.length, 2);
    assert.ok(tree.children.length, 3);
    assert.equal(tree.findByTitle('second two')[0].index[0].id, 'd7878');
    assert.equal(tree.findByTitle('second two')[0].index.length, 2);
    assert.ok(tree.findByPath(['Some Title', 'second two', 'Third']).index.length, 3);
  });
});
