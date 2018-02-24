const Telegraf = require('telegraf');
const commandParts = require('telegraf-command-parts');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(commandParts());

bot.start((ctx) => {
  console.log('started:', ctx.from.id)
  return ctx.reply('Welcome!')
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