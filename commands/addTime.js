const dbContext = require('../dbContext');
const schedule = require('node-schedule');
const nsHelper = require('../nsHelper');

exports.run = (ctx) => {
    if(ctx.state.command.splitArgs.length !== 1) {
        ctx.reply("Invalid argument size, " + exports.help());
        return;
    }

    var time  = ctx.state.command.splitArgs[0];

    if(!checkTime(time)) {
        ctx.reply("invalid time format, use hh:mm");
        return;
    }

    dbContext.addTime(ctx.from.id, time);

    scheduleJob(time);
}

function checkTime(stringTime) {
    var timePattern = new RegExp(/(00|01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20|21|22|23):?(0|1|2|3|4|5)\d/);
    if(timePattern.test(stringTime)) {
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
    rule.dayOfWeek = [0, new schedule.Range(0, 4)];
    rule.hour = parseInt(hours);
    rule.minute = parseInt(minutes);

    var j = schedule.scheduleJob(rule, function(fireDate){
        console.log(fireDate);

        console.log();
        console.log();

        var time = fireDate.getHours() + ":" + fireDate.getMinutes();

        dbContext.getUserStationForTime(time);
    });
}

exports.help = () => {
    return "usage /addTime [hh:mm]";
}