const dbContext = require('../dbContext');
const bot = require('../bot');

exports.run = (ctx) => {
    if(ctx.state.command.splitArgs.length !== 1) {
        bot.sendMessage(ctx.from.id, "Invalid argument size, " + exports.help());
        return;
    }

    if(!checkTime(ctx.state.command.splitArgs[0])) {
        bot.sendMessage(ctx.from.id, "Invalid time format, use hh:mm");
        return;
    }

    dbContext.removeTime(ctx.from.id, ctx.state.command.splitArgs[0], sendConfirmation);
}

function checkTime(stringTime) {
    var timePattern = new RegExp('^([0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$');
    if(timePattern.test(stringTime)) {
        return true;
    } else {
        console.log("invalid time format");
        return false;
    }
}

function sendConfirmation(results, userId) {
    bot.sendMessage(userId, "Time has been removed");
}

exports.help = () => {
    return "usage /removeTime [hh:mm]";
}