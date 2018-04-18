const Telegraf = require('telegraf');
const commandParts = require('telegraf-command-parts');
const dbContext = require('./libs/dbContext');
const defectChecker = require("./libs/defectChecker");
const nsHelper = require('./libs/nsHelper');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(commandParts());


/**
 * Event that fires when someone starts the bot.
 * Add the user to the database and send the begin message.
 */

bot.start((ctx) => {
  console.log('started:', ctx.from.id)
  dbContext.addUser(ctx);

  // FIXME: find an external way of storing messages.
  return ctx.reply('Hi welcome to the NS malfunction checker. Before we can get started we need some information, first we need to know what route you travel.' +
    'Use the /route [stationFrom] [stationTo] command to set your travel route. Use the full station name, also if the station name consists of multiple parts use an underscore I.E. "utrecht_centraal" \n You can use the /help command for extra help if needed.');
});


// All command handlers.
bot.command('addStation', (ctx) => {
  runCommand(ctx);
});

bot.command('myStations', (ctx) => {
  runCommand(ctx);
});

bot.command('removeStation', (ctx) => {
  runCommand(ctx);
});

bot.command('addTime', (ctx) => {
  runCommand(ctx);
});

bot.command('myTimes', (ctx) => {
  runCommand(ctx);
});

bot.command('removeTime', (ctx) => {
  runCommand(ctx);
});

bot.command('route', (ctx) => {
  runCommand(ctx);
});

bot.command('storingen', (ctx) => {
  runCommand(ctx);
});

bot.command('help', (ctx) => {
  runCommand(ctx);
});

// FIXME: make way to catch all commands.
bot.command('[a-zA-Z0-9]', (ctx) => {
  runCommand(ctx);
});

/**
 * Search the command directory for the command the user entered.
 * All commands are stored in seperate files.
 * @param {Context} ctx the telegram context.
 */
function runCommand(ctx) {
  try {
    let commandFile = require(`./commands/${ctx.state.command.command}.js`);
    commandFile.run(ctx);
  } catch (err) {
    console.error(err);
    ctx.reply("Command not found. Use /help for all commands");
  }
}

/**
 * Catch general bot exceptions.
 * Note that self written code should still contain exception handling.
 */
bot.catch((err) => {
  console.log('Error occured: ', err)
})

function initialise() {
  console.log("Initialising");
  nsHelper.initialise();

  setInterval(defectChecker.run, 300000);
}

/**
 * Send a message to a specific user.
 * @param {long} userID The message receipient
 * @param {string} message The message to send
 */
exports.sendMessage = (userID, message) => {
  bot.telegram.sendMessage(userID, message);
}

initialise();
bot.startPolling();