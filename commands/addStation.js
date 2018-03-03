const dbContext = require("../libs/dbContext");
const bot = require("../bot");

exports.run = (ctx) => {
    if (ctx.state.command.splitArgs.length !== 1 || ctx.state.command.splitArgs[0] === "") {
        bot.sendMessage(ctx.reply("Invalid argument size, " + exports.help()))
        return;
    }

    var stationName = ctx.state.command.splitArgs[0];

    dbContext.getStation(stationName, addStationForUser, ctx.from.id);
}

function addStationForUser(result, userId) {
    console.log(result);

    if (result.length === 0) {
        bot.sendMessage(userId, "No station with that name.");
        return;
    }

    dbContext.AddStationForUser(userId, result[0].id);

    bot.sendMessage(userId, "Your are now receiving notifications about station: " + result[0].name_long);
}

exports.help = () => {
    return "usage /addStation [stationName].";
}

exports.summary = () => {
    return "Adds a new station to watch and receive notification about."
}