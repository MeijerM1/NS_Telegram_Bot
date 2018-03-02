const fs = require('fs')
const dirName = "./commands"

exports.run = (ctx) => {
  readFiles(dirName, ctx);
}

function readFiles(dirName, ctx) {
  fs.readdir(dirName, function (err, filenames) {
    if (err) {
      console.log(err);
      return;
    }

    filenames.forEach(function (filename) {
      displayHelpForCommand(filename, ctx)
    });
  });
}

function displayHelpForCommand(file, ctx) {
  try {
    let commandFile = require(`../commands/${file}`);
    var message = file.substring(0, file.indexOf('.')) + "\n\n";

    var message = message + commandFile.help() + "\n\n";

    var message = message + commandFile.summary();

    ctx.reply(message);
  } catch (err) {
    console.error(err);
  }
}

exports.help = () => {
  return "Usage /help"
}

exports.summary = () => {
  return "Shows help for all commands."
}