const md = require('../md/md');

function stdout(index, { format = 'md', nojson, expand } = {}) {
  const stringify = {
    md() {
      return md.stringify(index, { nojson, expand });
    },
    json() {
      const noCircular = index.map(item => item.deleteParent());
      return JSON.stringify(noCircular, null, 2);
    },
  };
  process.stdout.write(stringify[format]());
}

module.exports = stdout;
