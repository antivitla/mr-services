#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const md = require('./markdown/markdown');
const read = require('./read/read');
const save = require('./save/save');

// Usage
program
  .usage('<command> [options]');

// Add note to database
program
  .version('0.0.1')
  .command('add [file]')
  .action((file) => {
    (file ? read.file(file, { showProgress: true }) : read.input('', { showProgress: true }))
      .then(note => md.parse(note))
      .then(index => save(index));
  });

// Just read to screen
program
  .version('0.0.1')
  .command('read [file]')
  .option('-s, --silent', 'Do not show progress')
  .option('-o, --output', 'Output to stdout (for redirecting output to file or screen)')
  .action((file, options) => {
    const verbose = !options.silent && !options.output;
    if (file) {
      read
        .file(file, { showProgress: verbose })
        .then((text) => {
          if (options.output) {
            process.stdout.write(text);
          }
        });
    } else {
      read
        .input('', { showProgress: verbose })
        .then((text) => {
          if (options.output) {
            process.stdout.write(text);
          }
        });
    }
  });

// Just parse to screen
program
  .version('0.0.1')
  .command('parse [file]')
  .option('-s, --silent', 'Do not show progress')
  .option('-o, --output', 'Output result to stdout (screen or file)')
  .action((file, options) => {
    const verbose = !options.silent && !options.output;
    if (file) {
      read
        .file(file, { showProgress: verbose })
        .then(text => md.parse(text, { showProgress: verbose }))
        .then((index) => {
          if (options.output) {
            process.stdout.write(JSON.stringify(index));
          }
        });
    } else {
      read
        .input('', { showProgress: verbose })
        .then(text => md.parse(text, { showProgress: verbose }))
        .then((index) => {
          if (options.output) {
            process.stdout.write(JSON.stringify(index));
          }
        });
    }
  });

// Parse command line arguments
program.parse(process.argv);

// Show help if no command supplied
if (!process.argv.slice(2).length) {
  program.help(text => chalk.gray(text));
}

// function parseAddCommand(args) {
//   (args._[1] ? read.file(args._[1]) : read.input(''))
//     .then(note => md.parse(note))
//     .then(index => save(index));
// }

// function parseHelpCommand() {
//   console.log('mr [add]');
// }

// function parseArguments(args) {
//   switch (args._[0]) {
//     case 'add':
//       parseAddCommand(args);
//       break;
//     default:
//       parseHelpCommand();
//   }
// }

// parseArguments(parsedArgs);

// // var params = process.argv.slice(3);

// function archive(files) {
//   // var files = process.argv.slice(3);
//   // console.log(files);
//   files.forEach((file) => {
//     fs.move(file, `.archive/${file}`, (error) => {
//       if (error) {
//         console.error(error);
//       }
//     });
//   });
// }

// // check command
// switch (argv._[0]) {
//   case "add":
//     addNote(params);
//     break;
//   case "archive":
//     archive(params);
//     break;
//   default:
//     console.log('Commands: "add \'sometext\'", "archive [filename] [filename]"');
// }

// function add (params) {
//   // Либо пишем из командной строки, либо добавляем из файла - зависит от того
//   // есть ли второй параметр
//   if (!params[0]) {
//     // require("./create/create-item-io")()
//   }
//   fs.access(params[0], function (error) {
//     if (!error) {
//       return require("./add/add-from-file")(params);
//     } else {
//       return require("./add/add-content")(params);
//     }
//   });
// }
