var fs = require("fs");

fs.readdir(".", function (error, list) {
    if (error) throw error;
    console.log(list)
});
