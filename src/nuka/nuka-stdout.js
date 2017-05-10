const md = require('../md/md');

function stdout(index, { format = 'md', nojson, expand } = {}) {
  const stringify = {
    md() {
      return md.stringify(index, { nojson, expand });
    },
    json() {
      return JSON.stringify(index);
    },
  };
  process.stdout.write(stringify[format]());
}

module.exports = stdout;
