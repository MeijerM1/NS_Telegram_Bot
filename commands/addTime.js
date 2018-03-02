const dbContext = require('../dbContext');
const schedule = require('node-schedule');
const nsHelper = require('../nsHelper');
const bot = require('../bot');

var timeStamp;

exports.run = (ctx) => {
    if (ctx.state.command.splitArgs.length !== 1) {
        ctx.reply("Invalid argument size, " + exports.help());
        return;
    }

    let time = ctx.state.command.splitArgs[0];

    timeStamp = time;

    if (!checkTime(time)) {
        ctx.reply("invalid time format, use hh:mm");
        return;
    }

    dbContext.getTimesForUser(ctx.from.id, checkUserTimes);
}

function checkUserTimes(results, userId) {
    if (results.length >= 2) {
        bot.sendMessage(userId, "You can only set 2 times at which you want to receive notifications");
        return;
    }

    dbContext.addTime(userId, timeStamp);

    scheduleJob(timeStamp);

    bot.sendMessage(userId, "Time has been added")
}

function checkTime(stringTime) {
    var timePattern = new RegExp(/^([2][0-3]|[01]?[0-9])([.:][0-5][0-9])?$/);
    if (timePattern.test(stringTime) && stringTime.length === 5) {
        return true;
    } else {
        console.log("invalid time format");
        return false;
    }
}

function scheduleJob(time) {
    var hours = time.substring(0, 2);
    var minutes = time.substring(3, 5);

    var rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [0, new schedule.Range(0, 7)];
    rule.hour = parseInt(hours);
    rule.minute = parseInt(minutes);

    var j = schedule.scheduleJob(rule, function (fireDate) {

        var hours = fireDate.getHours();
        var minutes = fireDate.getMinutes();

        if (hours < 10) {
            hours = padNumber(hours, 2);
        }

        if (minutes < 10) {
            minutes = padNumber(minutes, 2);
        }

        var time = hours + ":" + minutes;

        dbContext.getUsersForTime(time, nsHelper.checkStoringForUsers);
    });
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