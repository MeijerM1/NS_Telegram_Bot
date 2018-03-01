const dbContext = require('../dbContext');
const bot = require('../bot');

exports.run = (ctx) => {
    dbContext.getStationsForUser(ctx.from.id, printResult);
}

function printResult(results, userId) {

    var message;

    if(results.length === 0) {
        message = "You are not being informed about any stations yet. \n"

    } else {
        message = "You are being informed about the following stations: \n"

        results.forEach(element => {
            message = message + "- " + element.name_long + "\n";
        });    
    }

    bot.sendMessage(userId, message);
}