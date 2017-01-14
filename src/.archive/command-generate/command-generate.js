function commandGenerate (length) {
  length = length || 3;
  var command = "";
  var abc = [
    "eyuioa",
    "qwrtpsdfghjklzxcvbnm"
  ];
  var vowelFirst = Math.random() - 0.5 > 0;
  for (var i = 0; i < length; i++) {
    var chars = abc[(vowelFirst ? i : i+1)%2];
    command += chars[parseInt(Math.random()*chars.length)];
  }
  return command;
}

if (process) {
  console.log(commandGenerate());
}

module.exports = commandGenerate;