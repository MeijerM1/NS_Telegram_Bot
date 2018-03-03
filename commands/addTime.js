const dbContext = require('../libs/dbContext');
const schedule = require('node-schedule');
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

    console.log(time);

    time = timeFormatter.decreaseHour(time);

    console.log(time);

    timeStamp = time;

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