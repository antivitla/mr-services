// filesystem utils
const fs = require('fs')

// arguments parser
// const argsMinimist = require("minimist")(process.argv.slice(2))

// more powerful arguments manager
const yargs = require('yargs').argv

// config
const config = require('./mr-config.json')

// App
console.log('mr commands', yargs._, config)

// fs.readdir("../", function (error, files) {
// 	console.log(files)
// })

// fs.watch("../docs", { recursive: true }, function (event, filename, zok) {
// 	console.log(event, filename, zok)
// 	if (filename) {
// 		fs.readFile("../docs/" + filename, function (error, data) {
// 			console.log(error, data)
// 		})
// 	}
// })
