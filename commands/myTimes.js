const dbContext = require('../libs/dbContext');
const bot = require('../bot');
const timeFormatter = require('../libs/timeFormatter');

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
            message = message + "- " + element.time + "\n";
        });
    }

    bot.sendMessage(userId, message);
}

exports.help = () => {
    return "Usage /myTimes";
}

exports.summary = () => {
    return "Shows all the times at which you are receiving notifications.";
}