const dbContext = require('../dbContext');
const schedule = require('node-schedule');
const nsHelper = require('../nsHelper');
const bot = require('../bot');

var timeStamp;

exports.run = (ctx) => {
    if(ctx.state.command.splitArgs.length !== 1) {
        ctx.reply("Invalid argument size, " + exports.help());
        return;
    }

    let time  = ctx.state.command.splitArgs[0];

    timeStamp = time;

    if(!checkTime(time)) {
        ctx.reply("invalid time format, use hh:mm");
        return;
    }

    dbContext.getTimesForUser(ctx.from.id, checkUserTimes);
}

function checkUserTimes(results, userId) {
    console.log(results);

    if(results.length >= 2) {
        bot.sendMessage(userId, "You can only set 2 times at which you want to receive notifications");
        return;
    }

    dbContext.addTime(userId, timeStamp);

    scheduleJob(timeStamp);

    bot.sendMessage(userId, "Time has been added")
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

function scheduleJob(time) {
    console.log(time);
    var hours = time.substring(0, 2);
    var minutes = time.substring(3, 5);

    var rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [0, new schedule.Range(0, 4)];
    rule.hour = parseInt(hours);
    rule.minute = parseInt(minutes);

    var j = schedule.scheduleJob(rule, function(fireDate){
        console.log(fireDate);

        var minutes = fireDate.getMinutes();

        if(minutes.length === 1) {
            minutes = "0" + minutes;
        }

        var time = fireDate.getHours() + ":" + minutes;

        dbContext.getUsersForTime(time, nsHelper.checkStoringForUsers);
    });
}

exports.help = () => {
    return "usage /addTime [hh:mm]";
}