const dbContext = require('../dbContext');
const bot = require('../bot');

exports.run = (ctx) => {
    dbContext.getTimesForUser(ctx.from.id, printResults);
}

function printResults(results, userId) {
    if(results.length === 0) {
        bot.sendMessage(userId, "You don\'t have any times setup yet");
    }

    results.forEach(element => {
        bot.sendMessage(element.userId, element.time)
    });
}