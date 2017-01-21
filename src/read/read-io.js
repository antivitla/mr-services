const read = require('./read');

const filename = process.argv[2];

if (filename) {
  read.file(filename)
    .then(data => process.stdout.write(data))
    .catch(error => console.log(error));
} else {
  read.input('')
    .then(data => process.stdout.write(data))
    .catch(error => console.log(error));;
}

