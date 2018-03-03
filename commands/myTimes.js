const dbContext = require('../dbContext');
const bot = require('../bot');

exports.run = (ctx) => {
    dbContext.getTimesForUser(ctx.from.id, printResults);
}

function printResults(results, userId) {
    var message;

    if (results.length === 0) {
        message = "You don\'t have any times setup yet";
    } else {
        message = "Your are being notified at: \n"

        results.forEach(element => {
            message = message + "- " + increaseHour(element.time) + "\n";
        });
    }

    bot.sendMessage(userId, message);
}

function increaseHour(time) {
    let hours  = Number(time.substring(0,2));
    var newTime;

    if(hours === 23) {
        newTime  = "00" + time.substring(2,5); 
    } else {
        hours++;
        newTime = hours + time.substring(2,5);
    }

    return newTime;
}

exports.help = () => {
    return "Usage /myTimes";
}

exports.summary = () => {
    return "Shows all the times at which you are receiving notifications.";
}