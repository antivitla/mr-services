const read = require('./read');

read.input('').then((text) => {
  process.stdout.write(text);
});
