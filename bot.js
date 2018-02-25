const Telegraf = require('telegraf');
const commandParts = require('telegraf-command-parts');
const dbContext = require('./dbContext');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(commandParts());

bot.start((ctx) => {
  console.log('started:', ctx.from.id)
    dbContext.addUser(ctx);

  return ctx.reply('Hi welcome to the NS malfunction checker. Before we can get started we need some information, first we need to know what route you travel.' +
    'Use the /route [stationFrom] [stationTo] command to set your travel route. Use the full station name, also if the station name consists of multiple parts use an underscore I.E. "utrecht_centraal"');
});

bot.command('addStation', (ctx) => {
  runCommand(ctx);
});

bot.command('init', (ctx) => {
  runCommand(ctx);
}); 

bot.command('route', (ctx) => {
  runCommand(ctx);
});

function runCommand(ctx) {
  try {
    let commandFile = require(`./commands/${ctx.state.command.command}.js`);
    commandFile.run(ctx);
  } catch (err) {
    console.error(err);
    message.reply("Command not found.");
  }
}

bot.catch((err) => {
  console.log('Error occured: ', err)
})

console.log('Bot initialised');
bot.startPolling()