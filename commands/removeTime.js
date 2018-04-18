const dbContext = require('../libs/dbContext');
const timeFormatter = require("../libs/timeFormatter");
const bot = require('../bot');

exports.run = (ctx) => {
    if (ctx.state.command.splitArgs.length !== 1) {
        bot.sendMessage(ctx.from.id, "Invalid argument size, " + exports.help());
        return;
    }

    let time = ctx.state.command.splitArgs[0];

    if (!timeFormatter.checkTime(time)) {
        bot.sendMessage(ctx.from.id, "Invalid time format, use hh:mm");
        return;
    }

    //time = timeFormatter.decreaseHour(time);

    dbContext.removeTime(ctx.from.id, time, sendConfirmation);
}

function sendConfirmation(results, userId) {
    bot.sendMessage(userId, "Time has been removed");
}

exports.help = () => {
    return "usage /removeTime [hh:mm]";
}

exports.summary = () => {
    return "You will no longer receive notifications at this time.";
}