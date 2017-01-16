/* eslint-env mocha */
/* eslint prefer-arrow-callback: 0, func-names: 0, object-curly-spacing: 0,
quote-props: 0, quotes: 0, key-spacing: 0 */

const assert = require('assert');
const moment = require('moment');
const stringify = require('./stringify');
const os = require('os');

const lineDivider = os.EOL.repeat(2);

describe('Output content objects', function () {
  it('outputs simple plain object', function () {
    const index = [{
      title: 'Title 1',
      content: 'Content 1',
    }, {
      title: 'Title 2',
      content: 'Content 2',
    }];
    const answer = [
      `# Title 1${lineDivider}Content 1${lineDivider}<!-- ${JSON.stringify({"title":"Title 1"})} -->`,
      `# Title 2${lineDivider}Content 2${lineDivider}<!-- ${JSON.stringify({"title":"Title 2"})} -->`,
    ];
    const output = index.map(stringify);
    output.forEach(function (o, i) {
      assert.equal(o, answer[i]);
    });
  });

  it('outputs with no title', function () {
    const index = [{
      content: 'Content 1',
    }, {
      title: 'Title 2',
      content: 'Content 2',
    }];
    const answer = ['Content 1', `# Title 2${lineDivider}Content 2${lineDivider}<!-- {"title":"Title 2"} -->`];
    const output = index.map(stringify);
    output.forEach(function (o, i) {
      assert.equal(o, answer[i]);
    });
  });

  it('outputs with no content', function () {
    const index = [{
      content: 'Content 1',
    }, {
      title: 'Title 2',
    }];
    const answer = ['Content 1', `# Title 2${lineDivider}<!-- {"title":"Title 2"} -->`];
    const output = index.map(stringify);
    output.forEach(function (o, i) {
      assert.equal(o, answer[i]);
    });
  });

  it('outputs with no content and title', function () {
    const index = [{
    }, {
      title: 'Title 2',
      content: 'Content 1',
    }];
    const answer = ['', `# Title 2${lineDivider}Content 1${lineDivider}<!-- {"title":"Title 2"} -->`];
    const output = index.map(stringify);
    output.forEach(function (o, i) {
      assert.equal(o, answer[i]);
    });
  });

  it('outputs array of items', function () {
    const index = [{
      title: 'Title 1',
      content: 'Content 1',
    }, {
      title: 'Title 2',
      content: 'Content 2',
    }];
    const answer = [
      `# Title 1${lineDivider}Content 1${lineDivider}<!-- ${JSON.stringify({"title":"Title 1"})} -->`,
      `# Title 2${lineDivider}Content 2${lineDivider}<!-- ${JSON.stringify({"title":"Title 2"})} -->`,
    ].join(`${lineDivider}* * *${lineDivider}`);
    assert.equal(answer, stringify(index));
  });

  xit('output with date', function () {
    const contentObject = {
      title: 'Title 1',
      date: moment(),
      content: 'Content 1',
    };
    const output = stringify(contentObject, { date: true });
    const result = `# ${moment().format('DD MMMM YYYY')}, Title 1${lineDivider}Content 2`;
    assert.equal(output, result);
  });

  xdescribe('output with options', function () {
    xit('output with optional date');
    xit('output with non-repeating date');
    xit('output with explicit date');
    xit('output with no date');
    xit('output with content only (no title)');
  });
});
