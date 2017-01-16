const parse = require('./markdown').parse;

process.stdin.on('data', (chunk) => {
  parse(chunk.toString('utf8')).then((index) => {
    process.stdout.write(JSON.stringify(index));
  });
});
