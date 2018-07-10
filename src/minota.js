#!/usr/bin/env node

'use strict';

const program = require('commander');

program
  .version('1.0.0')
  .usage('minota <command> [options]');

program
  .command('push')
  .action(function () {
    console.log('Minota Push');
  });

// Show help if no command supplied
if (!process.argv.slice(2).length) {
  program.help();
} else {
  program.parse(process.argv);
}
