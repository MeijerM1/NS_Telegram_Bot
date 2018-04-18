const dbContext = require('../libs/dbContext');
const nsHelper = require('../libs/nsHelper');
const timeFormatter = require("../libs/timeFormatter");
const bot = require('../bot');

var timeStamp;

exports.run = (ctx) => {
    if (ctx.state.command.splitArgs.length !== 1) {
        ctx.reply("Invalid argument size, " + exports.help());
        return;
    }

    let time = ctx.state.command.splitArgs[0];

    if (!timeFormatter.checkTime(time)) {
        ctx.reply("invalid time format, use hh:mm");
        return;
    }

    //time = timeFormatter.decreaseHour(time);

    timeStamp = time;

    dbContext.getTimesForUser(ctx.from.id, checkUserTimes);
}

function checkUserTimes(results, userId) {
    if (results.length >= 2) {
        bot.sendMessage(userId, "You can only set 2 times at which you want to receive notifications");
        return;
    }

    dbContext.addTime(userId, timeStamp);

    nsHelper.scheduleJob(timeStamp);

    bot.sendMessage(userId, "Time has been added")
}


function padNumber(n, p, c) {
    var pad_char = typeof c !== 'undefined' ? c : '0';
    var pad = new Array(1 + p).join(pad_char);
    return (pad + n).slice(-pad.length);
}

exports.help = () => {
    return "usage /addTime [hh:mm]";
}

exports.summary = () => {
    return "Adds a new time at which to receive a status update.";
}